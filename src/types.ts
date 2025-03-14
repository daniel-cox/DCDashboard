export interface Link {
  id: string;
  name: string;
  url: string;
  tags: string[];
  createdAt: number;
}

export interface Email {
  id: string;
  address: string;
  notes: string;
  createdAt: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}