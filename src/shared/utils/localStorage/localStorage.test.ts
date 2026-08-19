import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { loadCurrentWorkspace } from './localStorage';
import { STORAGE_KEY } from '@/shared/const/storageKeys';

describe('loadCurrentWorkspace', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    vi.resetAllMocks();
    global.window = originalWindow;
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it('should return the value from localStorage if the key exists', () => {
    const mockValue = 'workspace-123';
    const getItemMock = vi.fn().mockReturnValue(mockValue);
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: getItemMock },
      writable: true,
      configurable: true,
    });

    const result = loadCurrentWorkspace();

    expect(result).toBe(mockValue);
    expect(getItemMock).toHaveBeenCalledTimes(1);
    expect(getItemMock).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('should return null if the key does not exist in localStorage', () => {
    const getItemMock = vi.fn().mockReturnValue(null);
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: getItemMock },
      writable: true,
      configurable: true,
    });

    const result = loadCurrentWorkspace();

    expect(result).toBeNull();
    expect(getItemMock).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('should return null if localStorage.getItem returns undefined', () => {
    const getItemMock = vi.fn().mockReturnValue(undefined);
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: getItemMock },
      writable: true,
      configurable: true,
    });

    const result = loadCurrentWorkspace();

    expect(result).toBeNull();
    expect(getItemMock).toHaveBeenCalledWith(STORAGE_KEY);
  });

  it('should return null when running on the server (window is undefined)', () => {
    // @ts-expect-error — удаляем window для имитации серверного окружения
    delete global.window;

    const result = loadCurrentWorkspace();

    expect(result).toBeNull();

    global.window = originalWindow;
  });

  it('should use the correct storage key constant', () => {
    const getItemMock = vi.fn().mockReturnValue('some-value');
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: getItemMock },
      writable: true,
      configurable: true,
    });

    loadCurrentWorkspace();

    expect(getItemMock).toHaveBeenCalledWith(STORAGE_KEY);
    expect(typeof STORAGE_KEY).toBe('string');
  });
});
