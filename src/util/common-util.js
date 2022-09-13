import { BASE_URL } from "../common/constants";

export const getURL = (remoteHostName, port, isSecure, entryPoint) => {
  console.log("isSecure=" + isSecure);
  const RSEURL =
    (isSecure ? "https" : "http") +
    "://" +
    remoteHostName +
    ":" +
    port +
    "/rseapi/api/v1" +
    entryPoint;

  console.log("URL=" + RSEURL);
  return RSEURL.trim();
};

export const getURL2 = (remoteHostName, port, isSecure, entryPoint) => {
  return BASE_URL + entryPoint;
};
