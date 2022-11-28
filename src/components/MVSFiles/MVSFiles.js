import React, { useState, useEffect } from 'react'
import classes from './MVSFiles.module.css'
import MVSFilesTree from './MVSFilesTree'
import MVSFileView from './MVSFileView'
import Card from '../Layout/Card'

const MVSFiles = props => {
  const [selectedFile, setSelectedFile] = useState('')
  const [selectedContainer, setSelectedContainer] = useState('')
  const [fullEdit, setFullEdit] = useState(false)

  useEffect(() => {
    let qpath = props.qpath
    if (qpath) {
      qpath = qpath.replaceAll('_', '/').toUpperCase()

      console.log('qpath=' + qpath)
      setSelectedFile(qpath)

      if (qpath.includes('(')) {
        const index = qpath.indexOf('(')
        const container = qpath.substring(0, index)
        console.log('container=' + container)
        setSelectedContainer(container)
      }
    }
  }, [props.qpath])

  const fileSelected = path => {
    console.log('file selected:' + path)
    setSelectedFile(path)
  }

  const onToggleFullEdit = () => {
    setFullEdit(!fullEdit)
  }

  const layoutStyle = fullEdit ? {} : { display: 'grid', gridTemplateColumns: '1fr 2fr' }

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
