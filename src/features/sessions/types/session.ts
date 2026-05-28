export type Session = {
  id: number;
  sessionNumber: number;
  title: string | null;
  summary: string;
  notes: string | null;
  playedAt: string;
  createdAt: string;
  updatedAt: string | null;
};
