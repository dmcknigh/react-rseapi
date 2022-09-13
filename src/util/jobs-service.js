import { getURL } from "./common-util";

// returns a promise
export const fetchJobs = (prefix, owner, authCtx) => {
  const JWT = authCtx.token;

  const queryURL = getURL(
    authCtx.hostName,
    authCtx.port,
    authCtx.isSecure,
    "/jobs?prefix=" + prefix + "&owner=" + owner
  );
  console.log("query URL=" + queryURL);
  try {
    const response = fetch(queryURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: JWT,
      },
    });

    console.log("response:" + response);
    return response;
  } catch (error) {
    console.log("error: " + error);
    alert(error.message);
  }
};

export const fetchJobSpools = (jobName, jobId, authCtx) => {
  const JWT = authCtx.token;
  const queryURL = getURL(
    authCtx.hostName,
    authCtx.port,
    authCtx.isSecure,
    "/jobs/" + jobName + "/" + jobId + "/files"
  );
  try {
    const response = fetch(queryURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: JWT,
      },
    });

    console.log("response:" + response);
    return response;
  } catch (error) {
    console.log("error: " + error);
    alert(error.message);
  }
};

export const fetchJobFileContent = (jobName, jobId, fileId, authCtx) => {
  const JWT = authCtx.token;
  const queryURL = getURL(
    authCtx.hostName,
    authCtx.port,
    authCtx.isSecure,
    "/jobs/" + jobName + "/" + jobId + "/files/" + fileId + "/content"
  );
  try {
    const response = fetch(queryURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: JWT,
      },
    });

    console.log("response:" + response);
    return response;
  } catch (error) {
    console.log("error: " + error);
    alert(error.message);
  }
};
