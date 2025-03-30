export type Note = {
  id: string;
  category: string;
  content: string;
  createdAt: Date;
};

export const CATEGORIES = [
  'Work and Study',
  'Life',
  'Health and Well-being',
] as const;
