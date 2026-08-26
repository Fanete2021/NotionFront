import { Extension, ReactRenderer } from '@tiptap/react';
import Suggestion, { SuggestionProps } from '@tiptap/suggestion';
import { items, SlashItem } from '../model/slash-items';
import { SlashMenu } from '../ui/slash-menu/SlashMenu';

export const SlashCommands = Extension.create({
  name: 'SlashCommands',
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '/',
        startOfLine: true,

        items: ({ query }) => {
          return items.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
        },

        command: ({ editor, range, props: command }) => {
          editor.chain().focus().deleteRange(range).run();

          command.execute({ editor });
        },
        render: () => {
          let component: ReactRenderer | null = null;
          let selectedIndex = 0;
          let currentProps: SuggestionProps<SlashItem> | null = null;

          const updateMenu = () => {
            if (!component || !currentProps) return;

            component.updateProps({
              items: currentProps.items,
              commands: currentProps.command,
              selectedIndex,
              onSelectedIndexChange: (index: number) => {
                selectedIndex = index;
                updateMenu();
              },
            });
          };

          const updatePosition = () => {
            const rect = currentProps?.clientRect?.();

            if (!component || !rect) return;

            Object.assign(component.element.style, {
              position: 'fixed',
              left: `${rect.left}px`,
              top: `${rect.bottom}px`,
              zIndex: '1000',
            });
          };

          return {
            onStart(props) {
              currentProps = props;
              selectedIndex = 0;

              component = new ReactRenderer(SlashMenu, {
                editor: props.editor,
                props: {
                  items: props.items,
                  command: props.command,
                  selectedIndex,
                  onSelectedIndexChange: (index: number) => {
                    selectedIndex = index;
                    updateMenu();
                  },
                },
              });

              document.body.appendChild(component.element);
              updatePosition();
            },

            onUpdate(props) {
              currentProps = props;
              selectedIndex = 0;

              updateMenu();
              updatePosition();
            },

            onKeyDown({ event }) {
              if (!currentProps) return false;

              const itemCount = currentProps.items.length;

              if (itemCount === 0) {
                return false;
              }

              if (event.key === 'ArrowDown') {
                selectedIndex = (selectedIndex + 1) % itemCount;

                updateMenu();
                return true;
              }

              if (event.key === 'ArrowUp') {
                selectedIndex = (selectedIndex - 1 + itemCount) % itemCount;

                updateMenu();
                return true;
              }

              if (event.key === 'Enter') {
                const selectedItem = currentProps.items[selectedIndex];

                if (selectedItem) {
                  currentProps.command(selectedItem);
                }

                return true;
              }

              if (event.key === 'Escape') {
                return false;
              }

              return false;
            },

            onExit() {
              component?.element.remove();
              component?.destroy();
              component = null;

              currentProps = null;
              selectedIndex = 0;
            },
          };
        },
      }),
    ];
  },
});
