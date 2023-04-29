import CurrentTrackContext from "@/utils/CurrentTrackContext";
import { useContext, useEffect, useState } from "react";
import { BsX } from "react-icons/bs";

const FullScreenModal = ({ open, setOpen, trackInfo }) => {
  // const dark = localStorage.getItem("theme");
  const { currentTrack } = useContext(CurrentTrackContext);
  // const [dominantColor, setDominantColor] = useState(
  //   dark === "dark" ? "#27272a" : "#fbfbfb"
  // );

  // useEffect(() => {

  // }, [])

  return (
    <div
      style={{
        // backgroundColor: dominantColor,
        // "--image-url": currentTrack?.album?.images[0].url,
        "--light-bg": "#fbfbfb",
        "--dark-bg": "#27272a",
        backgroundImage: `url(${currentTrack?.album?.images[0].url})`,
      }}
      className={`${
        open ? "opacity-1 z-20" : "opacity-0 -z-10"
      } absolute top-0 left-0 w-full h-full 
        flex items-center justify-center 
        duration-150 bg-[var(--light-bg)] dark:bg-[var(--dark-bg)] overflow-hidden`}
    >
      <img
        src={currentTrack?.album?.images[0].url}
        className="absolute top-0 left-0 w-full h-full scale-110 blur-lg -z-10"
        alt=""
      />
      <p className="absolute top-16 right-20" onClick={() => setOpen(false)}>
        <BsX className="w-10 h-10 text-red-500 font-semibold hover:text-white hover:bg-red-500 cursor-pointer border border-red-500 rounded shadow-lg" />
      </p>
      <div className="w-3/5 h-1/3 flex flex-col md:flex-row gap-8 items-start md:items-end">
        <img
          src={currentTrack?.album?.images[0].url}
          className="w-64 h-64 rounded-lg shadow-xl hover:scale-105 duration-300"
        />
        <div className="flex flex-col ttext-black text-3xl select-none">
          <h3 className="font-bold">{currentTrack?.artists[0].name}</h3>
          <span className="opacity-70">{currentTrack?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default FullScreenModal;
