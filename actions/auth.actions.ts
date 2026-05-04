'use server';

export const loginAction = async (formData: FormData) => {
  // Handle login logic, communicate with NextAuth or DB
  const email = formData.get('email');
  const password = formData.get('password');
  console.log('Login attempt:', email);
  return { success: true };
};

export const registerAction = async (formData: FormData) => {
  // Handle registration logic
  return { success: true };
};
