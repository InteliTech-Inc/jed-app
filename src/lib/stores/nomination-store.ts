import { NominationsResponse } from "@/app/(event)/e/[id]/nominations/page";
import { create } from "zustand";

interface Nominations extends NominationsResponse {}

type NominationsActions = {
  setNominations: (nominations: Nominations[]) => void;

  removeNomination: (nominationId: string) => void;
  updateNomination: (
    nominationId: string,
    updatedNomination: Partial<Nominations>,
  ) => void;
};

type NominationsStore = {
  nominations: Nominations[];
};

const initialState: NominationsStore = {
  nominations: [],
};

export const useNominationStore = create<NominationsStore & NominationsActions>(
  (set) => ({
    ...initialState,

    setNominations: (nominations) => set({ nominations }),

    removeNomination: (nominationId) =>
      set((state) => ({
        nominations: state.nominations.filter(
          (nomination) => nomination.id !== nominationId,
        ),
      })),

    updateNomination: (nominationId, updatedNomination) =>
      set((state) => ({
        nominations: state.nominations.map((nomination) =>
          nomination.id === nominationId
            ? { ...nomination, ...updatedNomination }
            : nomination,
        ),
      })),
  }),
);
