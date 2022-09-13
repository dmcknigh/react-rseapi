import React, { Component, Fragment } from "react";
import { useParams } from "react-router-dom";
import MVSFiles from "../components/MVSFiles/MVSFiles";

const MVSFilesPage = () => {
  console.log("MVS page");
  const params = useParams();

  // destructuring here allows us to just work with the quote id
  const { resourceId } = params;

  console.log("resourceId=" + resourceId);

  return (
    // uses routing to determine whether we should show "Load comments" or not
    <Fragment>
      <MVSFiles qpath={resourceId} />
    </Fragment>
  );
};

export default MVSFilesPage;
