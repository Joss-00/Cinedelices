import { writable, derived } from "svelte/store";
import { jwtDecode } from "jwt-decode";

// Lecture initiale du localStorage
// On récupère le token et le user si l’utilisateur était déjà connecté

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

export const auth = writable({
  token: storedToken,
  user: storedUser ? JSON.parse(storedUser) : null
});

// Contient l'état global : token + user (ou null si pas connecté)
// Met à jour le token, le store Svelte et le localStorage

export function setToken(token) {
  auth.update(state => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    return { ...state, token };
  });
}

// Met à jour le user et son état
export function setUser(user) {
  auth.update(state => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
    return { ...state, user };
  });
}

// Supprime l’utilisateur et le token
export function logout() {
  setToken(null);
  setUser(null);
}

// isAuthed pour poster recettes, commentaires, ratings
// Verifie l'expiration du token
export const isAuthed = derived(auth, $auth => {
  if (! $auth.token) return false;

  const { exp } = jwtDecode($auth.token);
  if (exp * 1000 < Date.now()) {
    logout();
    return;
  }
  return true;
});

// isAdmin pour modifier ou supprimer recettes
export const isAdmin = derived(auth, $auth => {
  return $auth.user?.role === "admin";
});
