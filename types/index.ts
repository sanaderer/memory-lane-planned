export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url: string; 
  user_id: string; 
  location: string;
  created_at: string;
}

export interface YearMemories {
  year: number;
  memories: Memory[];
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  memoryCount?: number;
}

export interface Collection {
  id: string;
  title: string;
  date: string;
  coverImage: string;
  memories: Memory[];
}
