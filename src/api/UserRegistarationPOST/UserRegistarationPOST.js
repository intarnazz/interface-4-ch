const API_URL = import.meta.env.VITE_API_URL;

export async function UserRegistarationPOST(login, password) {
  return await fetch(`${API_URL}api/PostRegistationUser`, {
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
      console.log(json);
      return json.code;
    })
    .catch((e) => {
      console.log(json);
      throw e;
    });
}
