import AuthUserService from '@/core/services/seg/AuthUserService';

/**
 * Helper function to get the current authenticated user's ID
 * @returns The user ID or throws an error if not authenticated
 */
export const getCurrentUserId = (): number => {
  const userId = AuthUserService.userId;
  
  if (userId === -1 || userId === undefined || userId === null) {
    throw new Error('Usuario no autenticado. Por favor, inicia sesión.');
  }
  
  return userId;
};

/**
 * Helper function to check if user is authenticated
 * @returns true if user is authenticated, false otherwise
 */
export const isUserAuthenticated = (): boolean => {
  const userId = AuthUserService.userId;
  return userId !== -1 && userId !== undefined && userId !== null;
};
