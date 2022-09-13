import React, { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../../store/auth-context";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();

    // optional: redirect user
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div>
          <div className={classes.logo}>
            <font color="green">RSEAPI </font>
            {authCtx.isLoggedIn && (
              <font color="red">
                <i>
                  {authCtx.hostName}:{authCtx.port}
                </i>
              </font>
            )}
          </div>
        </div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}

          {isLoggedIn && (
            <li>
              <Link to="/unixfiles">Unix Files</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/mvsfiles">MVS Files</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/jobs">Jobs</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/commonproperties">Common Properties</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/team">Team</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/profile">Settings</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
