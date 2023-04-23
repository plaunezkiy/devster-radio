import { useState } from "react";
import FullScreenModal from "@/components/FullScreenModal";
import SpotifyPlayer from "@/components/spotify/SpotifyPlayer";
import CurrentTrackContext, {
  currentTrackProp,
} from "@/utils/CurrentTrackContext";

const DemoPage = () => {
  // const [play, togglePlay, progress, setAudioSrc] = useAudio("");
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(currentTrackProp);

  const [queue, setQueue] = useState([]);

  return (
    <CurrentTrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
      <FullScreenModal open={fullscreenMode} setOpen={setFullscreenMode} />
      <SpotifyPlayer setFullScreen={setFullscreenMode} />
    </CurrentTrackContext.Provider>
  );
};

export default DemoPage;
