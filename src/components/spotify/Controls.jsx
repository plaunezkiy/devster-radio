import { useContext } from "react";
import { BsSkipStart, BsSkipEnd, BsPlay, BsPause } from "react-icons/bs";
import SpotifyAuthContext from "@/utils/SpotifyAuthContext";
import { useRefreshTokenFetch } from "@/hooks/useFetch";

const Controls = ({ playerData }) => {
  const authData = useContext(SpotifyAuthContext);
  const { is_playing } =
    playerData === undefined ? { is_playing: false } : playerData;
  const { loading, error, fetchData, putData, postData } =
    useRefreshTokenFetch();

  const skipTrack = (forward = true) => {
    const dir = forward ? "next" : "previous";
    postData("https://api.spotify.com/v1/me/player/" + dir, authData);
  };

  const playTrack = (pause = false) => {
    const dir = pause ? "pause" : "play";
    putData("https://api.spotify.com/v1/me/player/" + dir, authData);
  };

  return (
    <>
      <BsSkipStart
        onClick={() => skipTrack(false)}
        className="w-9 h-9 text-blue-500 hover:text-white hover:bg-blue-500 rounded cursor-pointer duration-150"
      />
      {is_playing ? (
        <BsPause
          onClick={() => playTrack(true)}
          className="w-9 h-9 text-blue-500 hover:text-white hover:bg-blue-500 rounded cursor-pointer duration-150"
        />
      ) : (
        <BsPlay
          onClick={() => playTrack()}
          className="w-9 h-9 text-blue-500 hover:text-white hover:bg-blue-500 rounded cursor-pointer duration-150"
        />
      )}
      <BsSkipEnd
        onClick={() => skipTrack()}
        className="w-9 h-9 text-blue-500 hover:text-white hover:bg-blue-500 rounded cursor-pointer duration-150"
      />
    </>
  );
};

export default Controls;
