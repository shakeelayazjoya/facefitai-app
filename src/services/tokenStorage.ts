import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN = 'facefit_access_token';
const REFRESH_TOKEN = 'facefit_refresh_token';
const USER = 'facefit_auth_user';

async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}
async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') return localStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}
async function deleteItem(key: string): Promise<void> {
  if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
  await SecureStore.deleteItemAsync(key);
}
export const tokenStorage = {
  ACCESS_TOKEN, REFRESH_TOKEN, USER,
  setAccessToken: (token: string) => setItem(ACCESS_TOKEN, token),
  getAccessToken: () => getItem(ACCESS_TOKEN),
  setRefreshToken: (token: string) => setItem(REFRESH_TOKEN, token),
  getRefreshToken: () => getItem(REFRESH_TOKEN),
  setUser: (userJson: string) => setItem(USER, userJson),
  getUser: () => getItem(USER),
  clear: async () => { await Promise.all([deleteItem(ACCESS_TOKEN), deleteItem(REFRESH_TOKEN), deleteItem(USER)]); },
};
