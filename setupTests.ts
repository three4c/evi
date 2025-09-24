import "@testing-library/jest-dom";

vi.stubGlobal("chrome", {
  runtime: {
    sendMessage: vi.fn(),
  },
  storage: {
    sync: {
      get: vi.fn().mockResolvedValue({ shortcuts: undefined }),
      set: vi.fn().mockResolvedValue(undefined),
    },
    onChanged: {
      addListener: vi.fn(),
    },
  },
});

vi.stubGlobal("defineContentScript", (config: unknown) => config);
