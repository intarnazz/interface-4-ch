const API_URL = import.meta.env.VITE_API_URL;

export async function videoGET(id = "") {
  if (id !== "") {
    id = "/" + id;
  }
  return await fetch(`${API_URL}api${id}`)
    .then((response) => response.json())
    .then((json) => {
      return json.data;
    });
}
