import { create } from 'zustand';
import { openDB } from 'idb';

const dbPromise = openDB('sports-courts-db', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('users')) {
      db.createObjectStore('users', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('reservations')) {
      db.createObjectStore('reservations', { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains('courts')) {
      db.createObjectStore('courts', { keyPath: 'id' });
    }
  },
});

const useStore = create((set, get) => ({
  user: null,
  reservations: [],
  courts: [],
  loading: false,
  isDarkMode: false,

  setDarkMode: (isDark) => set({ isDarkMode: isDark }),

  login: async (email, password) => {
    const db = await dbPromise;
    const users = await db.getAll('users');
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      set({ user });
      await get().loadCourts();
      await get().loadReservations();
      return true;
    }
    return false;
  },

  register: async (userData) => {
    const db = await dbPromise;
    const users = await db.getAll('users');
    if (users.some(u => u.email === userData.email)) {
      throw new Error('El email ya está registrado');
    }
    const newUser = {
      ...userData,
      id: Date.now().toString(),
    };
    await db.add('users', newUser);
    set({ user: newUser });
    await get().loadCourts();
    await get().loadReservations();
  },

  logout: () => set({ user: null, reservations: [], courts: [] }),

  loadReservations: async () => {
    set({ loading: true });
    try {
      const db = await dbPromise;
      const reservations = await db.getAll('reservations');
      set({ reservations });
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      set({ loading: false });
    }
  },

  loadCourts: async () => {
    set({ loading: true });
    try {
      const db = await dbPromise;
      const courts = await db.getAll('courts');
      set({ courts });
    } catch (error) {
      console.error('Error loading courts:', error);
    } finally {
      set({ loading: false });
    }
  },

  addReservation: async (reservationData) => {
    const db = await dbPromise;
    const newReservation = {
      ...reservationData,
      id: Date.now().toString(),
      userId: get().user.id,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    };
    await db.add('reservations', newReservation);
    set(state => ({
      reservations: [...state.reservations, newReservation],
    }));
  },

  updateReservation: async (id, reservationData) => {
    const db = await dbPromise;
    const updatedReservation = {
      ...reservationData,
      id,
      userId: get().user.id,
      updatedAt: new Date().toISOString(),
    };
    await db.put('reservations', updatedReservation);
    set(state => ({
      reservations: state.reservations.map(r =>
        r.id === id ? updatedReservation : r
      ),
    }));
  },

  deleteReservation: async (id) => {
    const db = await dbPromise;
    await db.delete('reservations', id);
    set(state => ({
      reservations: state.reservations.filter(r => r.id !== id),
    }));
  },

  addCourt: async (courtData) => {
    const db = await dbPromise;
    const newCourt = {
      ...courtData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    await db.add('courts', newCourt);
    set(state => ({
      courts: [...state.courts, newCourt],
    }));
  },

  updateCourt: async (id, courtData) => {
    const db = await dbPromise;
    const updatedCourt = {
      ...courtData,
      id,
      updatedAt: new Date().toISOString(),
    };
    await db.put('courts', updatedCourt);
    set(state => ({
      courts: state.courts.map(c =>
        c.id === id ? updatedCourt : c
      ),
    }));
  },

  deleteCourt: async (id) => {
    const db = await dbPromise;
    await db.delete('courts', id);
    set(state => ({
      courts: state.courts.filter(c => c.id !== id),
    }));
  },
}));

export default useStore; 