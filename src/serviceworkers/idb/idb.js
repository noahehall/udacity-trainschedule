import idb from 'idb';
import * as consts from 'constants.js';

export class idbKeyval {
  constructor (dbName, initialStore) {
    this.dbName = dbName;
    this.store = `${initialStore}${consts.CACHE_VERSION}`;
    this.dbPromise = idb.open(
      this.dbName,
      consts.CACHE_VERSION || 1,
      (upgradeDB) => {
        const curVer = upgradeDB.oldVersion;
        const neededVer = consts.CACHE_VERSION;

        // works for creating stores starting at index 0 and no stores exist
        let idx = Number(neededVer) > Number(curVer) ?
          curVer :
          (neededVer - curVer) === curVer ?
            0 :
            0;
        if (curVer === idx && idx !== 0) idx++;

        console.log(`curVer: ${curVer}, neededVer: ${neededVer}, idx: ${idx}, names ${JSON.stringify(upgradeDB.objectStoreNames)}`);
        while (idx <= neededVer) {
          console.log(`idx in loop: ${idx}, ${upgradeDB.objectStoreNames[idx]}`);
          upgradeDB.createObjectStore(`${initialStore}${idx++}`);
        }
      }
    );
  }

  clear (store = this.store) {
    return this.dbPromise.then((db) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).clear(key);

      return tx.complete;
    });
  }

  delete (key, store = this.store) {
    return this.dbPromise.then((db) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);

      return tx.complete;
    });
  }

  get (key, store = this.store) {
    return this.dbPromise.then((db) =>
      db.transaction(store).objectStore(store).get(key)
    );
  }

  keys (store = this.store) {
    return this.dbPromise.then((db) => {
      const tx = db.transaction(store);
      const keys = [];
      const thisStore = tx.objectStore(store);

      // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
      // openKeyCursor isn't supported by Safari, so we fall back
      (thisStore.iterateKeyCursor || thisStore.iterateCursor).call(thisStore, (cursor) => {
        if (!cursor) return;
        keys.push(cursor.key);
        cursor.continue();
      });

      return tx.complete.then(() => keys);
    });
  }

  set (key, val, store = this.store) {
    return this.dbPromise.then((db) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put(val, key);

      return tx.complete;
    });
  }
}

export default idbKeyval;