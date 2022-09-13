import React, { useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import { getURL } from "../../util/common-util";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const history = useHistory();
  const userIDInputRef = useRef();
  const passwordInputRef = useRef();
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredUserID = userIDInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredNewPassword = newPasswordInputRef.current.value;

    //let url = BASE_URL + ':update?key=' + WebAPIKey;

    // rseapi
    let url = getURL(
      authCtx.hostName,
      authCtx.port,
      authCtx.isSecure,
      "/auth/login"
    );

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        userid: enteredUserID,
        password: enteredPassword,
        newpassword: enteredNewPassword,
      }),
      headers: {
        "Content-Type": "application.json",
      },
    }).then((res) => {
      // assuming this always succeeds
      history.replace("/");
    });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <div className={classes.control}>
          <label htmlFor="userid">User ID</label>
          <input type="name" id="userid" required ref={userIDInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Current Password</label>
          <input
            type="password"
            id="password"
            minLength="7"
            required
            ref={passwordInputRef}
          />
        </div>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          required
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
