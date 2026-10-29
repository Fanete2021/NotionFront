'use client';

import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import type { Content } from '@tiptap/core';
import Image from '@tiptap/extension-image';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import { TableKit } from '@tiptap/extension-table';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { TextStyle, Color } from '@tiptap/extension-text-style';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCaret from '@tiptap/extension-collaboration-caret';
import { TextSelection, type Selection } from '@tiptap/pm/state';
import classNames from 'classnames';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import styles from './TextEditor.module.css';
import { SlashCommands } from './lib/slash-commands';
import { useEditorComments, type EditorComments } from './lib/useEditorComments';
import { formatItems, tableItems } from './model/bubble-items';
import ImageUploadNode from './ui/image-upload-node/ImageUploadNode';
import VideoUploadNode from './ui/video-upload-node/VideoUploadNode';
import VideoNode from './ui/video-node/VideoNode';
import { UploadFileContext, type UploadFile } from './model/uploadFileContext';
import type { YjsSocketProvider } from '@/entities/page';
import { Button } from '@shared/ui/button';
import ChainIcon from '@shared/assets/icons/chain-icon.svg';
import PaletteIcon from '@shared/assets/icons/palette.svg';
import TableIcon from '@shared/assets/icons/editor-table.svg';
import CommentIcon from '@shared/assets/icons/comment.svg';
import { Typography } from '@shared/ui/typography';
import XCloseIcon from '@shared/assets/icons/x-close-2.svg';
import { CommentAnchor } from '@shared/lib/tiptap/comment-anchor';

const textColors = [
  { value: null, colorName: 'Сбросить цвет' },
  { value: '#111827', colorName: 'Чёрный' },
  { value: '#EF4444', colorName: 'Красный' },
  { value: '#10B981', colorName: 'Зелёный' },
  { value: '#F59E0B', colorName: 'Оранжевый' },
  { value: '#2563EB', colorName: 'Синий' },
  { value: '#6366F1', colorName: 'Фиолетовый' },
] as const;

type TextEditorProps = {
  content?: string | Record<string, unknown> | null;
  editable?: boolean;
  onChange?: (json: Record<string, unknown>) => void;
  onUploadFile?: UploadFile;
  provider?: YjsSocketProvider | null;
  user?: { name: string; color: string } | null;
  comments?: EditorComments;
};

type BubbleButtonProps = {
  label: string;
  isActive?: boolean;
  className?: string;
  onClick: () => void;
  children: ReactNode;
};

const BubbleButton = ({ label, isActive, className, onClick, children }: BubbleButtonProps) => (
  <Button
    variant="clear"
    size="sm"
    square
    aria-label={label}
    className={classNames(styles.bubbleButton, className, {
      [styles.bubbleButtonActive]: isActive,
    })}
    onClick={onClick}
  >
    {children}
  </Button>
);

const uploadLocalFile: UploadFile = (file) => Promise.resolve(URL.createObjectURL(file));

function isTextSelection(selection: Selection): selection is TextSelection {
  return selection instanceof TextSelection;
}

export const TextEditor = ({
  content = '',
  editable = true,
  onChange,
  onUploadFile,
  provider,
  user,
  comments,
}: TextEditorProps) => {
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const initialJsonRef = useRef<string | null>(null);
  const isCollaborative = Boolean(provider);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          link: { openOnClick: false },
          dropcursor: { color: '#6366F1', width: 2 },
          ...(isCollaborative ? { undoRedo: false } : {}),
        }),

        TaskList,
        TaskItem.configure({ nested: true }),

        SlashCommands,
        TextStyle,
        Color,
        Image,
        ImageUploadNode,
        VideoUploadNode,
        VideoNode,
        CommentAnchor,

        TableKit.configure({
          table: { resizable: true },
        }),

        ...(provider
          ? [
              Collaboration.configure({
                document: provider.doc,
              }),
              CollaborationCaret.configure({
                provider,
                user: user ?? { name: 'Гость', color: '#6366F1' },
              }),
            ]
          : []),
      ],
      content: isCollaborative ? undefined : ((content ?? '') as Content),
      editable,
      immediatelyRender: false,
      onUpdate: ({ editor: ed }) => {
        const json = ed.getJSON();

        if (!isCollaborative) {
          const serialized = JSON.stringify(json);

          if (initialJsonRef.current === null) {
            initialJsonRef.current = serialized;
            return;
          }
          if (serialized === initialJsonRef.current) return;
        }

        onChangeRef.current?.(json as Record<string, unknown>);
      },
      editorProps: {
        attributes: {
          class: styles.editor,
        },
      },
    },
    [provider],
  );

  const { addComment, highlightSelector } = useEditorComments(editor, comments);

  useEffect(() => {
    if (editor && initialJsonRef.current === null && !isCollaborative) {
      initialJsonRef.current = JSON.stringify(editor.getJSON());
    }
  }, [editor, isCollaborative]);

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      if (!editor.isActive('table')) {
        setIsTableOpen(false);
      }
    };

    editor.on('selectionUpdate', handleUpdate);
    return () => {
      editor.off('selectionUpdate', handleUpdate);
    };
  }, [editor]);

  const activeMarks = useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      formats: formatItems.map((item) => (ed ? item.isActive(ed) : false)),
      link: ed?.isActive('link') ?? false,
      color: (ed?.getAttributes('textStyle')?.color as string | undefined) ?? null,
      table: ed?.isActive('table') ?? false,
      hasSelection: ed ? !ed.state.selection.empty : false,
    }),
  });

  const handleLinkClick = () => {
    if (!editor) return;

    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Введите URL', previousUrl ?? 'https://');

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const handleShouldShow = () => {
    if (!editable || !editor) return false;
    if (editor.isActive('table')) return true;

    const selection = editor?.state.selection;
    return selection ? isTextSelection(selection) && !selection.empty : false;
  };

  const currentColor = activeMarks?.color ?? null;

  const runTableCommand = (command: () => void) => {
    command();
    setIsTableOpen(false);
  };

  return (
    <div className={styles.root}>
      {highlightSelector && (
        <style>{`${highlightSelector} { background-color: var(--color-comment-anchor-bg); border-bottom: 2px solid var(--color-comment-anchor-border); }`}</style>
      )}
      {editor && (
        <>
          <DragHandle editor={editor}>
            <div className={styles.dragHandle}>⋮⋮</div>
          </DragHandle>
          <BubbleMenu editor={editor} className={styles.bubble} shouldShow={handleShouldShow}>
            {formatItems.map((item, index) => (
              <BubbleButton
                key={item.label}
                label={item.label}
                isActive={activeMarks?.formats[index]}
                className={item.className && styles[item.className]}
                onClick={() => item.execute(editor)}
              >
                {item.text}
              </BubbleButton>
            ))}
            <BubbleButton label="Ссылка" isActive={activeMarks?.link} onClick={handleLinkClick}>
              <ChainIcon className={styles.bubbleIcon} />
            </BubbleButton>
            <BubbleButton
              label="Цвет текста"
              isActive={isColorOpen || currentColor !== null}
              onClick={() => {
                setIsColorOpen((open) => !open);
                setIsTableOpen(false);
              }}
            >
              <PaletteIcon className={styles.bubbleIcon} />
            </BubbleButton>
            {comments && activeMarks?.hasSelection && (
              <BubbleButton label="Комментировать" onClick={addComment}>
                <CommentIcon className={styles.bubbleIcon} />
              </BubbleButton>
            )}

            {isColorOpen && (
              <div className={styles.colorPanel}>
                {textColors.map(({ value, colorName }) => {
                  const isResetSwatch = value === null;
                  const isSwatchActive = isResetSwatch
                    ? currentColor === null
                    : currentColor === value;

                  return (
                    <Button
                      key={isResetSwatch ? 'default' : value}
                      variant="clear"
                      aria-label={colorName}
                      className={classNames(styles.colorSwatch, {
                        [styles.colorSwatchDefault]: isResetSwatch,
                        [styles.colorSwatchActive]: isSwatchActive,
                      })}
                      style={isResetSwatch ? undefined : { backgroundColor: value }}
                      onClick={() => {
                        if (isResetSwatch) {
                          editor.chain().focus().unsetColor().run();
                        } else {
                          editor.chain().focus().setColor(value).run();
                        }
                        setIsColorOpen(false);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {activeMarks?.table && (
              <div className={styles.tableMenuWrapper}>
                <BubbleButton
                  label="Действия с таблицей"
                  isActive={isTableOpen}
                  onClick={() => {
                    setIsTableOpen((open) => !open);
                    setIsColorOpen(false);
                  }}
                >
                  <TableIcon className={styles.bubbleIcon} />
                </BubbleButton>

                {isTableOpen && (
                  <div className={styles.tablePanel}>
                    {tableItems.map(({ label, icon: Icon, execute }) => (
                      <Button
                        key={label}
                        variant="clear"
                        className={styles.tablePanelItem}
                        onClick={() => runTableCommand(() => execute(editor))}
                      >
                        <Icon className={styles.icon} />
                        {label}
                      </Button>
                    ))}
                    <div className={styles.tablePanelDivider} />
                    <Button
                      variant="clear"
                      className={classNames(styles.tablePanelItem, styles.tablePanelItemDanger)}
                      onClick={() =>
                        runTableCommand(() => editor.chain().focus().deleteTable().run())
                      }
                    >
                      <Typography variant="text-medium" className={styles.tablePanelIcon}>
                        <XCloseIcon />
                      </Typography>
                      Удалить таблицу
                    </Button>
                  </div>
                )}
              </div>
            )}
          </BubbleMenu>
        </>
      )}
      <UploadFileContext value={onUploadFile ?? uploadLocalFile}>
        <EditorContent editor={editor} />
      </UploadFileContext>
    </div>
  );
};
