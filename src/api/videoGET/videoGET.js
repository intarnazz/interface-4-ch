const API_URL = import.meta.env.VITE_API_URL;

export async function videoGET(value = "", mode = "") {
  if (value !== "") {
    value = mode + "/" + value;
  }
  console.log(`${API_URL}api/getVideo${value}`);
  console.log(mode);
  return await fetch(`${API_URL}api/getVideo${value}`)
    .then((response) => response.json())
    .then((json) => {
      return json;
    })
    .catch((e) => {
      throw e;
    });
}
