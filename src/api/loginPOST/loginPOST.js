const API_URL = import.meta.env.VITE_API_URL;

export async function loginPOST(login, password) {
  return await fetch(`${API_URL}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: login,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      return json.code;
    })
    .catch((e) => {
      throw e;
    });
}
