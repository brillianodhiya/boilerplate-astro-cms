// Token storage keys — ganti prefix sesuai project Anda
export const ACCESS_TOKEN_KEY = 'bp_access_token';
export const REFRESH_TOKEN_KEY = 'bp_refresh_token';
export const USER_PROFILE_KEY = 'bp_user_profile';

// User profile interface — sesuaikan field sesuai API backend Anda
export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
}

// Mendapatkan access token
export function getToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

// Mendapatkan refresh token
export function getRefreshToken(): string | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

// Menyimpan tokens dan user profile setelah login
export function setAuthData(
  accessToken: string,
  refreshToken: string,
  userProfile: UserProfile
): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
  } catch (error) {
    console.error('Error saving auth data:', error);
  }
}

// Memperbarui access token (digunakan saat refresh)
export function updateAccessToken(accessToken: string): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } catch (error) {
    console.error('Error updating access token:', error);
  }
}

// Mendapatkan user profile
export function getUserProfile(): UserProfile | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const profileData = localStorage.getItem(USER_PROFILE_KEY);
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Membersihkan semua data autentikasi (logout)
export function clearAuthData(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
}

// Mengecek status login
export function isLoggedIn(): boolean {
  return !!getToken();
}
