import { createContext } from "react";

const SpotifyPlaylistsContext = createContext({
  selected: [],
  all: [],
});

export default SpotifyPlaylistsContext;
