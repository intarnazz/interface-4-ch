const API_URL = import.meta.env.VITE_API_URL;

export async function GetUser(login) {
  console.log('GetUser');
  return await fetch(`${API_URL}api/GetUser/${login}`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      return json;
    })
    .catch((e) => {
      throw e;
    });
}
