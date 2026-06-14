export const ADMIN_EMAIL = "admin@nairescents.com";
export const ADMIN_PASSWORD = "NaireAdmin2025!";

export function login(email: string, password: string): boolean {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("naire_admin_session", "true");
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem("naire_admin_session");
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("naire_admin_session") === "true";
}
