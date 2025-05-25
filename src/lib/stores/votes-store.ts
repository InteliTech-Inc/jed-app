import { VotingDataResponse } from "@/app/(event)/e/[id]/voting/page";
import { create } from "zustand";

interface Vote extends VotingDataResponse {}

type VoteActions = {
  setVotes: (votes: Vote[]) => void;
};

type VoteStore = {
  votes: Vote[];
};

const initialState: VoteStore = {
  votes: [],
};

export const useVotesStore = create<VoteStore & VoteActions>((set) => ({
  ...initialState,
  setVotes: (votes) => set({ votes }),
}));
