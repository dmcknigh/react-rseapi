import React, { useState, useEffect } from 'react'
import classes from './CommonProperties.module.css'
import CommonPropetiesTree from './CommonPropertiesTree'
import Card from '../Layout/Card'

const CommonProperties = () => {
  const layoutStyle = { display: 'grid', gridTemplateColumns: '1fr' }

  return (
    <section className={classes.form}>
      <h1 className='mb-4 pl-6 text-4xl text-black tracking-wide uppercase'>Common Properties Explorer</h1>
      <Card>
        <CommonPropetiesTree />
      </Card>
    </section>
  )
}

export default CommonProperties
