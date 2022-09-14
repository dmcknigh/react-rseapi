// Built-in Dependencies
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

// External dependencies
import { BiLogIn, BiLogOut } from 'react-icons/bi'
import { FiSettings } from 'react-icons/fi'

// Redux
import AuthContext from '../../store/auth-context'

const MainNavigation = () => {
  // Context
  const authCtx = useContext(AuthContext)
  const isLoggedIn = authCtx.isLoggedIn

  const logoutHandler = () => {
    authCtx.logout()

    // optional: redirect user
  }

  return (
    <header className='flex items-center justify-between px-12 h-20 bg-gray-500 w-full'>
      <Link to='/'>
        <div>
          <div className='text-4xl m-0'>
            <font className='text-white'>RSEAPI </font>
            {authCtx.isLoggedIn && (
              <font className='text-black'>
                <i>
                  {authCtx.hostName}:{authCtx.port}
                </i>
              </font>
            )}
          </div>
        </div>
      </Link>
      <nav>
        <ul className='flex justify-center items-center'>
          {!isLoggedIn && (
            <li className='mx-2'>
              <Link className='px-4 py-2' to='/auth'>
                <BiLogIn color='white' size={24} />
              </Link>
            </li>
          )}
          {isLoggedIn && (
            <>
              {' '}
              <li className='mx-2'>
                <Link className='px-4 py-2 text-white font-bold hover:text-gray-300 uppercase' to='/unixfiles'>
                  Unix Files
                </Link>
              </li>
              <li className='mx-2'>
                <Link className='px-4 py-2 text-white font-bold hover:text-gray-300 uppercase' to='/mvsfiles'>
                  MVS Files
                </Link>
              </li>
              <li className='mx-2'>
                <Link className='px-4 py-2 text-white font-bold hover:text-gray-300 uppercase' to='/jobs'>
                  Jobs
                </Link>
              </li>
              <li className='mx-2'>
                <Link className='px-4 py-2 text-white font-bold hover:text-gray-300 uppercase' to='/commonproperties'>
                  Common Properties
                </Link>
              </li>
              <li className='mx-2'>
                <Link className='px-4 py-2 text-white font-bold hover:text-gray-300 uppercase' to='/team'>
                  Team
                </Link>
              </li>
              <li className='mx-2'>
                <Link className='px-4 py-2 ' to='/profile'>
                  <FiSettings color='white' size={24} />
                </Link>
              </li>
              <li className='mx-2'>
                <button className='px-4 py-2' onClick={logoutHandler}>
                  <BiLogOut color='white' size={24} />
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}

export default MainNavigation
