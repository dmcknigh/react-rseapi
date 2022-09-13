import React, { useState, useEffect, useCallback } from "react";
import {
  DEFAULT_HOSTNAME,
  DEFAULT_PORT,
  DEFAULT_SECURE,
} from "../common/constants";

let logoutTimer;

const AuthContext = React.createContext({
  hostName: "",
  port: "",
  isSecure: true,
  userId: "",
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

// find out how much time we have left
const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime(); // gets current time in miliseconds
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingTime = adjExpirationTime - currentTime;
  return remainingTime;
};

const retrieveStoredToken = () => {
  // load the token (and expiration time)
  const hostName = localStorage.getItem("hostName");
  const port = localStorage.getItem("port");
  const isSecure = localStorage.getItem("isSecure");
  const userId = localStorage.getItem("userId");
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);
  console.log("remaining time on token=" + remainingTime);
  if (remainingTime <= 60000) {
    // using a 1 minute threshold
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }
  return {
    hostName: hostName,
    port: port,
    isSecure: isSecure,
    userId: userId,
    token: storedToken,
    duration: remainingTime,
  };
};

// create a wrapper that can be used to easily wrap other components
export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  let initialUserId;
  if (tokenData && tokenData.token) {
    initialToken = tokenData.token;
    initialUserId = tokenData.userId;
  }
  const [token, setToken] = useState(initialToken);
  const [userId, setUserId] = useState(initialUserId);
  const [hostState, setHostState] = useState({
    hostName: DEFAULT_HOSTNAME,
    port: DEFAULT_PORT,
    isSecure: DEFAULT_SECURE,
  });

  const userIsLoggedIn = !!token; // turns the token into an existance check

  // using useCallback here because we only want to call this once - don't want an infinite loop!
  const logoutHandler = useCallback(() => {
    setToken(null);

    // remove the stored token for this site
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      // get rid of the timer if it were set
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (
    hostName,
    port,
    isSecure,
    userId,
    token,
    expirationTime
  ) => {
    console.log("user login:" + userId);
    setToken(token);
    setUserId(userId);
    setHostState({ hostName: hostName, port: port, isSecure: isSecure });

    // store the token for this site
    localStorage.setItem("hostName", hostName);
    localStorage.setItem("port", port);
    localStorage.setItem("isSecure", isSecure);
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token); // basic storage built into the browser
    localStorage.setItem("expirationTime", expirationTime); // also store the expiry time

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime); // call logoutHandler when we expire
  };

  // this use effect was added for cases where app is reloaded and we have stored token data
  // only recall this if the token data changes
  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    hostName: hostState.hostName,
    port: hostState.port,
    isSecure: hostState.isSecure,
    userId: userId,
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
