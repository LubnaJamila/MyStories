const dbName = "OfflineStoriesDB";
const storeName = "stories";

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function saveStory(story) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);

    const getRequest = store.get(story.id);
    getRequest.onsuccess = () => {
      if (getRequest.result) {
        alert("Cerita sudah tersimpan secara offline.");
        resolve(false);
      } else {
        const addRequest = store.add(story);
        addRequest.onsuccess = () => {
          alert("Cerita berhasil disimpan secara offline!");
          resolve(true);
        };
        addRequest.onerror = () => {
          alert("Gagal menyimpan cerita offline.");
          reject(addRequest.error);
        };
      }
    };
    getRequest.onerror = () => {
      alert("Gagal mengakses database.");
      reject(getRequest.error);
    };
  });
}
export async function getAllStories() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}
export async function deleteStory(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.delete(id);

    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}
  