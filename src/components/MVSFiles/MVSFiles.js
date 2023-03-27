import React, { useState, useEffect } from 'react'
import classes from './MVSFiles.module.css'
import MVSFilesTree from './MVSFilesTree'
import MVSFileView from './MVSFileView'
import Card from '../Layout/Card'

const MVSFiles = props => {
  const [selectedFile, setSelectedFile] = useState('')
  const [selectedContainer, setSelectedContainer] = useState( () => {
    let defaultFilter = props.qpath
    if (defaultFilter) {
      console.log('props.qpath='+props.qpath)
      defaultFilter = props.qpath // passed in via url
      defaultFilter = defaultFilter.replaceAll('_', '/').toUpperCase()

      if (defaultFilter.includes('(')) {
        const index = defaultFilter.indexOf('(')
        defaultFilter = defaultFilter.substring(0, index)
      }
    }
    return defaultFilter
  })

  const [fullEdit, setFullEdit] = useState(false)

  const fileSelected = path => {
    console.log('file selected:' + path)
    setSelectedFile(path)
  }

  const onToggleFullEdit = () => {
    setFullEdit(!fullEdit)
  }

  const layoutStyle = fullEdit ? {} : { display: 'grid', gridTemplateColumns: '1fr 2fr' }

  console.log('selectedContainer='+selectedContainer)
  return (
 
  <section className="flex flex-col">
      <h1 className='mb-4 pl-6 text-4xl text-black tracking-wide uppercase'>MVS Files</h1>
      <div className='flex'>
        {!fullEdit && (
          <Card>
            <MVSFilesTree container={selectedContainer} onFileSelected={fileSelected} />
          </Card>
        )}
        <MVSFileView selected={selectedFile} onToggleFullEdit={onToggleFullEdit} />
      </div>
    </section>
  )
}

export default MVSFiles
