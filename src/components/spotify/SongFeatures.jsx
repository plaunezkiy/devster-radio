import React, { useState } from "react";
import { BsInfoCircle } from "react-icons/bs";

const HorizontalBar = ({ feature, value, onSetActive }) => {
  const [active, setActive] = useState(false);

  const setActiveHandler = () => {
    setActive(!active);
    onSetActive((prevState) => ({
      ...prevState,
      [feature.name]: { active: !active, value },
    }));
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center gap-1 hover:cursor-pointer"
      onClick={setActiveHandler}
    >
      <div
        className={`w-full bg-gray-200 rounded-full h-4 md:h-2.5 ${
          active
            ? "text-blue-500 ring ring-green-600"
            : "text-slate-700 dark:text-slate-300"
        }`}
      >
        <div
          style={{
            width: `${Math.abs((100 * value) / (feature.max - feature.min))}%`,
          }}
          className={`relative bg-blue-600 h-4 md:h-2.5 rounded-full group/tooltip ${
            active ? "bg-green-600" : ""
          }`}
        >
          <span className="absolute -mt-4 inline-block z-1 w-fit p-2 bg-slate-700 text-gray-100 text-xs rounded-lg opacity-80 invisible group-hover/tooltip:visible">
            {value}
          </span>
        </div>
      </div>
      <p
        className={`rerlative text-center text-sm capitalize font-semibold group/tooltip underline decoration-dotted underline-offset-4 ${
          active ? "text-green-600" : ""
        }`}
      >
        {feature.name}
        <span className="absolute bottom-6 -left-2 inline-block z-1 w-36 p-2 bg-slate-700 text-gray-100 text-xs rounded-lg opacity-80 invisible group-hover/tooltip:visible">
          {feature.description}
        </span>
      </p>
    </div>
  );
};

const getPitchFromIntKey = (int_key) => {
  const keys = {
    0: "C",
    1: "C#/Db",
    2: "D",
    3: "D#/Eb",
    4: "E",
    5: "F",
    6: "F#/Gb",
    7: "G",
    8: "G#/Ab",
    9: "A",
    10: "A#/Bb",
    11: "B",
  };
  return keys[int_key];
};

const UnitFeature = ({ label, value, unit, onSetActive }) => {
  const [active, setActive] = useState(false);
  const activeStyle = active ? " text-green-500" : "";
  let mode;
  let key;
  if (label == "key") {
    key = getPitchFromIntKey(value);
    mode = unit ? "Major" : "Minor";
  }

  const setActiveHandler = () => {
    if (mode) {
      onSetActive((prevState) => ({
        ...prevState,
        [label]: { active: !active, value },
        mode: { active: !active, value: unit },
      }));
    } else
      onSetActive((prevState) => ({
        ...prevState,
        [label]: { active: !active, value },
      }));
    setActive(!active);
  };

  return (
    <div
      className="w-full px-2 flex text-xs justify-between cursor-pointer"
      onClick={setActiveHandler}
    >
      <div className={"w-full flex flex-col items-center" + activeStyle}>
        <p className="text-sm font-semibold capitalize">{label}:</p>
        <p>{key ? key : value}</p>
        <p>{mode ? mode : unit}</p>
      </div>
    </div>
  );
};

export const FeaturesHorizontal = ({ features, setFeatures }) => {
  const barFeatures = [
    {
      name: "danceability",
      min: 0,
      max: 1,
      description:
        "Suitability for dancing (tempo, rhythm stability, beat strength, and overall regularity)",
    },
    {
      name: "energy",
      min: 0,
      max: 1,
      description:
        "Perceptual measure of intensity and activity (fast, loud, and noisy)",
    },
    {
      name: "loudness",
      min: -60,
      max: 0,
      description: "Average overall loudness (dB)",
    },
    {
      name: "speechiness",
      min: 0,
      max: 1,
      description: "Presence of spoken words in a track",
    },
    {
      name: "acousticness",
      min: 0,
      max: 1,
      description: "Confidence in song being acoustic",
    },
    {
      name: "instrumentalness",
      min: 0,
      max: 1,
      description: "Predicts whether a track contains no vocals",
    },
    {
      name: "liveness",
      min: 0,
      max: 1,
      description: "Presence of an audience in the recording",
    },
    { name: "valence", min: 0, max: 1, description: "Musical positiveness" },
  ];
  // key, mode(major/minor), tempo, duration?

  return (
    <div
      className="
    relative w-full md:w-40 flex flex-col px-4 py-2 gap-2 overflow-hidden
    border border-1 rounded-lg shadow-lg rounded-trr-none divide-y"
    >
      {/* <p className="absolute py-2 px-1 top-0 -right-7 flex justify-center outline outline-1 rounded-r-lg group/tooltip">
        <BsInfoCircle className="w-5 h-5" />
        <span className="absolute z-10 top-10 -right-10 inline-block w-36 p-2 bg-slate-700 text-gray-100 text-xs rounded-lg opacity-95 invisible group-hover/tooltip:visible">
          Use this toolbar to get information about your favourite songs. Select
          liked features and get recommendations that will hit the spot!
        </span>
      </p> */}
      <p className="text-center text-md font-semibold">Selected features:</p>
      <div className="flex flex-col gap-2 pt-2">
        <div className="px-2 flex text-xs">
          <UnitFeature
            label="key"
            value={features.key}
            unit={features.mode}
            onSetActive={setFeatures}
          />
          <UnitFeature
            label="tempo"
            value={features.tempo}
            unit="bpm"
            onSetActive={setFeatures}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-6 md:gap-4">
          {barFeatures.map((feature, feature_id) => (
            <HorizontalBar
              key={feature_id}
              feature={feature}
              value={features[feature.name]}
              onSetActive={setFeatures}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
