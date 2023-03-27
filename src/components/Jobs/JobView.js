import React, { useState, useEffect, useContext } from 'react'
import Card from '../Layout/Card'
import { fetchJobFileContent } from '../../util/jobs-service'
import AuthContext from '../../store/auth-context'
import TextArea from '../Layout/TextArea'
import classes from './Jobs.module.css'

const JobView = props => {
  const [content, setContent] = useState('')
  const authCtx = useContext(AuthContext)

  let jobId = props.jobId
  console.log('jobId=' + jobId)
  if (jobId === null || jobId.length === 0) {
    jobId = localStorage.getItem('currentJobId')
  } else {
    // save these for refresh scenarios
    localStorage.setItem('currentJobId', jobId)
  }
  console.log('jobId=' + jobId)

  let jobName = props.jobName
  if (jobName === null || jobName.length === 0) {
    jobName = localStorage.getItem('currentJobName')
  } else {
    localStorage.setItem('currentJobName', jobName)
  }

  let fileId = props.jobFileId
  if (fileId === null || fileId.length === 0) {
    fileId = localStorage.getItem('currentJobFileId')
  } else {
    localStorage.setItem('currentJobFileId', fileId)
  }

  console.log('jobId=' + jobId)
  console.log('job name=' + jobName)
  console.log('job view - file id:' + fileId)

  useEffect(() => {
    const callFetchFileContent = async () => {
      const response = await fetchJobFileContent(jobName, jobId, fileId, authCtx)
      const data = await response.json()
      const fileContent = data.content
      setContent(fileContent)
    }

    const timeout = setTimeout(() => {
      // using timeout here otherwise jobs querys can conflict
      callFetchFileContent()
    }, 200)
    return () => clearTimeout(timeout)

    // callFetchFileContent();
  }, [jobName, jobId, fileId, authCtx])

  let displayedPath = jobName + '/' + jobId + '/' + fileId
  if (jobName === null || jobName.length === 0) {
    displayedPath = ''
  }

  const onContentChange = event => {}


  const unsecuredCopyToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
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
    //  let sharePath = displayedPath
    // let sharePath = displayedPath.replace('/', ':').replace('/', '^')
    let sharePath = displayedPath.replaceAll('/', '^')
    let fullPath = urlBase + '/jobs/' + sharePath

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
          <label htmlFor='path'>{displayedPath}</label>
          <button onClick={props.onToggleFullEdit}>Fullscreen</button>
          <button onClick={onShareSelected}>Share</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr' }}>
          <TextArea content={content}></TextArea>
        </div>
      </div>
    </Card>
  )
}

export default JobView
