import { getURL } from './common-util'

const escapePath = path => {
  let newPath = path
  if (newPath.includes(' ')) {
    newPath = newPath.replace(' ', '%20')
  }
  return newPath
}

// returns a promise
export const fetchFiles = (path, authCtx) => {
  const JWT = authCtx.token
  const filePath = escapePath(path)
  const queryURL = getURL(authCtx.hostName, authCtx.port, authCtx.isSecure, '/unixfiles?path=' + filePath)

  console.log('queryURL=' + queryURL)
  try {
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

export const fetchFileContent = (path, authCtx) => {
  const JWT = authCtx.token
  const contentURL = getURL(authCtx.hostName, authCtx.port, authCtx.isSecure, '/unixfiles/' + path)
  try {
    const response = fetch(contentURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
