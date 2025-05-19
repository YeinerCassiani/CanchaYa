import { create } from 'zustand';
import { db } from '../db';

const useStore = create((set, get) => ({
  user: null,
  courts: [],
  reservations: [],
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await db.getUserByEmail(email);
      if (user && user.password === password) {
        set({ user, loading: false });
        return true;
      }
      throw new Error('Credenciales inválidas');
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  logout: () => {
    set({ user: null, reservations: [] });
  },

  loadCourts: async () => {
    set({ loading: true, error: null });
    try {
      const courts = await db.getCourts();
      set({ courts, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  loadReservations: async (userId) => {
    set({ loading: true, error: null });
    try {
      const reservations = await db.getUserReservations(userId);
      set({ reservations, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addReservation: async (reservation) => {
    set({ loading: true, error: null });
    try {
      await db.addReservation(reservation);
      const reservations = await db.getUserReservations(get().user.id);
      set({ reservations, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateReservation: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      await db.updateReservation(id, updates);
      const reservations = await db.getUserReservations(get().user.id);
      set({ reservations, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteReservation: async (id) => {
    set({ loading: true, error: null });
    try {
      await db.deleteReservation(id);
      const reservations = await db.getUserReservations(get().user.id);
      set({ reservations, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useStore; 