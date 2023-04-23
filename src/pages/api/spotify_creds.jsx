// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.SPOTIFY_CLIENT_ID,
  });
}
