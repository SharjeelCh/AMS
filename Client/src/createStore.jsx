import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
 persist(
  (set, get) => ({
   user: null,
   setUser: (user) => set({ user }),
   logout: () => set({ user: null }),
  }),
  {
   name: "user-storage",
   getStorage: () => localStorage,
  }
 )
);

export default useStore;
