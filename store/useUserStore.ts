import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface UserState {
  currentUser: User | null;
  allUsers: User[];
  setCurrentUser: (user: User | null) => void;
  setAllUsers: (users: User[]) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      allUsers: [],
      setCurrentUser: (user) => set({ currentUser: user }),
      setAllUsers: (users) => set({ allUsers: users }),
    }),
    {
      name: "user-storage",
    }
  )
);
