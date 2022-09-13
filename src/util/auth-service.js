import { getURL } from "./common-util";

export const queryTokenExpiry = (hostName, port, isSecure, token) => {
  const queryTokenURL = getURL(hostName, port, isSecure, "/auth/query");

  console.log("queryToken URL:" + queryTokenURL);
  // now query the token to determine expiration time
  const response = fetch(queryTokenURL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
  });

  return response;
};
