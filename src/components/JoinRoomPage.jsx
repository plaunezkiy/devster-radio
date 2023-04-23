import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RoomCodeCharacter = ({ id }) => {
  console.log(id);
  return (
    <div>
      <input
        inputMode="numeric"
        pattern="\d{1}"
        type="text"
        className="w-12 h-14 text-xl font-semibold rounded border text-center "
      />
    </div>
  );
};

const OtpInput = ({ value, valueLength, setValue }) => {
  const inputHandler = (e, idx) => {
    // change char
    let newValue = Object.assign("", value);
    newValue[idx] = e.target.value.trim();
    setValue(newValue);
    // go back
    if (!e.target.value.trim()) {
      const prevSibling = e.target.previousElementSibling;
      if (prevSibling) prevSibling.focus();
      return;
    }
    // go forward
    const nextSibling = e.target.nextElementSibling;
    if (nextSibling) {
      nextSibling.focus();
      return;
    }
    // evaluate
    console.log(value);
  };

  const pasteHandler = (e) => {
    e.preventDefault();
    const val = e.clipboardData.getData("text/plain");
    setValue(val.slice(0, 5));
    // evaluate
    console.log(value);
  };

  return (
    <div className="flex gap-3" onPaste={pasteHandler}>
      {[...Array(valueLength).keys()].map((idx) => (
        <input
          key={idx}
          value={value[idx] || " "}
          onChange={(e) => inputHandler(e, idx)}
          className="w-12 h-14 text-xl font-semibold rounded border text-center dark:bg-gray-800"
        />
      ))}
    </div>
  );
};

const JoinRoomPage = () => {
  const navigate = useNavigate();
  const codeLength = 5;
  const [code, setCode] = useState("");
  const codeCharIds = [...Array(5).keys()];

  return (
    <div className="w-96 flex flex-col gap-8 items-center px-4 py-12 border rounded-lg shadow">
      <p className="text-3xl font-semibold">Enter Room Code:</p>
      <div className="flex gap-3 mb-4">
        {/* {codeCharIds.map((id) => (
          <RoomCodeCharacter key={id} id={id} />
        ))} */}
        <OtpInput value={code} setValue={setCode} valueLength={codeLength} />
      </div>

      <p
        className="w-48 p-4 border border-blue-500 rounded shadow text-center text-lg hover:bg-blue-500 hover:text-white duration-150 hover:shadow-lg cursor-pointer"
        onClick={() => {
          console.log(JSON.stringify(code));
          // navigate(`/rooms/${code.toString()}`);
        }}
      >
        Join the room
      </p>
    </div>
  );
};

export default JoinRoomPage;
