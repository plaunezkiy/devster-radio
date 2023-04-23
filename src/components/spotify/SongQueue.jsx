// import {
//   PlayIcon,
//   PauseIcon,
//   PlusCircledIcon,
//   CrossCircledIcon,
//   ReloadIcon,
// } from "@radix-ui/react-icons";
import { BsThreeDots } from "react-icons/bs";
import { useContext, useRef, useState } from "react";
import { msToMinsSecs } from "@/utils/converter";
import SpotifyAuthContext from "@/utils/SpotifyAuthContext";
import { useRefreshTokenFetch } from "@/hooks/useFetch";
import useClickOutside from "@/hooks/useClickOutside";
import SpotifyPlaylistsContext from "@/utils/SpotifyPlaylistsContext";

const Popover = ({ activator, children }) => {
  const elRef = useRef(null);
  const [display, setDisplay] = useState(false);
  useClickOutside(elRef, () => setDisplay(false));

  return (
    <div className="relative" ref={elRef}>
      <div onClick={() => setDisplay(!display)}>{activator}</div>
      {display && <>{children}</>}
    </div>
  );
};

const AddToPlaylist = ({ track }) => {
  const { loading, error, fetchData, postData, putData } =
    useRefreshTokenFetch();
  const authData = useContext(SpotifyAuthContext);
  const playlists = useContext(SpotifyPlaylistsContext);
  const [filteredPlaylists, setFilteredPlaylsits] = useState();

  // const playlists = [
  //   {
  //     id: 1,
  //     name: "chill1",
  //     image: "https://i.scdn.co/image/ab67616d0000b273c18ad9004697f1e58778f338",
  //   },
  //   {
  //     id: 2,
  //     name: "chill2",
  //     image: "https://i.scdn.co/image/ab67616d0000b273c18ad9004697f1e58778f338",
  //   },
  //   {
  //     id: 3,
  //     name: "chill3",
  //     image: "https://i.scdn.co/image/ab67616d0000b273c18ad9004697f1e58778f338",
  //   },
  //   {
  //     id: 4,
  //     name: "chill4",
  //     image: "https://i.scdn.co/image/ab67616d0000b273c18ad9004697f1e58778f338",
  //   },
  // ];

  const addToPlaylist = (playlist) => {
    postData(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      authData,
      JSON.stringify({
        uris: [track.uri],
      }),
      () => {
        if (!playlists.selected.includes(playlist)) {
          playlists.selected.unshift(playlist);
        } else {
          playlists.selected.sort((x, y) =>
            x === playlist ? -1 : y === playlist ? 1 : 0
          );
        }
        // console.log(playlists.selected);
        setFilteredPlaylsits(playlists.selected);
      }
    );
    // fetchData(
    //   `https://api.spotify.com/v1/me/playlists?limit=50`,
    //   authData,
    //   (data) => {
    //     // const ps = data.filter(p => )
    //     console.log(data.items);
    //   }
    // );
  };

  const filterPlaylists = async (query) => {
    if (playlists.all.length === 0) {
      await fetchData(
        `https://api.spotify.com/v1/me/playlists?limit=50`,
        authData,
        (data) => (playlists.all = data.items)
      );
    }
    // fetchData();
    // console.log(query);
    if (query.trim().length > 2) {
      console.log(playlists.all);
      setFilteredPlaylsits(
        playlists.all.filter((playlist) =>
          playlist.name.toLowerCase().includes(query)
        )
      );
      // console.log(query);
    } else setFilteredPlaylsits(playlists.selected);
  };

  return (
    <Popover
      activator={
        <button className="focus:outline-none group/button">
          {/* <CrossCircledIcon className="w-5 h-5 group-hover/button:text-red-500" /> */}
          <BsThreeDots className="w-5 h-5 group-hover/button:text-green-500" />
        </button>
      }
    >
      <div
        className="w-48 absolute bottom-10 right-0 px-4 py-2 z-20
                      border rounded bg-gray-200 text-slate-800
                      flex flex-col items-center gap-1"
      >
        <div className=""></div>
        <p className="text-sm font-medium">Add to playlist</p>
        <input
          type="text"
          className="w-44 rounded h-6 text-sm font-normal"
          onChange={(e) => filterPlaylists(e.target.value)}
        />
        <div className="mt-2 flex gap-2 justify-around">
          {filteredPlaylists?.slice(0, 3).map((playlist) => (
            <div
              key={playlist.id}
              className="relative group/playlist"
              onClick={() => addToPlaylist(playlist)}
            >
              <div className="img w-9 hover:scale-110 duration-150">
                <img
                  src={
                    playlist.images[0]
                      ? playlist.images[0].url
                      : `https://play-lh.googleusercontent.com/P2VMEenhpIsubG2oWbvuLGrs0GyyzLiDosGTg8bi8htRXg9Uf0eUtHiUjC28p1jgHzo`
                  }
                  className="rounded-full"
                />
              </div>
              <p
                className="absolute px-2 py-1 -top-8 left-1/2 -translate-x-1/2
                            bg-slate-800 text-gray-300 rounded scale-0 text-xs
                            group-hover/playlist:scale-100 duration-100 w-24"
              >
                {playlist.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Popover>
  );
};

const TrackItem = ({ track }) => {
  return (
    <div className="h-fit p-2.5 flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-zinc-600">
      <div className="flex-1 text-sm">
        {track.artists[0].name} - {track.name}
      </div>
      <div className="text-xs text-gray-400">
        {msToMinsSecs(track.duration_ms)}
      </div>
      <AddToPlaylist track={track} />
    </div>
  );
};

const SongQueue = ({ trackQueue, playerData }) => {
  const authData = useContext(SpotifyAuthContext);
  const [show, setShow] = useState(true);
  const { loading, error, fetchData, postData, putData } =
    useRefreshTokenFetch();

  const playTrack = (track) => {
    const queueUris = [
      track.uri,
      ...trackQueue
        .filter((t) => t.uri !== track.uri)
        .map((track) => track.uri),
    ];
    // console.log([trackUri, ...trackQueue.map((track) => track.uri)]);\
    console.log(track.name);
    postData(
      `https://api.spotify.com/v1/me/player/queue?uri=${track.uri}`,
      authData
    );
  };

  return (
    <div className="w-full">
      <div className="flex px-2 justify-between bg-gray-100 dark:bg-zinc-600 border-b border-black">
        <p
          className="my-2 text-center font-semibold cursor-pointer"
          // onClick={() => setShow((s) => !s)}
        >
          Song queue:
        </p>
      </div>
      <div className="text-xs sm:text-base divide-y cursor-default divide-y divide-black">
        {trackQueue.map((track, index) => (
          <TrackItem key={`${track.id}${index}`} track={track} />
        ))}
      </div>
    </div>
  );
};

export default SongQueue;
