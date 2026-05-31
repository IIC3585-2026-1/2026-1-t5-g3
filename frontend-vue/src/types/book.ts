export type ListType = 'read' | 'recommended' | 'wantToRead';

export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  description?: string;
}

export const LIST_LABELS: Record<ListType, string> = {
  read: 'Leídos',
  recommended: 'Recomendados',
  wantToRead: 'Quiero leer',
};
