import React from "react";
import { Fragment } from "react";

import MainNavigation from "./MainNavigation";

const Layout = (props) => {
  return (
    <Fragment>
      <div style={{ backgroundColor: "lightblue" }}>
        <MainNavigation />

        <main>{props.children}</main>
      </div>
    </Fragment>
  );
};

export default Layout;
