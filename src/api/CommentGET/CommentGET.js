const API_URL = import.meta.env.VITE_API_URL;

export async function CommentGET(id) {
  return await fetch(`${API_URL}api/GetComment/${id}`)
    .then((response) => response.json())
    .then((json) => {
      return Object.values(json);
    })
    .catch((e) => {
      throw e;
    });
}
