import React, { useState, useEffect } from 'react'
import classes from './UnixFiles.module.css'
import UnixFilesTree from './UnixFilesTree'
import UnixFileView from './UnixFileView'
import Card from '../Layout/Card'

const UnixFiles = props => {
  const [selectedFile, setSelectedFile] = useState('')
  const [selectedContainer, setSelectedContainer] = useState( () => {
    let defaultFilter = props.qpath
    if (defaultFilter) {
      console.log('props.qpath='+props.qpath)
      defaultFilter = props.qpath // passed in via url
      defaultFilter = defaultFilter.replaceAll('^', '/')

      const index = defaultFilter.lastIndexOf('/')
      defaultFilter = defaultFilter.substring(0, index)
    }
    return defaultFilter
  })

  const [fullEdit, setFullEdit] = useState(false)


  const fileSelected = (path, name) => {
    const qualifiedFile = path + name
    console.log('file selected:' + qualifiedFile)
    setSelectedFile(qualifiedFile)
  }

  const onToggleFullEdit = () => {
    setFullEdit(!fullEdit)
  }

  const layoutStyle = fullEdit ? {} : { display: 'grid', gridTemplateColumns: '1fr 2fr' }

  return (
    <section className="flex flex-col">
      <h1 className='mb-4 pl-6 text-4xl text-black tracking-wide uppercase'>UNIX Files</h1>
      <div className='flex'>
        {!fullEdit && (
          <Card>
            <UnixFilesTree container={selectedContainer} onFileSelected={fileSelected} />
          </Card>
        )}
        <UnixFileView selected={selectedFile} onToggleFullEdit={onToggleFullEdit} />
      </div>
    </section>
  )
}

export default UnixFiles
