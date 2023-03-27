import { BASE_URL } from '../common/constants'

export const getURL = (remoteHostName, port, isSecure, entryPoint) => {
  console.log('isSecure=' + isSecure)
  const RSEURL = (isSecure ? 'https' : 'http') + '://' + remoteHostName + ':' + port + '/rseapi/api/v1' + entryPoint

  console.log('URL=' + RSEURL)
  return RSEURL.trim()
}

export const getURL2 = (remoteHostName, port, isSecure, entryPoint) => {
  return BASE_URL + entryPoint
}
  
  
export const unsecuredCopyToClipboard = (text) => {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  
    document.body.removeChild(textArea);
}
