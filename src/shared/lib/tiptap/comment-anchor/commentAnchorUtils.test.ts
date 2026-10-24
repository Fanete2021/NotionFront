import { describe, expect, it } from 'vitest';
import { getSchema, type JSONContent } from '@tiptap/core';
import { Node as PmNode } from '@tiptap/pm/model';
import StarterKit from '@tiptap/starter-kit';
import { CommentAnchor } from './CommentAnchor';
import {
  collectCommentAnchorTexts,
  createCommentAnchorId,
  findCommentAnchorRanges,
} from './commentAnchorUtils';

const schema = getSchema([StarterKit, CommentAnchor]);

const anchor = (anchorId: string) => ({ type: 'commentAnchor', attrs: { anchorId } });

const paragraph = (...content: JSONContent[]): JSONContent => ({ type: 'paragraph', content });

const toDoc = (...content: JSONContent[]) => PmNode.fromJSON(schema, { type: 'doc', content });

describe('findCommentAnchorRanges', () => {
  it('находит все куски якоря', () => {
    const doc = toDoc(
      paragraph(
        { type: 'text', text: 'Привет, ' },
        { type: 'text', text: 'мир', marks: [anchor('a')] },
      ),
      paragraph({ type: 'text', text: 'ещё', marks: [anchor('a')] }),
    );

    const ranges = findCommentAnchorRanges(doc, 'a');

    expect(ranges.map(({ from, to }) => doc.textBetween(from, to))).toEqual(['мир', 'ещё']);
  });

  it('не путает разные якоря', () => {
    const doc = toDoc(paragraph({ type: 'text', text: 'текст', marks: [anchor('b')] }));

    expect(findCommentAnchorRanges(doc, 'a')).toEqual([]);
  });
});

describe('collectCommentAnchorTexts', () => {
  it('склеивает соседние куски без пробела, а несмежные — через пробел', () => {
    const doc = toDoc(
      paragraph(
        { type: 'text', text: 'жир', marks: [anchor('a'), { type: 'bold' }] },
        { type: 'text', text: 'ный', marks: [anchor('a')] },
        { type: 'text', text: ' обычный ' },
        { type: 'text', text: 'хвост', marks: [anchor('a')] },
      ),
      paragraph({ type: 'text', text: 'абзац', marks: [anchor('a')] }),
    );

    expect(collectCommentAnchorTexts(doc)).toEqual({ a: 'жирный хвост абзац' });
  });

  it('собирает пересекающиеся якоря', () => {
    const doc = toDoc(
      paragraph(
        { type: 'text', text: 'один ', marks: [anchor('a')] },
        { type: 'text', text: 'общий', marks: [anchor('a'), anchor('b')] },
        { type: 'text', text: ' два', marks: [anchor('b')] },
      ),
    );

    expect(collectCommentAnchorTexts(doc)).toEqual({ a: 'один общий', b: 'общий два' });
  });

  it('возвращает пустой объект, если якорей нет', () => {
    expect(collectCommentAnchorTexts(toDoc(paragraph({ type: 'text', text: 'текст' })))).toEqual(
      {},
    );
  });
});

describe('createCommentAnchorId', () => {
  it('выдаёт разные id', () => {
    expect(createCommentAnchorId()).not.toBe(createCommentAnchorId());
  });
});
