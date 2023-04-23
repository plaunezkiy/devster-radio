let querystring = require("querystring");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405);
    return;
  }
  const { code } = req.body;
  await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      //   Authorization:
      //     "Basic " +
      //     Buffer.from(
      //       `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      //     ).toString("base64"),
    },
    body: querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
    // grant_type: "authorization_code",
    // code,
    // redirect_uri: process.env.REDIRECT_URI,
    // client_id: ,
    // client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  })
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      res.status(200).json(data);
    });
  //   console.log(process.env.REDIRECT_URI);
}
