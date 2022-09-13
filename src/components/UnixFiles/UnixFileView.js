import React, { useState, useEffect, useContext } from "react";
import Card from "../Layout/Card";
import { fetchFileContent } from "../../util/file-service";
import AuthContext from "../../store/auth-context";
import TextArea from "../Layout/TextArea";
import classes from "./UnixFiles.module.css";

const UnixFileView = (props) => {
  const [content, setContent] = useState("");
  const authCtx = useContext(AuthContext);

  let path = props.selected;

  if (path === null || path === "/undefined" || path.length === 0) {
    console.log("not defined");
    path = localStorage.getItem("unixFilePath");
    if (!path) {
      path = null;
    }
  } else {
    localStorage.setItem("unixFilePath", path);
  }

  console.log("path is " + path);
  const hasContent = path !== null && path.length > 0;

  useEffect(() => {
    if (!hasContent) {
      return;
    }
    console.log("path=" + path);

    const callFetchFileContent = async () => {
      const response = await fetchFileContent(path, authCtx);
      const data = await response.json();
      const fileContent = data.content;
      setContent(fileContent);
    };

    callFetchFileContent();
  }, [path, authCtx]);

  const onContentChange = (event) => {
    // save to uss
  };

  const onShareSelected = (event) => {
    console.log("onShareSelected");
    const urlBase = window.location.origin;

    let sharePath = path.substring(1).replaceAll("/", "^");

    let fullPath = urlBase + "/unixfiles/" + sharePath;

    console.log("fullpath=" + fullPath);
    navigator.clipboard.writeText(fullPath);
  };

  return (
    <Card>
      <div className={classes.control}>
        <div style={{ display: "grid", gridTemplateColumns: "4fr 1fr 1fr" }}>
          <label htmlFor="path">{path}</label>
          <button type="checkbox" onClick={props.onToggleFullEdit}>
            Fullscreen
          </button>
          <button onClick={onShareSelected}>Share</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr" }}>
          <TextArea content={content}></TextArea>
        </div>
      </div>
    </Card>
  );
};

export default UnixFileView;
