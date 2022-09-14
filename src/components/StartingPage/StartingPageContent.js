import React from 'react'
import { useHistory } from 'react-router-dom'
import classes from './StartingPageContent.module.css'
import Card from '../Layout/Card'

const StartingPageContent = () => {
  const history = useHistory()

  const onUNIXFiles = () => {
    history.push('/unixfiles')
  }
  const onMVSFiles = () => {
    history.push('/mvsfiles')
  }
  const onJobs = () => {
    history.push('/jobs')
  }

  return (
    <section className={classes.starting}>
      <h1>Welcome to z/OS!</h1>
      <Card>
        <h2 onClick={onUNIXFiles}>UNIX Files</h2>
      </Card>
      <Card>
        <h2 onClick={onMVSFiles}>MVS Files</h2>
      </Card>
      <Card>
        <h2 onClick={onJobs}>JES Jobs</h2>
      </Card>
    </section>
  )
}

export default StartingPageContent
