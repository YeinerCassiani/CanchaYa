import { openDB } from 'idb';

const dbName = 'sportsReservations';
const version = 1;

const initDB = async () => {
  const db = await openDB(dbName, version, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('email', 'email', { unique: true });
      }

      if (!db.objectStoreNames.contains('reservations')) {
        const reservationStore = db.createObjectStore('reservations', { keyPath: 'id' });
        reservationStore.createIndex('userId', 'userId', { unique: false });
        reservationStore.createIndex('date', 'date', { unique: false });
        reservationStore.createIndex('courtId', 'courtId', { unique: false });
      }

      if (!db.objectStoreNames.contains('courts')) {
        const courtStore = db.createObjectStore('courts', { keyPath: 'id' });
        courtStore.createIndex('name', 'name', { unique: true });
      }
    },
  });

  const courts = await db.getAll('courts');
  if (courts.length === 0) {
    const initialCourts = [
      { id: 1, name: 'Cancha de Fútbol 1', type: 'fútbol', capacity: 10 },
      { id: 2, name: 'Cancha de Fútbol 2', type: 'fútbol', capacity: 10 },
      { id: 3, name: 'Cancha de Baloncesto 1', type: 'baloncesto', capacity: 6 },
      { id: 4, name: 'Cancha de Tenis 1', type: 'tenis', capacity: 2 },
    ];

    const tx = db.transaction('courts', 'readwrite');
    await Promise.all([
      ...initialCourts.map(court => tx.store.add(court)),
      tx.done,
    ]);
  }

  return db;
};

export const dbPromise = initDB();

export const db = {
  async addUser(user) {
    const db = await dbPromise;
    return db.add('users', user);
  },

  async getUser(id) {
    const db = await dbPromise;
    return db.get('users', id);
  },

  async getUserByEmail(email) {
    const db = await dbPromise;
    const tx = db.transaction('users', 'readonly');
    const index = tx.store.index('email');
    return index.get(email);
  },

  async addReservation(reservation) {
    const db = await dbPromise;
    return db.add('reservations', reservation);
  },

  async getReservation(id) {
    const db = await dbPromise;
    return db.get('reservations', id);
  },

  async getUserReservations(userId) {
    const db = await dbPromise;
    const tx = db.transaction('reservations', 'readonly');
    const index = tx.store.index('userId');
    return index.getAll(userId);
  },

  async getReservationsByDate(date) {
    const db = await dbPromise;
    const tx = db.transaction('reservations', 'readonly');
    const index = tx.store.index('date');
    return index.getAll(date);
  },

  async updateReservation(id, updates) {
    const db = await dbPromise;
    return db.put('reservations', { ...updates, id });
  },

  async deleteReservation(id) {
    const db = await dbPromise;
    return db.delete('reservations', id);
  },

  async getCourts() {
    const db = await dbPromise;
    return db.getAll('courts');
  },

  async getCourt(id) {
    const db = await dbPromise;
    return db.get('courts', id);
  },
}; 