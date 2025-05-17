export interface NomineeResponse {
  id: string;
  full_name: string;
  code: string;
  img_url: string | null;
  img_public_id: string | null;
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
