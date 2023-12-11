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

export async function CommentGET(id) {
  return await fetch(`${API_URL}api/GetComment/${id}`)
    .then((response) => response.json())
    .then((json) => {
      return Object.values(json);
    });
}

export async function likeGET(id, delta, event) {
  return await fetch(`${API_URL}api/like/${id}?delta=${delta}&event=${event}`);
}

export async function CommentPOST(user, psw, id, msg) {
  return await fetch(`${API_URL}api/Comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: user,
      password: psw,
      post_id: id,
      comment_text: msg,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      return json.code;
    });
}

export async function loginPOST(login, pasword) {
  return await fetch(`${API_URL}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login: login,
      password: pasword,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      return json.code;
    });
}
