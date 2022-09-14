import React, { Fragment } from 'react'

import MainNavigation from './MainNavigation'

const Layout = props => {
  return (
    <Fragment>
      <div className='bg-blue-300 h-screen'>
        <MainNavigation />

        <main>{props.children}</main>
      </div>
    </Fragment>
  )
}

export default Layout
