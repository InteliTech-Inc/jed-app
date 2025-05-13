export const QUERY_KEYS = {
  USER: "user",
  EVENTS: "events",
  VOTES: "votes",
} as const;

export const MUTATION_KEYS = {
  CREATE_EVENT: "create-event",
  UPDATE_EVENT: "update-event",
  DELETE_EVENT: "delete-event",
  VOTE: "vote",
  DELETE_VOTE: "delete-vote",
};
