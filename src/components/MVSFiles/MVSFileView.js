import React, { useState, useEffect, useContext } from 'react'
import Card from '../Layout/Card'
import { fetchFileContent } from '../../util/mvs-file-service'
import AuthContext from '../../store/auth-context'
import TextArea from '../Layout/TextArea'
import { unsecuredCopyToClipboard } from '../../util/common-util'
import classes from './MVSFiles.module.css'

const MVSFileView = props => {
  const [content, setContent] = useState('')
  const authCtx = useContext(AuthContext)

  let path = props.selected
  if (path === null || path === '/undefined' || path.length === 0) {
    // pick up historic one
    path = localStorage.getItem('mvsFilePath')
    if (!path){
      path = null
    }
  } else {
    localStorage.setItem('mvsFilePath', path) // store historic one
  }

  console.log('path is ' + path)
  const hasContent = path !== null && path.length > 0

  useEffect(() => {
    if (!hasContent) {
      return
    }
    console.log('path=' + path)

    const callFetchFileContent = async () => {
      console.log('callFetchFileContent for ' + path)
      const response = await fetchFileContent(path, authCtx)
      if (response.ok) {
        const data = await response.json()
        const fileContent = data.records
        setContent(fileContent)
      } else {
        console.log('error calling fetch with rc=' + response.status)
      }
    }

    callFetchFileContent()
  }, [path, authCtx])

  const onContentChange = event => {}


  const onShareSelected = event => {
    console.log('onShareSelected')

    const urlBase = window.location.origin
    let sharePath = path
    let fullPath = urlBase + '/mvsfiles/' + sharePath

    console.log('fullpath=' + fullPath)

    if (window.isSecureContext){ // allowed to do this?
      navigator.clipboard.writeText(fullPath)
    }
    else
    {
      // insecure hack
      unsecuredCopyToClipboard(fullPath)
    }
  }
  return (
    <Card>
      <div className={classes.control}>
        <div style={{ display: 'grid', gridTemplateColumns: '4fr 1fr 1fr' }}>
          <label htmlFor='path'>{path}</label>
          <button onClick={props.onToggleFullEdit}>Fullscreen</button>
          <button onClick={onShareSelected}>Share</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr' }}>
          <TextArea content={content}></TextArea>
        </div>
      </div>
    </Card>
  )
}

export default MVSFileView
