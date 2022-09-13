import React, { useState, useRef, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { getURL } from "../../util/common-util";
import { queryTokenExpiry } from "../../util/auth-service";
import {
  DEFAULT_HOSTNAME,
  DEFAULT_PORT,
  DEFAULT_SECURE,
} from "../../common/constants";

import classes from "./AuthForm.module.css";

const USE_DEFAULT_SERVER = true;

const retrieveStoredHostState = () => {
  let hostName = localStorage.getItem("hostName");
  if (USE_DEFAULT_SERVER || !hostName) hostName = DEFAULT_HOSTNAME;

  let port = localStorage.getItem("port");
  if (USE_DEFAULT_SERVER || !port) port = DEFAULT_PORT;

  let isSecure = localStorage.getItem("isSecure");
  if (USE_DEFAULT_SERVER) isSecure = DEFAULT_SECURE;
  return {
    hostName,
    port,
    isSecure,
  };
};

const AuthForm = (props) => {
  const history = useHistory();
  const userIDInputRef = useRef();
  const passwordInputRef = useRef();
  const hostNameInputRef = useRef();
  const portInputRef = useRef();
  const secureInputRef = useRef();

  const authCtx = useContext(AuthContext);
  const [resourceId, setResourceId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [hostState, setHostState] = useState(retrieveStoredHostState());

  console.log("default hostState=" + hostState);

  useEffect(() => {
    let qpath = props.qpath;
    if (qpath) {
      console.log("qpath=" + qpath);
      setResourceId(qpath);
    }
  }, [props.qpath]);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredHostName = hostNameInputRef.current.value.trim();
    const enteredPort = portInputRef.current.value.trim();
    const enteredIsSecure = secureInputRef.current.value;
    const enteredUserID = userIDInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    console.log("enteredHostName=" + enteredHostName);
    console.log("enteredPort=" + enteredPort);
    console.log("enteredIsSecure=" + enteredIsSecure);
    setIsLoading(true);

    const loginURL = getURL(
      enteredHostName,
      enteredPort,
      enteredIsSecure,
      "/auth/login"
    );
    console.log("loginURL=" + loginURL);

    fetch(loginURL, {
      method: "POST",
      body: JSON.stringify({
        userid: enteredUserID,
        password: enteredPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.headers;
        } else {
          return res
            .json() // get data that came with response
            .then((data) => {
              // report the issue
              let errorMessage = "Authentication failed!";
              // if (data && data.error && data.error.message) {
              //   errorMessage = data.error.message;
              // }

              throw new Error(errorMessage);
            });
        }
      })
      .then((headers) => {
        const token = headers.get("authorization");

        const callQueryToken = async () => {
          const queryResponse = await queryTokenExpiry(
            enteredHostName,
            enteredPort,
            enteredIsSecure,
            token
          );

          const data = await queryResponse.json();
          const expiration = data.expiration;
          console.log("expiration=" + expiration);

          const expirationTime = new Date(expiration);

          authCtx.login(
            enteredHostName,
            enteredPort,
            enteredIsSecure,
            enteredUserID,
            token,
            expirationTime.toString()
          );

          if (resourceId) {
            console.log("redirecting to " + resourceId);
            history.replace(resourceId);
          } else {
            history.replace("/unixfiles"); // brings user back to starting page
          }
        };
        callQueryToken();
      })
      .catch((err) => {
        alert(err.message);
        setIsLoading(false);
      });
  };

  const hostUpdateHandler = (event) => {
    if (event.target.id === "hostname") {
      setHostState({ ...hostState, hostName: event.target.value });
    } else if (event.target.id === "port") {
      setHostState({ ...hostState, port: event.target.value });
    } else if (event.target.id === "secure") {
      const isChecked = event.target.checked;
      setHostState({ ...hostState, isSecure: isChecked });
    }
  };

  const userPassLayoutStyle = {
    display: "grid",
    padding: "1rem",
    width: "100%",
    border: "1px solid grey",
    borderRadius: "8px",
    gridGap: "10px",
    gridTemplateColumns: "1fr 1fr",
  };

  const serverLayoutStyle = {
    display: "grid",
    padding: "0.25rem",
    width: "100%",
    gridGap: "10px",
    gridTemplateColumns: "4fr 1fr",
  };

  const secureLayoutStyle = {
    display: "grid",
    gridGap: "1px",
    marginBottom: "0.5rem",
  };

  return (
    <section className={classes.auth}>
      <h1>Login</h1>
      <form onSubmit={submitHandler}>
        <div style={serverLayoutStyle}>
          <div className={classes.control}>
            <label htmlFor="hostname">Hostname</label>
            <input
              type="text"
              id="hostname"
              required
              readOnly={USE_DEFAULT_SERVER}
              disabled={USE_DEFAULT_SERVER}
              ref={hostNameInputRef}
              value={hostState.hostName}
              onChange={hostUpdateHandler}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="port">Port</label>
            <input
              type="text"
              id="port"
              required
              readOnly={USE_DEFAULT_SERVER}
              disabled={USE_DEFAULT_SERVER}
              ref={portInputRef}
              value={hostState.port}
              onChange={hostUpdateHandler}
            />
          </div>
        </div>
        <div style={secureLayoutStyle}>
          <label htmlFor="secure">Secure</label>
          <input
            type="checkbox"
            id="secure"
            readOnly={USE_DEFAULT_SERVER}
            disabled={USE_DEFAULT_SERVER}
            ref={secureInputRef}
            defaultChecked={true}
            value={hostState.isSecure}
            onChange={hostUpdateHandler}
          />
        </div>
        <div style={userPassLayoutStyle}>
          <div className={classes.control}>
            <label htmlFor="userid">User ID</label>
            <input type="name" id="userid" required ref={userIDInputRef} />
          </div>
          <div className={classes.control}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              required
              ref={passwordInputRef}
            />
          </div>
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>Login</button>}
          {isLoading && <p>Logging in...</p>}
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
