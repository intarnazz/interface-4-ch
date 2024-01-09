const API_URL = import.meta.env.VITE_API_URL;

export async function GetUser(login) {
  return await fetch(`${API_URL}getUser/${login}`)
    .then((response) => response.json())
    .then((json) => {
      return json;
    })
    .catch((e) => {
      throw e;
    });
}
