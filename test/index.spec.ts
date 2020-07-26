import {
  createRecordStore,
  initializeStore,
  initializeWatchers,
} from "../src/index";

describe("initializeStore", () => {
  it("creates a new store by using the records argument", () => {
    const records = [
      { id: 1, name: "foo" },
      { id: 2, name: "bar" },
    ];
    const store = initializeStore(records);
    expect(store).toBeInstanceOf(Map);
    expect(Array.from(store)).toEqual([
      [1, { record: { id: 1, name: "foo" }, editing: null }],
      [2, { record: { id: 2, name: "bar" }, editing: null }],
    ]);
  });
});

describe("initializeWatchers", () => {
  it("creates a new watchers by using the store argument", () => {
    const records = [
      { id: 1, name: "foo" },
      { id: 2, name: "bar" },
    ];
    const store = initializeStore(records);
    const watchers = initializeWatchers(store);
    expect(watchers.runAllWatchers).toBeInstanceOf(Function);
    expect(watchers.setWatcher).toBeInstanceOf(Function);
    expect(watchers.__watchers).toBeInstanceOf(Map);
  });

  describe("setWatcher", () => {
    it("sets a watcher function to the watchers", () => {
      const records = [
        { id: 1, name: "foo" },
        { id: 2, name: "bar" },
      ];
      const store = initializeStore(records);
      const watchers = initializeWatchers(store);
      const watcherFunc = jest.fn();
      watchers.setWatcher(watcherFunc);
      expect(Array.from(watchers.__watchers)).toEqual([
        [expect.any(String), watcherFunc],
      ]);
    });
  });

  describe("runAllWatchers", () => {
    it("runs all of watcherFunc", () => {
      const records = [
        { id: 1, name: "foo" },
        { id: 2, name: "bar" },
      ];
      const store = initializeStore(records);
      const watchers = initializeWatchers(store);
      const watcherFunc = jest.fn();
      watchers.setWatcher(watcherFunc);
      watchers.runAllWatchers();
      expect(watcherFunc).toHaveBeenCalledWith(store);
    });
  });
});
