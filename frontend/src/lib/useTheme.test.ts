import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("light");
});

test("defaults to dark theme", () => {
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe("dark");
  expect(document.documentElement.classList.contains("light")).toBe(false);
});

test("toggles to light theme", () => {
  const { result } = renderHook(() => useTheme());
  act(() => result.current.toggleTheme());
  expect(result.current.theme).toBe("light");
  expect(document.documentElement.classList.contains("light")).toBe(true);
});

test("persists theme to localStorage", () => {
  const { result } = renderHook(() => useTheme());
  act(() => result.current.toggleTheme());
  expect(localStorage.getItem("theme")).toBe("light");
});

test("reads saved theme from localStorage", () => {
  localStorage.setItem("theme", "light");
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe("light");
  expect(document.documentElement.classList.contains("light")).toBe(true);
});
