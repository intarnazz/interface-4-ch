const API_URL = import.meta.env.VITE_API_URL;

export async function videoGET(value = "") {
  if (value !== "") {
    value = "/" + value;
  }
  return await fetch(`${API_URL}getVideo${value}`)
    .then((response) => response.json())
    .then((json) => {
      return json.data;
    })
    .catch((e) => {
      throw e;
    });
}
