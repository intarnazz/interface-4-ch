const API_URL = import.meta.env.VITE_API_URL;

export async function CommentPOST(user, psw, id, msg) {
  console.log('CommentPOST');
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
    })
    .catch((e) => {
      throw e;
    });
}
