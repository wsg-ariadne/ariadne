const openDatabase = () => new Promise((res, rej) => {
  const request = indexedDB.open('ariadne', 1);
  request.onerror = (event) => {
    console.error(`browser/storage: Error ${event.target.errorCode}`)
    rej();
  };
  
  // Declare schema
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
  
    // Create storage for stats per URL
    const urlStatsStore = db.createObjectStore('stats', { keyPath: 'url' })
    urlStatsStore.createIndex('url', 'url', { unique: true })
  
    // Create storage for badge states per tab
    const badgeStateStore = db.createObjectStore('badgeStates', { keyPath: 'tabId' })
    badgeStateStore.createIndex('tabId', 'tabId', { unique: true })
  
    // Create storage for Calliope results per URL
    const calliopeStore = db.createObjectStore('calliope', { keyPath: 'url' })
    calliopeStore.createIndex('url', 'url', { unique: true })
  
    // Create storage for Janus results per URL
    const janusStore = db.createObjectStore('janus', { keyPath: 'url' })
    janusStore.createIndex('url', 'url', { unique: true })
  }

  request.onsuccess = (event) => {
    console.log('browser/storage: Database ready');
    res(event.target.result);
  }
});


export const setTransaction = async (store, data) => {
  console.log('browser/storage(set): Opening DB');

  const db = await openDatabase();
  const t = db.transaction(store, 'readwrite');
  const s = t.objectStore(store);
  return await new Promise((res, rej) => {
    t.oncomplete = () => console.log('browser/storage(set): Complete');
    t.onerror = (e) => rej(e);

    const r = s.put(data);
    r.onsuccess = () => res();
  });
}

export const getTransaction = async (store, key) => {
  console.log('browser/storage(get): Opening DB');

  const db = await openDatabase();
  const t = db.transaction(store, 'readonly');
  const s = t.objectStore(store);
  return await new Promise((res, rej) => {
    t.oncomplete = () => console.log('browser/storage(get): Complete');
    t.onerror = (ev) => rej(ev);

    const r = s.get(key);
    r.onsuccess = (e) => res(e.target.result);
  });
}

export const deleteTransaction = async (store, key) => {
  console.log('browser/storage(delete): Opening DB');

  const db = await openDatabase();
  const t = db.transaction(store, 'readwrite');
  const s = t.objectStore(store);
  return await new Promise((res, rej) => {
    t.oncomplete = () => {
      console.log('browser/storage(delete): Complete');
      res();
    };
    t.onerror = (e) => rej(e);
    s.delete(key);
  });
}
