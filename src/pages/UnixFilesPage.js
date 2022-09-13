import React, { Component, Fragment } from "react";
import { useParams } from "react-router-dom";
import UnixFiles from "../components/UnixFiles/UnixFiles";

const UnixFilesPage = () => {
  console.log("unixfilespage");
  const params = useParams();

  // destructuring here allows us to just work with the quote id
  const { resourceId } = params;

  console.log("resourceId=" + resourceId);

  return (
    // uses routing to determine whether we should show "Load comments" or not
    <Fragment>
      <UnixFiles qpath={resourceId} />
    </Fragment>
  );
};

export default UnixFilesPage;
