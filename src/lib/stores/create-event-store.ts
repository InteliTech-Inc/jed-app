import { create } from "zustand";
import { persist } from "zustand/middleware";

export type EventTools = {
  nominations: boolean;
  voting: boolean;
  ticketing: boolean;
};

export type PricingDetails = {
  amountPerVote: number;
  serviceFeePercentage: 10 | 12;
};

export type EventFormState = {
  // Step 1: Basic Information
  name: string;
  description: string;
  image: string | null;

  // Step 2: Event Tools
  tools: EventTools;

  // Step 3: Pricing
  pricing: PricingDetails;

  currentStep: number;
  isUploading: boolean;
};

type EventFormActions = {
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;

  updateBasicInfo: (
    info: Pick<EventFormState, "name" | "description" | "image">,
  ) => void;
  updateTools: (tools: EventTools) => void;
  updatePricing: (pricing: PricingDetails) => void;
  isUploading: boolean;
  setIsUploading: (isUploading: boolean) => void;
  reset: () => void;
};

const initialState: EventFormState = {
  name: "",
  description: "",
  image: null,
  tools: {
    nominations: false,
    voting: false,
    ticketing: false,
  },
  pricing: {
    amountPerVote: 1.0,
    serviceFeePercentage: 10,
  },
  currentStep: 1,
  isUploading: false,
};

export const useCreateEventStore = create<EventFormState & EventFormActions>()(
  persist(
    (set) => ({
      ...initialState,

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 4),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      setStep: (step) => set({ currentStep: step }),

      updateBasicInfo: (info) =>
        set((state) => ({
          ...state,
          ...info,
        })),

      updateTools: (tools) =>
        set((state) => ({
          ...state,
          tools,
        })),

      updatePricing: (pricing) =>
        set((state) => ({
          ...state,
          pricing,
        })),

      reset: () => set(initialState),
      setIsUploading: (isUploading) => set({ isUploading }),
    }),
    {
      name: "create-event-storage",
    },
  ),
);
