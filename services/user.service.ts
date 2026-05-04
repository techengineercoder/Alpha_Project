export const getUserById = async (id: string) => {
  // Mock DB call
  return { id, name: 'John Doe', role: 'artist' };
};

export const updateUserProfile = async (id: string, data: any) => {
  // Mock DB update
  return { success: true };
};
