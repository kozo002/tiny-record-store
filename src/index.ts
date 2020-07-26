type RecordID = number | null;
type RecordType = {
  id: RecordID;
};
type RecordStoreData = {
  record: RecordType | null;
  editing: RecordType | null;
};
type RecordStore = Map<RecordID, RecordStoreData>;
type Watcher = (snapshot: RecordStore) => void;
type Watchers = Map<string, Watcher>;

export function initializeStore(records: RecordType[]): RecordStore {
  let store: RecordStore = new Map();
  records.forEach((record) => {
    store.set(record.id, { record, editing: null });
  });
  return store;
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function initializeWatchers(
  store: RecordStore
): {
  runAllWatchers: () => void;
  setWatcher: (watcher: Watcher) => void;
  __watchers: Watchers;
} {
  const watchers: Watchers = new Map();
  const runAllWatchers = () => {
    watchers.forEach((watcher: Watcher) => {
      watcher(store);
    });
  };
  const setWatcher = (watcherFunc: Watcher) => {
    const watcherID = uuidv4();
    watchers.set(watcherID, watcherFunc);
    const unwatch = () => {
      watchers.delete(watcherID);
    };
    return unwatch;
  };
  return { runAllWatchers, setWatcher, __watchers: watchers };
}

export function createRecordStore(records: RecordType[]) {
  const store = initializeStore(records);
  const { runAllWatchers, setWatcher } = initializeWatchers(store);

  return {
    get(id: RecordID, options: { editing?: boolean } = {}): null | RecordType {
      if (!id) {
        return null;
      }
      const data = store.get(id);
      if (data) {
        if (options.editing) {
          return data.editing;
        }
        return data.record;
      }
      return null;
    },

    set(record: RecordType, options: { editing?: boolean } = {}) {
      let data = store.get(record.id);
      if (data) {
        if (options.editing) {
          data.editing = record;
        } else {
          data.record = record;
        }
      } else {
        if (options.editing) {
          data = { record: null, editing: record };
        } else {
          data = { record, editing: null };
        }
      }
      store.set(record.id, data);
      runAllWatchers();
    },

    setList(records: RecordType[]) {
      records.forEach((record) => {
        let data = store.get(record.id);
        if (data) {
          data.record = record;
        } else {
          data = { record, editing: null };
        }
        store.set(record.id, data);
      });
    },

    delete(id: RecordID, options: { editing?: boolean } = {}) {
      if (!id) {
        return;
      }
      let data = store.get(id);
      if (data) {
        if (options.editing) {
          data.editing = null;
          store.set(id, data);
        } else {
          store.delete(id);
        }
        runAllWatchers();
      }
    },

    watch: setWatcher,

    get count(): number {
      return Array.from(store.keys()).length;
    },
  };
}
