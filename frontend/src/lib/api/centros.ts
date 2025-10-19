import { Centro } from "../types";
import { API_URL, ENDPOINTS } from "../config/constants";

export const centrosService = {
  getAll: async (): Promise<Centro[]> => {
    const response = await fetch(`${API_URL}${ENDPOINTS.CENTROS}`);
    if (!response.ok) {
      throw new Error("Failed to fetch centros");
    }
    return response.json();
  },
};
