import React, { useState, useEffect } from "react";
import classes from "./CommonProperties.module.css";
import CommonPropetiesTree from "./CommonPropertiesTree";
import Card from "../Layout/Card";

const CommonProperties = () => {
  const layoutStyle = { display: "grid", gridTemplateColumns: "1fr" };

  return (
    <section className={classes.form}>
      <h1>Common Properties Explorer</h1>
      <Card>
        <CommonPropetiesTree />
      </Card>
    </section>
  );
};

export default CommonProperties;
