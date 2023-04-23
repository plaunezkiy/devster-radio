import { useCallback, useContext, useEffect, useState } from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import SpotifyAuthContext from "@/utils/SpotifyAuthContext";

const SpotifyPlayerSDK = ({ children }) => {
  const authData = useContext(SpotifyAuthContext);
  const getOAuthToken = useCallback((callback) => {
    callback(authData?.access_token);
  }, []);

  return (
    <WebPlaybackSDK
      initialDeviceName="Devster Radio"
      getOAuthToken={getOAuthToken}
      initialVolume={1}
    >
      {children}
    </WebPlaybackSDK>
  );
};

export default SpotifyPlayerSDK;
