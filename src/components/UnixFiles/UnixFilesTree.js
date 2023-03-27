import React, { useState, useEffect, useContext, useRef } from 'react'
import Tree from 'rc-tree'
import 'rc-tree/assets/index.css'
import AuthContext from '../../store/auth-context'
import { fetchFiles, fetchArchiveFiles } from '../../util/file-service'
import classes from './UnixFiles.module.css'

const getPendingChild = keyValue => {
  return {
    key: keyValue,
    title: 'Pending...',
  }
}

const sortFunction = (a, b) => {
  const atype = a.type
  const btype = b.type

  if (atype === btype) {
    if (a.title < b.title) {
      return -1
    }
    if (a.title > b.title) {
      return 1
    }
    return 0
  } else {
    if (atype === 'DIRECTORY') {
      return -1
    } else {
      return 0
    }
  }
}

const UnixFilesTree = props => {
  const pathRef = useRef()
  console.log('unix files tree')

  let defaultPath = localStorage.getItem('lastUNIXQuery')
  if (defaultPath === null || defaultPath.length === 0) {
    defaultPath = '/'
  }
  if (props.container) {
    defaultPath = props.container
  }

  console.log('default path=' + defaultPath)
  const [path, setPath] = useState(defaultPath)
  const authCtx = useContext(AuthContext)
  const [fetchedFiles, setFetchedFiles] = useState([])

  useEffect(() => {
    console.log('unix path=' + path)

    const callFetchFiles = async () => {
      try {
        const response = await fetchFiles(path, authCtx)
        if (!response.ok) {
          console.log('failed query!')
          throw new Error('Something went wrong!')
        }
        const data = await response.json()
        console.log('unix query response data:' + data)
        const transformedResults = data.children.map(fileData => {
          console.log('file.name='+fileData.name)
          console.log('file.type='+fileData.type)
          let keyValue = path + fileData.name
          return {
            parent: path,
            key: keyValue,
            title: fileData.name,
            type: fileData.type,
            size: fileData.size,
            archive: null,
            children: (fileData.type === 'DIRECTORY') ? [getPendingChild(fileData.link)] : null,
            lastModified: fileData.lastModified,
          }
        })
        setFetchedFiles(transformedResults.sort(sortFunction))

        localStorage.setItem('lastUNIXQuery', path)
      } catch (error) {
        console.log('error: ' + error)
      }
    }

    callFetchFiles()
  }, [path, props.container, authCtx])

  const onDragStart = info => {
    console.log('onDragStart', info)
  }

  const onDrop = info => {
    console.log('onDrop')
  }

  const findNodeFromKey = (key, files) => {
    console.log('finding ' + key)
    const nodeIndex = files.findIndex(p => p.key === key)
    const node = files[nodeIndex]

    console.log('key found:' + node)
    return node
  }

  const findNode = (keySegs, files) => {
    console.log('keysegs=' + keySegs)
    const len = keySegs.length
    let foundNode = null
    let baseKey = '/'
    let children = files
    for (let i = 0; i + 1 < len; i++) {
      const rootKey = baseKey + keySegs[i + 1]
      console.log('root key =' + rootKey)
      foundNode = findNodeFromKey(rootKey, children)
      if (foundNode) {
        baseKey = foundNode.key + '/'
        children = foundNode.children
      } else {
        baseKey = rootKey + '/'
      }
    }

    console.log('found:' + foundNode)
    return foundNode
  }

  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys)

    const len = expandedKeys.length
    console.log('len=' + len)
    if (len === 0) {
      // not sure what happened here!
      return
    }
    const key = expandedKeys[len - 1]

    const keySegs = key.split('/')
    console.log('keySegs=' + keySegs)

    // clone fetched files
    const updatedFiles = [...fetchedFiles]

    const node = findNode(keySegs, updatedFiles)
    if (node === null) {
      console.log('node not found!')
      return
    }
    const nodePath = node.parent + node.title + '/'
    console.log('node path=' + nodePath)

    const callFetchFiles = async () => {
      let response = null;

      let relPath = '/'
      console.log('nodePath='+nodePath)

      response = await fetchFiles(nodePath, authCtx)

      const data = await response.json()
      /*
      if (!data.children) {
        node.children = null
        node.type = 'DIRECTORY'
        setFetchedFiles(updatedFiles)
        return
      }
*/

      const transformedResults = data.children.map(fileData => {
        let fileKey = nodePath + fileData.name;
        let parentPath = nodePath;


        return {
          parent: parentPath,
          key: fileKey,
          title: fileData.name,
          type: fileData.type,
          size: fileData.size,
          children: (fileData.type === 'DIRECTORY') ? [getPendingChild(fileData.link)] : null,
          lastModified: fileData.lastModified,
        }
      })

      node.children = transformedResults.sort(sortFunction)
      setFetchedFiles(updatedFiles)
    }
    callFetchFiles()
  }

  const allowDrop = ({ dropNode, dropPosition }) => {}

  const autoExpandParent = false

  const onPathChanged = event => {
    let newPath = pathRef.current.value
    if (newPath.endsWith('/')) {
      setPath(newPath)
    }
  }

  const handlePathChanged = event => {
    event.preventDefault()
    let newPath = pathRef.current.value
    if (!newPath.endsWith('/')) {
      newPath = newPath + '/'
    }
    setPath(newPath)
    console.log('path set to ' + path)
  }

  const onSelect = (selectedKeys, e) => {
    const selNode = e.node
    if (selNode.type === 'FILE') {
      props.onFileSelected(selNode.parent, selNode.title)
    }
  }

  return (
    <div stype={{ display: 'flex' }}>
      <div className={classes.control}>
        <label htmlFor='path'>Base Path</label>
        <form onSubmit={handlePathChanged}>
          <input type='path' id='path' required ref={pathRef} defaultValue={path} onChange={onPathChanged} />
        </form>
      </div>
      <div style={{ flex: '1 1 50%' }}>
        <Tree
          allowDrop={allowDrop}
          onExpand={onExpand}
          onSelect={onSelect}
          autoExpandParent={autoExpandParent}
          draggable
          onDragStart={onDragStart}
          onDrop={onDrop}
          height={750}
          treeData={fetchedFiles}
        />
      </div>
    </div>
  )
}

export default UnixFilesTree
