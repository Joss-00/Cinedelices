export const httpRequester = {
  get: (endpoint) => request("GET", endpoint),
  post: (endpoint, body) => request("POST", endpoint, body),
  patch: (endpoint, body) => request("PATCH", endpoint, body),
  delete: (endpoint) => request("DELETE", endpoint),
};

async function request(method, endpoint, body) {

  const accessToken = localStorage.getItem("token");

  // Appel fetch vers l’API
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/${endpoint}`,{
    method,
    headers: {
      // Content-Type uniquement si un body est présent
      ...(body && { "content-type": "application/json" }),

      // Authorization uniquement si un token existe
      ...(accessToken && { Authorization : `Bearer ${accessToken}` }),
    },
    body: body? JSON.stringify(body) : undefined,
  });

   // Gestion des erreurs
  if (!response.ok) {
    console.error(response);
    throw new Error(`Failed to fetch ${method} ${endpoint} ${response.status}-${response.statusText}`);
  };

  // Certaines routes API ne renvoie pas de body (ex: routes DELETE avec retour 204 No Content)
  if (!response.headers.get("content-type")?.includes("application/json")){
    return null;
  };

  return await response.json();
};