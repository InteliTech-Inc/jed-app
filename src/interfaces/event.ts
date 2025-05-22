import { EventApprovalStatus, EventProgress } from "@/types/event-status";

export interface Event {
  name: string;
  description: string;
  tools: Tools;
  amount_per_vote: number;
  service_percentage: number;
}

export interface UpdateEventPayload {
  name: string;
  description: string;
  voting_period: Partial<Period>;
  nomination_period: Partial<Period>;
}

interface Period {
  start_date: string;
  end_date: string;
}

interface Tools {
  nominations: boolean;
  voting: boolean;
  ticketing: boolean;
}

export interface EventResponse {
  id: string;
  name: string;
  description: string;
  schedule: Schedule;
  approval_status: EventApprovalStatus;
  event_progress: EventProgress;
  is_published: boolean;
  display_results: boolean;
  categories: Categories[];
  tools: Tools;
  votes: Vote[];
  service_percentage: number;
  media: Media[];
}

interface Media {
  public_id: string;
  url: string;
}

export interface Vote {
  count: number;
  amount: number;
  id: string;
}

interface Categories {
  id: number;
  name: string;
  description: string;
  nominees: Nominee[];
}

interface Schedule {
  nomination_end_period: string;
  nomination_start_period: string;
  voting_end_period: string;
  voting_start_period: string;
}

export interface Nominee {
  full_name: string;
  image: string;
  event_id: string;
  category_id: string;
}
