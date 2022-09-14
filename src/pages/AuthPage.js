import React from 'react'
import { Fragment } from 'react'
import { useLocation } from 'react-router-dom'
import AuthForm from '../components/Auth/AuthForm'

const AuthPage = () => {
  const location = useLocation()

  let resourceId = null
  const { state } = location
  if (state) {
    console.log('id:' + state.resourceId)
    resourceId = state.resourceId
  }

  return (
    // uses routing to determine whether we should show "Load comments" or not
    <Fragment>
      <AuthForm qpath={resourceId} />
    </Fragment>
  )
}

export default AuthPage
