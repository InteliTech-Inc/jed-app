import { Nominee } from "@/app/(event)/e/[id]/nominees/_components/columns";
import { create } from "zustand";

export interface NomineeInterface extends Nominee {
  id: string;
}

type NomineeActions = {
  setNominees: (nominees: NomineeInterface[]) => void;
  addNominees: (nominees: NomineeInterface) => void;
  removeNominee: (nomineeId: string) => void;
  updateNominee: (
    nomineeId: string,
    updatedNominee: Partial<NomineeInterface>,
  ) => void;
};

type NomineeStore = {
  nominees: NomineeInterface[];
};

const initialState: NomineeStore = {
  nominees: [],
};

export const useNomineeStore = create<NomineeStore & NomineeActions>((set) => ({
  ...initialState,
  setNominees: (nominees) => set({ nominees }),
  addNominees: (nominee) =>
    set((state) => ({ nominees: [...state.nominees, nominee] })),
  removeNominee: (nomineeId) =>
    set((state) => {
      const newNominees = state.nominees.filter(
        (nominee) => nominee.id !== nomineeId,
      );
      return { nominees: newNominees };
    }),
  updateNominee: (nomineeId, updatedNominee) =>
    set((state) => {
      const updatedNominees = state.nominees.map((nominee) =>
        nominee.id === nomineeId ? { ...nominee, ...updatedNominee } : nominee,
      );
      return { nominees: updatedNominees };
    }),
}));
