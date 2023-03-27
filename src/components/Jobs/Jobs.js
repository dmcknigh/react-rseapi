import React, { useState, useEffect } from 'react'
import classes from './Jobs.module.css'
import JobsTree from './JobsTree'
import JobView from './JobView'
import Card from '../Layout/Card'

const Jobs = props => {
  const [selectedJobName, setSelectedJobName] = useState('')
  const [selectedJobId, setSelectedJobId] = useState('')
  const [selectedJobFileId, setSelectedJobFileId] = useState('')
  const [fullEdit, setFullEdit] = useState(false)

  useEffect(() => {
    if (props.qpath) {
      let qpath = props.qpath.replaceAll('^', '/')
      //  let qpath = props.qpath.replace('_', ':').replace('_', '/')

      console.log('qpath=' + qpath)
      jobFileSelected(qpath)
    }
  }, [props.qpath])

  const jobFileSelected = jobSpoolKey => {
    console.log('spool key=' + jobSpoolKey)
    // const [jobKey, spoolId] = jobSpoolKey.split('/')
    // const [jobName, jobId] = jobKey.split(':')
    const [jobName, jobId, spoolId] = jobSpoolKey.split('/')

    console.log('jobName='+jobName)
    console.log('jobId='+jobId)
    console.log('spoolId='+spoolId)

    setSelectedJobName(jobName)
    setSelectedJobId(jobId)
    setSelectedJobFileId(spoolId)
  }

  const onToggleFullEdit = () => {
    setFullEdit(!fullEdit)
  }

  const layoutStyle = fullEdit ? {} : { display: 'grid', gridTemplateColumns: '1fr 2fr' }

  return (
      <section className="flex flex-col">
      <h1 className='mb-4 pl-6 text-4xl text-black tracking-wide uppercase'>JES Jobs</h1>
      <div className='flex'>
        {!fullEdit && (
          <Card>
            <JobsTree onJobFileSelected={jobFileSelected} />
          </Card>
        )}
        <JobView jobName={selectedJobName} jobId={selectedJobId} jobFileId={selectedJobFileId} onToggleFullEdit={onToggleFullEdit} />
      </div>
    </section>
  )
}

export default Jobs
