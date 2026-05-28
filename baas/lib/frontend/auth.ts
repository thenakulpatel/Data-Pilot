export function saveToken(
  token: string
) {

  // ================================================
  // LOCAL STORAGE
  // ================================================

  localStorage.setItem(
    "token",
    token
  );

  // ================================================
  // COOKIE
  // ================================================

  document.cookie =
    `token=${token}; path=/`;
}

export function getToken() {

  return localStorage.getItem(
    "token"
  );
}