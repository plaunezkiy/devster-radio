import { useState, useEffect, useContext } from "react";
import {
  BsArrowsFullscreen,
  BsHeart,
  BsHeartFill,
  BsSpotify,
  BsMusicNoteList,
} from "react-icons/bs";
// import { MdPiano } from "react-icons/md";

import {
  SongFeatures,
  FeaturesHorizontal,
} from "@/components/spotify/SongFeatures";
import SongQueue from "@/components/spotify/SongQueue";
import SongRecommendations from "@/components/spotify/SongRecommendations";
// import Playlists from "@/components/spotify/Playlists";
import Controls from "@/components/spotify/Controls";
// import WebPlayback from "@/components/spotify/Recommendations";
import SpotifyPlayerSDK from "@/components/spotify/SpotifyPlayerSDK";
import AvailableDevices from "@/components/spotify/AvailableDevices";
// import Piano from "./Piano";
import { useRefreshTokenFetch } from "@/hooks/useFetch";
import SpotifyAuthContext from "@/utils/SpotifyAuthContext";
import CurrentTrackContext from "@/utils/CurrentTrackContext";

const SpotifyPlayer = ({ setFullScreen }) => {
  const { setCurrentTrack } = useContext(CurrentTrackContext);
  let authData = {};
  if (typeof window !== "undefined") {
    authData = JSON.parse(localStorage.getItem("authData"));
    console.log(authData);
  }
  // const [authData, _] = useState(
  //   JSON.parse(document.getElementById("spotify_data").textContent)
  // );
  const [playerData, setPlayerData] = useState();
  const [trackQueue, setTrackQueue] = useState([]);
  const [activeSongData, setActiveSongData] = useState(
    (playerData?.progress_ms / playerData?.item.duration_ms) * 100
  );
  const [activeSongAnalysis, setActiveSongAnalysis] = useState();
  const [currentSegment, setCurrentSegment] = useState();

  const [songProgress, setSongProgress] = useState(0);
  // const [user, setUser] = useState();
  const [activeTab, setActiveTab] = useState("queue");

  const [recFeatures, setRecFeatures] = useState({
    key: { active: false, value: 0 },
    mode: { active: false, value: 0 },
    tempo: { active: false, value: 0 },
    danceability: { active: false, value: 0 },
    energy: { active: false, value: 0 },
    loudness: { active: false, value: 0 },
    speechiness: { active: false, value: 0 },
    acousticness: { active: false, value: 0 },
    instrumentalness: { active: false, value: 0 },
    liveness: { active: false, value: 0 },
    valence: { active: false, value: 0 },
  });

  const { loading, error, fetchData, putData } = useRefreshTokenFetch();

  const spotifyLogin = () => {
    // https://api.spotify.com/authorize
    // if (authData) return;
    fetch("api/spotify_creds")
      .then((resp) => resp.json())
      .then(({ client_id, redirect_uri }) => {
        const params = {
          response_type: "code",
          client_id,
          scope:
            "user-read-playback-state user-modify-playback-state user-read-currently-playing streaming playlist-modify-private playlist-modify-public",
          redirect_uri,
        };
        const query = Object.keys(params)
          .map((key) => key + "=" + params[key])
          .join("&");
        return (window.location.href =
          "https://accounts.spotify.com/authorize?" + query);
      });
  };

  const getPlayerState = async () => {
    if (!authData) return;
    fetchData("https://api.spotify.com/v1/me/player", authData, (data) => {
      // fetchData("https://api.spotify.com/v1/me", authData, (data) => {
      //   setUser(data);
      // });

      if (!data) return;
      if (playerData?.item.id === data.item.id) return;

      setPlayerData(data);
      setCurrentTrack(data.item);
      fetchData(
        "https://api.spotify.com/v1/audio-features/" + data.item.id,
        authData,
        setActiveSongData
      );
      fetchData(
        "https://api.spotify.com/v1/audio-analysis/" + data.item.id,
        authData,
        setActiveSongAnalysis
      );
    });
  };

  const updateSegment = (time_position) => {
    if (!activeSongAnalysis) return;
    let i = 0;
    let segment = activeSongAnalysis.segments[i];
    while (time_position > segment.start + segment.duration) {
      i++;
      segment = activeSongAnalysis.segments[i];
    }
    setCurrentSegment(segment);
  };

  const getQueue = () => {
    if (!authData) return;
    fetchData("https://api.spotify.com/v1/me/player/queue", authData, (data) =>
      setTrackQueue(data.queue)
    );
  };

  const updateState = () => {
    getPlayerState();
    getQueue();
    // console.log(trackQueue);
  };

  let mounted = false;
  // when mounted, check localstorage for tokens and update
  useEffect(() => {
    if (!mounted) {
      // console.log("mounted");
      updateState();
    }
    return () => {
      mounted = true;
    };
  }, []);

  useEffect(() => {
    // updateState();
    let INTERVAL = 50;
    let interval = undefined;
    if (interval) clearInterval(interval);
    if (!playerData?.is_playing) return;
    // set initial
    setSongProgress(
      (playerData?.progress_ms / playerData?.item.duration_ms) * 100
    );
    updateSegment(songProgress);
    // keep updating
    interval = setInterval(() => {
      setSongProgress(
        (p) => (p += (INTERVAL * 100) / playerData?.item.duration_ms)
      );
      updateSegment(songProgress);
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [playerData]);

  useEffect(() => {
    let interval = setInterval(() => {
      updateState();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     updateSegment(songProgress);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [activeSongAnalysis, songProgress]);

  return (
    <SpotifyAuthContext.Provider value={authData}>
      <div className="w-full flex flex-col gap-12">
        {/* login button */}
        {!authData && (
          <div className="flex flex-col gap-2 items-center text-lg font-semibold text-center">
            <p>
              To use the player, you need to log in with your Spotify account
            </p>
            <p className="text-sm mb-2 text-mute">
              Devster does not store your access information
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={spotifyLogin}
                className="
              border border-1 border-slate-700 dark:border-gray-200
              px-4 py-2 rounded-lg 
              hover:text-white dark:hover:text-slate-800
              hover:bg-slate-700 dark:hover:bg-gray-200
              flex gap-2 items-center"
              >
                Log In With
                <BsSpotify className="w-6 h-6 text-green-600 duration-150 cursor-pointer" />
              </button>
              {/* <button
              // https://api.spotify.com/authorize
              // if (authData) return;
              onClick={updateState}
              className="outline outline-1 p-1 rounded-lg text-sm hover:text-white hover:bg-black"
            >
              Fetch
            </button> */}
            </div>
          </div>
        )}
        <div className="w-full flex flex-col md:flex-row gap-6 justify-center">
          {/* <Playlists /> */}
          {authData && (
            <div className="flex flex-col gap-6 md:justify-start md:items-center">
              {activeSongData && (
                <FeaturesHorizontal
                  features={activeSongData}
                  setFeatures={setRecFeatures}
                />
              )}
              <button
                onClick={spotifyLogin}
                className="
                order-first md:order-last
                border border-1 
                border-slate-700 dark:border-gray-200
                px-4 py-2 rounded-lg 
                hover:text-white dark:hover:text-slate-800
                hover:bg-slate-700 dark:hover:bg-gray-200
                flex gap-2 items-center justify-center"
              >
                Re-Login With
                <BsSpotify className="w-6 h-6 text-green-600 duration-150 cursor-pointer" />
              </button>
            </div>
          )}
          <div className="flex flex-col gap-6">
            {/* <Piano segment={currentSegment} /> */}
            <SpotifyPlayerSDK>
              <div className="w-full md:w-[700px] h-full bg-white dark:bg-zinc-700 rounded-lg shadow-lg overflow-hidden border border-1">
                <div className="relative h-72 md:h-64 w-full flex flex-col md:flex-row overflow-visible">
                  {/* progress bar */}
                  <div className="absolute bottom-0 h-1 w-full bg-gray-200 z-10">
                    <div
                      className="h-full bg-blue-500 flex items-center justify-end"
                      style={{ width: `${songProgress}%` }}
                    >
                      <div className="rounded-full w-3 h-3 bg-white shadow"></div>
                    </div>
                  </div>
                  {/* /progress bar/ */}
                  {/* track image */}
                  <div className="w-full h-full md:w-96 overflow-hidden flex">
                    <img
                      src={
                        playerData
                          ? playerData.item.album.images[0].url
                          : "https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&h=250&q=80"
                      }
                      // https://api.spotify.com/authorize
                      // if (authData) return;
                      // "https://images.unsplash.com/photo-1500099817043-86d46000d58f?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=800&h=250&q=80"
                      className="object-cover w-full blur-[2px] md:blur-none"
                    />
                  </div>
                  {/* /track image/ */}
                  {/* player controls */}
                  <div className="w-full p-4 inset-0 flex flex-col justify-end from-slate-200 dark:from-gray-700 to-slate-100 dark:to-gray-600 bg-gradient-to-bl ttext-white">
                    <div className="absolute top-3 right-3 flex gap-2 items-center justify-center">
                      {/* <BsHeart className="w-7 h-7 hover:text-blue-600 duration-150 cursor-pointer mr-auto" /> */}
                      {/* <BsMusicNoteList
                        className="w-8 h-8 p-1 text-blue-500 hover:text-white hover:bg-blue-500 rounded duration-150 cursor-pointer"
                        onClick={() => setFullScreen(true)}
                      /> */}

                      <AvailableDevices />
                      <BsArrowsFullscreen
                        className="w-8 h-8 p-1 text-blue-500 hover:text-white hover:bg-blue-500 rounded duration-150 cursor-pointer"
                        onClick={() => setFullScreen(true)}
                      />
                    </div>
                    <div className="z-10 absolute bottom-5 right-4 flex gap-4 items-center">
                      <Controls playerData={playerData} />
                    </div>
                    <h3 className="opacity-70">
                      {playerData ? playerData.item.artists[0].name : "Artist"}
                    </h3>
                    <span className="font-bold">
                      {playerData ? playerData.item.name : "Song"}
                    </span>
                  </div>
                </div>
                {/* /player controls/ */}

                {/* track tabs */}
                {/* mobile tabs */}
                <div className="md:hidden w-full flex justify-center">
                  <p
                    className={`w-full py-1 text-center font-medium ${
                      activeTab === "queue"
                        ? "bg-blue-600 border border-1 border-slate-800 text-white"
                        : ""
                    }`}
                    onClick={() => setActiveTab("queue")}
                  >
                    Queue
                  </p>
                  <p
                    className={`w-full py-1 text-center font-medium ${
                      activeTab === "recommendations"
                        ? "bg-blue-600 border border-1 border-slate-800 text-white"
                        : ""
                    }`}
                    onClick={() => setActiveTab("recommendations")}
                  >
                    Recommendations
                  </p>
                </div>
                {/* others */}
                <div className="flex divide-x divide-black">
                  <div
                    className={`md:block w-full ${
                      activeTab === "queue" ? "block" : "hidden"
                    }`}
                  >
                    <SongQueue
                      trackQueue={trackQueue}
                      playerData={playerData}
                    />
                  </div>
                  <div
                    className={`md:block w-full ${
                      activeTab === "recommendations" ? "block" : "hidden"
                    }`}
                  >
                    <SongRecommendations
                      playerData={playerData}
                      recFeatures={recFeatures}
                    />
                  </div>
                </div>
              </div>
            </SpotifyPlayerSDK>
          </div>
        </div>
      </div>
    </SpotifyAuthContext.Provider>
  );
};

export default SpotifyPlayer;
