const API_URL = import.meta.env.VITE_API_URL;

export async function likeGET(id, delta, event) {
  console.log('likeGET');
  return await fetch(
    `${API_URL}api/like/${id}?delta=${delta}&event=${event}`
  ).catch((e) => {
    throw e;
  });
}
