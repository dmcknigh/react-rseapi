import React from 'react'
import classes from './Card.module.css'

const Card = props => {
  return <div className='flex flex-col flex-container m-2 p-8 bg-white rounded-lg'>{props.children}</div>
}

export default Card
