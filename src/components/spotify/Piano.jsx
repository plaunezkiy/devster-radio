import { useState } from "react";

const Piano = ({ segment }) => {
  const THRESHOLD = 0.5;

  return (
    <div className="flex w-full justify-center">
      <div className="flex relative">
        {segment?.pitches.map((value, idx) => (
          <div
            key={idx}
            className={`flex border border-gray-400 rounded items-end justify-center ${
              [1, 3, 6, 8, 10].includes(idx)
                ? "absolute w-8 h-36 top-0 bg-black"
                : "w-12 h-48"
            } ${value > THRESHOLD ? "bg-green-500" : ""}`}
            style={{
              left: 2 + 1.5 * (idx - (idx % 2)) + "rem",
            }}
          >
            {value}
          </div>
        ))}
        {/* <div className="w-12 h-48 border border-gray-400 rounded">C</div>
        <div className="absolute top-0 1left-8-2 w-8 h-36 bg-black border border-gray-400 rounded bg"></div>
        <div className="w-12 h-48 border border-gray-400 rounded">D</div>
        <div className="absolute top-0 3left-20-5 w-8 h-36 bg-black border border-gray-400 rounded bg"></div>
        <div className="w-12 h-48 border border-gray-400 rounded">E</div>
        <div className="w-12 h-48 border border-gray-400 rounded">F</div>
        <div className="absolute top-0 6left-44-11 w-8 h-36 bg-black border border-gray-400 rounded bg"></div>
        <div className="w-12 h-48 border border-gray-400 rounded">G</div>
        <div className="absolute top-0 8left-56-14 w-8 h-36 bg-black border border-gray-400 rounded bg"></div>
        <div className="w-12 h-48 border border-gray-400 rounded">A</div>
        <div className="absolute top-0 10left-68 w-8 h-36 bg-black border border-gray-400 rounded bg"></div>
        <div className="w-12 h-48 border border-gray-400 rounded">B</div> */}
      </div>
      {/* 1  2
          3  5
          6  11
          8  14
         10  17

         1 2 5 6 7
       */}
    </div>
  );
};

export default Piano;
