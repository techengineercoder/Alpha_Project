import { useState, useEffect } from 'react';

// Mock hook for fetching current user
export const useCurrentUser = () => {
  const [user, setUser] = useState<{ id: string, role: string } | null>(null);

  useEffect(() => {
    // In a real app, this might use useSession from next-auth/react
    setUser({ id: '1', role: 'artist' });
  }, []);

  return { user, isLoading: !user };
};
