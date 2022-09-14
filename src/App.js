import React, { useContext } from 'react'

import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import UserProfile from './components/Profile/UserProfile'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import UnixFilesPage from './pages/UnixFilesPage'
import AuthContext from './store/auth-context'
import UnixFiles from './components/UnixFiles/UnixFiles'
import MVSFiles from './components/MVSFiles/MVSFiles'
import MVSFilesPage from './pages/MVSFilesPage'
import JobsPage from './pages/JobsPage'
import Jobs from './components/Jobs/Jobs'
import Team from './components/Team/Team'
import CommonProperties from './components/CommonProperties/CommonProperties'

function App(props) {
  const authCtx = useContext(AuthContext)

  const location = useLocation()
  const { pathname } = location
  console.log('App: resourceId:' + pathname)

  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        {!authCtx.isLoggedIn && (
          <Route path='/auth'>
            <AuthPage />
          </Route>
        )}

        <Route path='/profile'>
          {authCtx.isLoggedIn && <UserProfile />}
          {!authCtx.isLoggedIn && <Redirect to='/auth' />}
        </Route>

        <Route exact path='/unixfiles'>
          {authCtx.isLoggedIn && <UnixFiles />}
          {!authCtx.isLoggedIn && <Redirect to='/auth' />}
        </Route>

        <Route path='/unixfiles/:resourceId'>
          {authCtx.isLoggedIn && <UnixFilesPage />}
          {!authCtx.isLoggedIn && <Redirect to='/auth' />}
          {!authCtx.isLoggedIn && (
            <Redirect
              to={{
                pathname: '/auth/',
                state: {
                  resourceId: pathname,
                },
              }}
            />
          )}
        </Route>

        <Route exact path='/mvsfiles'>
          {authCtx.isLoggedIn && <MVSFiles />}
          {!authCtx.isLoggedIn && <Redirect to='/auth' />}
        </Route>

        <Route path='/mvsfiles/:resourceId'>
          {authCtx.isLoggedIn && <MVSFilesPage />}
          {!authCtx.isLoggedIn && (
            <Redirect
              to={{
                pathname: '/auth/',
                state: {
                  resourceId: pathname,
                },
              }}
            />
          )}
        </Route>

        <Route exact path='/jobs'>
          {authCtx.isLoggedIn && <Jobs />}
          {!authCtx.isLoggedIn && <Redirect to='/auth' />}
        </Route>

        <Route path='/jobs/:resourceId'>
          {authCtx.isLoggedIn && <JobsPage />}
          {!authCtx.isLoggedIn && (
            <Redirect
              to={{
                pathname: '/auth/',
                state: {
                  resourceId: pathname,
                },
              }}
            />
          )}
        </Route>

        <Route exact path='/commonproperties'>
          {authCtx.isLoggedIn && <CommonProperties />}
          {!authCtx.isLoggedIn && <Redirect to='/commonproperties' />}
        </Route>

        <Route exact path='/team'>
          {authCtx.isLoggedIn && <Team />}
          {!authCtx.isLoggedIn && <Redirect to='/team' />}
        </Route>

        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </Layout>
  )
}

export default App
