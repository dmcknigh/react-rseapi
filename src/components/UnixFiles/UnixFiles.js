import React, { useState, useEffect } from 'react'
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
      defaultFilter = '/' + defaultFilter.replaceAll('^', '/')

      const index = defaultFilter.lastIndexOf('/')
      defaultFilter = defaultFilter.substring(0, index)
    }
    return defaultFilter
  })

  const [fullEdit, setFullEdit] = useState(false)

  useEffect (() => {
    let defaultFilter = props.qpath; 
    if (defaultFilter){
      defaultFilter = '/' + defaultFilter.replaceAll('^', '/')
      const index = defaultFilter.lastIndexOf('/')
      const parent = defaultFilter.substring(0, index)
      const file = defaultFilter.substring(index)
      fileSelected(parent, file)
    }
  }, [props.qpath])

  const fileSelected = (path, name) => {
    let qualifiedFile = path;
    if (qualifiedFile.endsWith('/') || name.startsWith('/')){
      qualifiedFile += name
    }
    else {
      qualifiedFile += '/' + name
    }
 
    console.log('file selected:' + qualifiedFile)
    setSelectedFile(qualifiedFile)
  }

  const onToggleFullEdit = () => {
    setFullEdit(!fullEdit)
  }

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
