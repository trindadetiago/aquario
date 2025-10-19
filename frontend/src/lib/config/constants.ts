import { API_CONFIG } from "./env";

export const API_URL = API_CONFIG.BASE_URL;

export const ENDPOINTS = {
  CENTROS: "/centros",
  CURSOS: (centroId: string) => `/centros/${centroId}/cursos`,
  GUIAS: (cursoId: string) => `/guias?cursoId=${cursoId}`,
  SECOES: (guiaId: string) => `/guias/${guiaId}/secoes?guiaId=${guiaId}`,
  SUBSECOES: (secaoId: string) => `/guias/secoes/${secaoId}/subsecoes?secaoId=${secaoId}`,
} as const;
