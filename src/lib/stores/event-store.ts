import { CategoryType } from "@/app/(event)/e/[id]/_components/columns";
import { EventResponse } from "@/interfaces/event";
import { create } from "zustand";

type EventActions = {
  setEventDetails: (eventDetails: EventResponse) => void;
  setCategories: (categories: CategoryType[]) => void;
  updateCategory: (categoryId: number, newName: string) => void;
  revertCategory: (categoryId: number, oldName: string) => void;
  addCategories: (newCategories: CategoryType[]) => void;
  removeCategory: (categoryId: number) => void;
};

type EventStore = {
  eventDetails: EventResponse | null;
  categories: CategoryType[];
};

const initialState: EventStore = {
  eventDetails: null,
  categories: [],
};

export const useEventStore = create<EventStore & EventActions>()((set) => ({
  ...initialState,
  setEventDetails: (eventDetails) => set({ eventDetails }),
  setCategories: (categories) => set({ categories }),
  updateCategory: (categoryId, newName) =>
    set((state) => {
      const updatedCategories = state.categories.map((category) =>
        category.id === categoryId ? { ...category, name: newName } : category,
      );
      return { categories: updatedCategories };
    }),
  revertCategory: (categoryId, oldName) =>
    set((state) => {
      const revertedCategories = state.categories.map((category) =>
        category.id === categoryId ? { ...category, name: oldName } : category,
      );
      return { categories: revertedCategories };
    }),
  addCategories: (newCategories) =>
    set((state) => {
      const newCategoryObjects = newCategories.map((category) => ({
        ...category,
        name: category.name,
      }));

      return { categories: [...state.categories, ...newCategoryObjects] };
    }),
  removeCategory: (categoryId) =>
    set((state) => {
      const newCategories = state.categories.filter(
        (category) => category.id !== categoryId,
      );
      return { categories: newCategories };
    }),
}));
