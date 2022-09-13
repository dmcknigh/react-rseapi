import React, { Component, Fragment } from "react";
import classes from "./Team.module.css";
import TeamView from "./TeamView";
const Team = (props) => {
  const layoutStyle = {}; // { display: "grid", gridTemplateColumns: "1fr" };

  return (
    <section className={classes.form}>
      <h1>Team</h1>
      <div style={layoutStyle}>
        <TeamView />
      </div>
    </section>
  );
};

export default Team;
