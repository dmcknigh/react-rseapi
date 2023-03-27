import React, { Component, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import MVSFiles from '../components/MVSFiles/MVSFiles'

const MVSFilesPage = () => {
  const params = useParams()

  const { resourceId } = params

  console.log('MVSFilesPage:resourceId=' + resourceId)

  return (
    <Fragment>
      <MVSFiles qpath={resourceId} />
    </Fragment>
  )
}

export default MVSFilesPage
