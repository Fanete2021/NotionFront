import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleDragEnd } from './handleDragEnd';
import { makeCtx } from './utils/makeCtx';

describe('handleDragEnd (dispatcher)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('scheduleActiveIdReset, если over = null', async () => {
    const ctx = makeCtx();
    await handleDragEnd({ ...ctx, event: { active: { id: 'a' }, over: null } as never });
    expect(ctx.scheduleActiveIdReset).toHaveBeenCalledWith('a');
  });

  it('scheduleActiveIdReset, если active.id === over.id', async () => {
    const ctx = makeCtx();
    await handleDragEnd({
      ...ctx,
      event: { active: { id: 'a' }, over: { id: 'a' } } as never,
    });
    expect(ctx.scheduleActiveIdReset).toHaveBeenCalledWith('a');
  });

  it('scheduleActiveIdReset, если нет currentWorkspaceId', async () => {
    const ctx = makeCtx();
    await handleDragEnd({
      ...ctx,
      currentWorkspaceId: '',
      event: { active: { id: 'a' }, over: { id: 'b' } } as never,
    });
    expect(ctx.scheduleActiveIdReset).toHaveBeenCalledWith('a');
  });

  it('пропускает reorder, если local рассинхронизирован с server', async () => {
    const ctx = makeCtx();
    ctx.localPages = [{ id: 'p1' } as never];
    ctx.serverPages = [{ id: 'p2' } as never];

    await handleDragEnd({ ...ctx, event: { active: { id: 'p1' }, over: { id: 'p2' } } as never });

    expect(ctx.scheduleActiveIdReset).toHaveBeenCalledWith('p1');
    expect(ctx.updatePage).not.toHaveBeenCalled();
    expect(ctx.updateProject).not.toHaveBeenCalled();
  });
});
