import { renderHook, act } from "@testing-library/react";
import { useAuthUser } from "@/hooks/useAuthUser";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  })),
}));

const STORAGE_KEY = "lendsqr_userName";

beforeEach(() => {
  localStorage.clear();
});

beforeEach(() => {
  localStorage.clear();
});

// +

test("stores and returns the local part of a valid email", () => {
  const { result } = renderHook(() => useAuthUser());
  act(() => result.current.storeNameFromEmail("ada@lendsqr.com"));
  expect(result.current.displayName).toBe("ada");
  expect(localStorage.getItem(STORAGE_KEY)).toBe("ada");
});

test("reads a pre-existing name from localStorage on mount", () => {
  localStorage.setItem(STORAGE_KEY, "ada");
  const { result } = renderHook(() => useAuthUser());
  expect(result.current.displayName).toBe("ada");
});

test("trims whitespace before extracting the local part", () => {
  const { result } = renderHook(() => useAuthUser());
  act(() => result.current.storeNameFromEmail("  ada@lendsqr.com  "));
  expect(result.current.displayName).toBe("ada");
  expect(localStorage.getItem(STORAGE_KEY)).toBe("ada");
});

test("uses only the part before the first @ for multi-@ emails", () => {
  const { result } = renderHook(() => useAuthUser());
  act(() => result.current.storeNameFromEmail("ada@@lendsqr.com"));
  expect(result.current.displayName).toBe("ada");
  expect(localStorage.getItem(STORAGE_KEY)).toBe("ada");
});

// -

test("returns fallback when localStorage is empty", () => {
  const { result } = renderHook(() => useAuthUser());
  expect(result.current.displayName).toBe("---");
});

test("uses the whole string as the name when there is no @ symbol", () => {
  const { result } = renderHook(() => useAuthUser());
  act(() => result.current.storeNameFromEmail("invalidemail"));
  expect(result.current.displayName).toBe("invalidemail");
  expect(localStorage.getItem(STORAGE_KEY)).toBe("invalidemail");
});
