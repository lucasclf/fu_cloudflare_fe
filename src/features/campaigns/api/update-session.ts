import { httpPatch } from "@/shared/lib/http-client";
import { API_BASE_URL } from "@/shared/services/api";

type UpdateSessionInput = {
  title?: string | null;
  summary: string;
  notes?: string | null;
  played_at: string;
  visible_to_players: boolean;
};

export async function updateSession(campaignId: number, sessionId: number, input: UpdateSessionInput): Promise<void> {
  await httpPatch<unknown>(`${API_BASE_URL}/campaigns/${campaignId}/sessions/${sessionId}`, input);
}
