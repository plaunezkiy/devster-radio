export const msToMinsSecs = (time_ms) => {
  let min = Math.floor(time_ms / 60000);
  let sec = Math.floor((time_ms % 60000) / 1000).toFixed(0);
  return min + ":" + (sec < 10 ? "0" : "") + sec;
};
