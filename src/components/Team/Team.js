import React, { Component, Fragment } from 'react'
import classes from './Team.module.css'
import TeamView from './TeamView'
const Team = props => {
  const layoutStyle = {} // { display: "grid", gridTemplateColumns: "1fr" };

  return (
    <section className={classes.form}>
      <h1 className='mb-4 pl-6 text-4xl text-black tracking-wide uppercase'>Team</h1>
      <div className='flex flex-col flex-container'>
        <TeamView />
      </div>
    </section>
  )
}

export default Team
