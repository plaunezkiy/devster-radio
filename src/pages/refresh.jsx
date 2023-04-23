import { VscLoading } from "react-icons/vsc";
import { useRouter } from "next/router";
import { useEffect } from "react";

// response = post('https://accounts.spotify.com/api/token', data={
//         'grant_type': 'authorization_code',
//         'code': code,
//         # 'redirect_uri': os.getenv('SPOTIFY_REDIRECT_URI'),
//         'redirect_uri': f'http://{request.get_host()}/apps/radio/callback',
//         # 'redirect_uri': 'http://172.21.4.112:8000/apps/radio/callback',
//         'client_id': os.getenv('SPOTIFY_CLIENT_ID'),
//         'client_secret': os.getenv('SPOTIFY_CLIENT_SECRET'),
//     })

const Refresh = () => {
  const router = useRouter();
  const { refresh_token } = router.query;

  useEffect(() => {
    if (code) {
      fetch("api/refresh_token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((resp) => resp.json())
        .then((data) => {
          localStorage.setItem("authData", JSON.stringify(data));
          router.push("/demo");
        });
    }
  }, [code]);

  return (
    <div className="flex h-full items-center justify-center">
      <VscLoading className="w-32 h-32 animate-spin" />
    </div>
  );
};

export default Refresh;
