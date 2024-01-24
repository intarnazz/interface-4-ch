const API_URL = import.meta.env.VITE_API_URL;

export async function UserRegistarationPOST() {
  return await fetch(`${API_URL}/api/PostRegistationUser`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      login: user,
      password: psw,
    })
  })
    .then((response) => response.json())
    .then((json) => {
      return json
    })
    .catch(e => {
      throw e
    })
}
