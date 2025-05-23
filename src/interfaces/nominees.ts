import { Media } from "./event";

export interface NomineeResponse {
  id: string;
  full_name: string;
  code: string;
  media: Media;
  user_id: string;
  event_id: string;
  catgeory: {
    id: string;
    name: string;
    event_id: string;
  };
  created_at: string;
  updated_at: string;
  votes: string[];
  total_votes: number;
}
