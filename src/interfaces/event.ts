export interface Event {
  name: string;
  description: string;
  image: string | null;
  tools: Tools;
  amount_per_vote: number;
  service_percentage: number;
}

interface Tools {
  nominations: boolean;
  voting: boolean;
  ticketing: boolean;
}
