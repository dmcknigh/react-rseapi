import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Jobs from '../components/Jobs/Jobs'

const JobsPage = () => {
  console.log('jobs page')
  const params = useParams()

  const { resourceId } = params

  return (
    <Fragment>
      <Jobs qpath={resourceId} />
    </Fragment>
  )
}

export default JobsPage
