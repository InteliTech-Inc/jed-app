import { EventResponse, UpdateEventPayload } from "@/interfaces/event";
import { create } from "zustand";

type AllEventsActions = {
  setAllEvents: (events: EventResponse[]) => void;
  removeEvent: (eventId: string) => void;
  updateEvent: (eventId: string, updatedEvent: UpdateEventPayload) => void;
  addEvent: (event: EventResponse) => void;
};

type AllEventsStore = {
  allEvents: EventResponse[];
};

const initialState: AllEventsStore = {
  allEvents: [],
};

export const useAllEventsStore = create<AllEventsStore & AllEventsActions>()(
  (set) => ({
    ...initialState,
    setAllEvents: (events) => set({ allEvents: events }),
    removeEvent: (eventId) =>
      set((state) => {
        const newEvents = state.allEvents.filter(
          (event) => event.id !== eventId,
        );
        return { allEvents: newEvents };
      }),
    updateEvent: (eventId, updatedEvent) =>
      set((state: any) => {
        const updatedEvents = state.allEvents.map((event: any) =>
          event.id === eventId ? updatedEvent : event,
        );
        return { allEvents: updatedEvents };
      }),
    addEvent: (event) =>
      set((state) => ({ allEvents: [...state.allEvents, event] })),
  }),
);
