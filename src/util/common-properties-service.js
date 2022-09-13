import { getURL } from "./common-util";

// returns a promise
export const fetchNamespaces = (authCtx) => {
  const JWT = authCtx.token;
  const queryURL = getURL(
    authCtx.hostName,
    authCtx.port,
    authCtx.isSecure,
    "/commonproperties"
  );

  console.log("queryURL=" + queryURL);
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

export const fetchContent = (namespace, pathInJSON, authCtx) => {
  const JWT = authCtx.token;
  const contentURL = getURL(
    authCtx.hostName,
    authCtx.port,
    authCtx.isSecure,
    "/commonproperties/" + namespace + "?jsonPath=" + pathInJSON
  );
  try {
    const response = fetch(contentURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export const putContent = (namespace, pathInJSON, content, authCtx) => {
  const JWT = authCtx.token;
  const contentURL = getURL(
    authCtx.hostName,
    authCtx.port,
    authCtx.isSecure,
    "/commonproperties/" + namespace + "?jsonPath=" + pathInJSON
  );
  try {
    const response = fetch(contentURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: JWT,
      },
      body: JSON.stringify(content),
    });

    console.log("response:" + response);
    return response;
  } catch (error) {
    console.log("error: " + error);
    alert(error.message);
  }
};
