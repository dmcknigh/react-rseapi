import { getURL } from './common-util'

// returns a promise
export const fetchDataSets = (path, authCtx) => {
  const JWT = authCtx.token
  const queryURL = getURL(authCtx.hostName, authCtx.port, authCtx.isSecure, '/datasets/' + path)
  try {
    const response = fetch(queryURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': JWT,
        'Included-Attributes': 'name,dsnType',
      },
    })

    console.log('response:' + response)
    return response
  } catch (error) {
    console.log('error: ' + error)
    alert(error.message)
  }
}

// returns a promise
export const fetchMembers = (path, authCtx) => {
  const JWT = authCtx.token
  const queryURL = getURL(authCtx.hostName, authCtx.port, authCtx.isSecure, '/datasets/' + path + '/members')
  try {
    const response = fetch(queryURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': JWT,
        'Included-Attributes': 'name,dsnType',
      },
    })

    console.log('response:' + response)
    return response
  } catch (error) {
    console.log('error: ' + error)
    alert(error.message)
  }
}

export const fetchFileContent = (path, authCtx) => {
  const JWT = authCtx.token
  const queryURL = getURL(authCtx.hostName, authCtx.port, authCtx.isSecure, '/datasets/' + path + '/content')
  try {
    console.log('calling fetch with ' + queryURL)
    const response = fetch(queryURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': JWT,
      },
    })

    console.log('response:' + response)
    return response
  } catch (error) {
    console.log('error: ' + error)
    alert(error.message)
  }
}
