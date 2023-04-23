import { useContext, useEffect, useState } from "react";
import { useRefreshTokenFetch } from "@/hooks/useFetch";
import SpotifyAuthContext from "@/utils/SpotifyAuthContext";

const Playlists = () => {
  const authData = useContext(SpotifyAuthContext);
  const [playlists, setPlaylists] = useState([]);
  const { loading, error, fetchData } = useRefreshTokenFetch();

  const getPlaylists = () => {
    if (!authData) return;
    fetchData(`https://api.spotify.com/v1/me/playlists`, authData, (data) => {
      setPlaylists(data.items);
    });
  };
  let mounted = false;
  useEffect(() => {
    if (!mounted) {
      getPlaylists();
    }
    return () => {
      mounted = true;
    };
  }, []);

  return (
    <div>
      <p className="mb-4">Playlists!</p>
      <div className="flex flex-col gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="w-44 h-36 md:w-52 md:h-16 p-4 border rounded-lg shadow-md cursor-pointer hover:text-blue-600 dark:hover:text-blue-300 hover:-translate-y-1 duration-150"
          >
            <p>{playlist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
