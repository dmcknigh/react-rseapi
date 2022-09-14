import React, { useState, useRef } from 'react'
import classes from './TextArea.module.css'

const TextArea = props => {
  const [textContent, setTextContent] = useState(props.content)
  const textAreaRef = useRef()

  const onContentChange = event => {
    console.log('changed content')
    // save
    //  setTextContent(textAreaRef.current.value);
  }

  return (
    <textarea
      className={classes.textarea}
      rows='50'
      cols='60'
      wrap='off'
      id='fileContent'
      ref={textAreaRef}
      defaultValue={props.content}
      onChange={onContentChange}
    >
      {props.children}
    </textarea>
  )
}

export default TextArea
