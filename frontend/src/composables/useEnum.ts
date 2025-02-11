export enum AuthStatus {
  Authenticated = 'authenticated',
  Unauthenticated = 'unauthenticated',
}

export const useEnum = () => {
  return {
    AuthStatus,
  }
}
