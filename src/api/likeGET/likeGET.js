const API_URL = import.meta.env.VITE_API_URL;

export async function likeGET(id, delta, event) {
  return await fetch(`${API_URL}api/like/${id}?delta=${delta}&event=${event}`);
}
