export type Role = 'artist' | 'agent' | 'talent-buyer' | 'venue' | 'organizer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: Date;
}
