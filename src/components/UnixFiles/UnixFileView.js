import React, { useState, useEffect, useContext } from 'react'
import Card from '../Layout/Card'
import { fetchFileContent } from '../../util/file-service'
import AuthContext from '../../store/auth-context'
import TextArea from '../Layout/TextArea'
import classes from './UnixFiles.module.css'

const UnixFileView = props => {
  const [content, setContent] = useState('')
  const authCtx = useContext(AuthContext)

  let path = props.selected

  if (path === null || path === '/undefined' || path.length === 0) {
    console.log('not defined')
    path = localStorage.getItem('unixFilePath')
    if (!path) {
      path = null
    }
  } else {
    localStorage.setItem('unixFilePath', path)
  }

  console.log('path is ' + path)
  const hasContent = path !== null && path.length > 0

  useEffect(() => {
    if (!hasContent) {
      return
    }
    console.log('path=' + path)

    const callFetchFileContent = async () => {
      const response = await fetchFileContent(path, authCtx)
      const data = await response.json()
      const fileContent = data.content
      setContent(fileContent)
    }

    callFetchFileContent()
  }, [path, authCtx])

  const onContentChange = event => {
    // save to uss
  }
  function unsecuredCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
    }
    document.body.removeChild(textArea);
  }

  const onShareSelected = event => {
    console.log('onShareSelected')

    const urlBase = window.location.origin
    let sharePath = path.substring(1).replaceAll('/', '^')
    let fullPath = urlBase + '/unixfiles/' + sharePath

    console.log('fullpath=' + fullPath)
    if (window.isSecureContext){ // allowed to do this?
      navigator.clipboard.writeText(fullPath)
    }
    else {
      // insecure hack
      unsecuredCopyToClipboard(fullPath)
    }
  }

  return (
    <div className='flex flex-col flex-container m-2 p-8 bg-white rounded-lg w-full'>
      <div className='mb-4 w-100'>
        <div className='flex flex-col my-2'>
          <div className='flex justify-end'>
            <button className='mx-4' type='checkbox' onClick={props.onToggleFullEdit}>
              Fullscreen
            </button>
            <button className='mx-4' onClick={onShareSelected}>
              Share
            </button>
          </div>
          <label className='mb-2 text-black font-bold' htmlFor='path'>
            {path}
          </label>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
          <TextArea content={content}></TextArea>
        </div>
      </div>
    </div>
  )
}

export default UnixFileView
