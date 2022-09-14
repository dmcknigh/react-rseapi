import React, { useState, useEffect, useContext, useRef } from 'react'
import Tree from 'rc-tree'
import 'rc-tree/assets/index.css'
import AuthContext from '../../store/auth-context'
import { fetchDataSets, fetchMembers } from '../../util/mvs-file-service'
import classes from './MVSFiles.module.css'

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
    if (atype === 'SEQ') {
      return 0
    } else {
      return -1
    }
  }
}

const MVSFilesTree = props => {
  const pathRef = useRef()
  const authCtx = useContext(AuthContext)

  let defaultExpandedKeys = []

  let defaultFilter = localStorage.getItem('lastMVSQuery')
  if (defaultFilter === null || defaultFilter.length === 0) {
    defaultFilter = authCtx.userId + '.*'
  }

  let autoExpand = false
  if (props.container !== null && props.container.length > 0) {
    defaultFilter = props.container // passed in via url
    defaultExpandedKeys.concat(defaultFilter)
    autoExpand = true
    console.log('auto expand')
  }

  const [autoExpandParent, setAutoExpandParent] = useState(autoExpand)
  const [path, setPath] = useState(defaultFilter)
  const [fetchedFiles, setFetchedFiles] = useState([])

  useEffect(() => {
    console.log('mvs tree=' + path)

    const callFetchFiles = async () => {
      const response = await fetchDataSets(path, authCtx)
      const data = await response.json()
      const transformedResults = data.items.map(fileData => {
        const dsnType = fileData.dsnType
        return {
          key: fileData.name,
          title: fileData.name,
          type: dsnType,
          children: dsnType === 'SEQ' ? null : [getPendingChild('children of ' + fileData.name)],
        }
      })
      setFetchedFiles(transformedResults.sort(sortFunction))

      localStorage.setItem('lastMVSQuery', path)
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

  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys)

    const len = expandedKeys.length
    const index = len - 1
    console.log('index=' + index)
    const key = expandedKeys[len - 1]
    console.log('key=' + key)

    const updatedFiles = [...fetchedFiles]

    const node = findNodeFromKey(key, updatedFiles)
    if (node === null) {
      return
    }

    const nodePath = node.title
    console.log('node path=' + nodePath)

    const callFetchFiles = async () => {
      const response = await fetchMembers(nodePath, authCtx)
      const data = await response.json()
      if (!data.items) {
        node.children = null
        setFetchedFiles(updatedFiles)
        return
      }
      const transformedResults = data.items.map(memberName => {
        console.log('member=' + memberName)
        return {
          key: nodePath + '(' + memberName + ')',
          title: memberName,
          type: 'MEMBER',
        }
      })

      node.children = transformedResults
      setFetchedFiles(updatedFiles)
    }
    callFetchFiles()
  }

  const allowDrop = ({ dropNode, dropPosition }) => {}

  const pathChangeHandler = event => {
    const curPath = pathRef.current.value
    if (curPath.endsWith('*')) {
      setPath(pathRef.current.value)
      console.log('path set to ' + path)
    }
  }

  const handlePathChanged = event => {
    event.preventDefault()
    let newPath = pathRef.current.value
    setPath(newPath)
    console.log('path set to ' + path)
  }

  const onSelect = (selectedKeys, e) => {
    const selNode = e.node
    if (selNode.type === 'SEQ' || selNode.type === 'MEMBER') {
      props.onFileSelected(selNode.key)
    }
  }

  return (
    <div>
      <div className={classes.control}>
        <label htmlFor='path'>Data Set Filter</label>
        <form onSubmit={handlePathChanged}>
          <input type='text' id='path' required ref={pathRef} defaultValue={path} onChange={pathChangeHandler} />
        </form>
      </div>
      <div className='draggable-demo'>
        <Tree
          allowDrop={allowDrop}
          onExpand={onExpand}
          onSelect={onSelect}
          defaultExpandedKeys={defaultExpandedKeys}
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

export default MVSFilesTree
