import React, { useState, useEffect } from 'react'
import classes from './UnixFiles.module.css'
import UnixFilesTree from './UnixFilesTree'
import UnixFileView from './UnixFileView'
import Card from '../Layout/Card'

const UnixFiles = props => {
  const [selectedFile, setSelectedFile] = useState('')
  const [selectedContainer, setSelectedContainer] = useState('')
  const [fullEdit, setFullEdit] = useState(false)

  useEffect(() => {
    let qpath = '/' + props.qpath
    if (qpath) {
      qpath = qpath.replaceAll('^', '/')

      console.log('qpath=' + qpath)
      setSelectedFile(qpath)

      const index = qpath.lastIndexOf('/')
      const container = qpath.substring(0, index)
      console.log('container=' + container)
      setSelectedContainer(container)
    }
  }, [props.qpath])

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
