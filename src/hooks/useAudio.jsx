import { useEffect, useRef, useState } from "react";

const useAudio = () => {
  const [src, setSrc] = useState(
    "https://p.scdn.co/mp3-preview/d3c24d235855cebdaf642ce1b8cb46abb64a655f?cid=1b529e30c45c436ab981c95bfa4c57f4"
  );
  const audio = useRef(new Audio(src));

  return [
    !audio.current.paused,
    audio.current.load.bind(audio.current),
    audio.current.play.bind(audio.current),
    audio.current.pause.bind(audio.current),
    setSrc,
  ];
};

export default useAudio;
