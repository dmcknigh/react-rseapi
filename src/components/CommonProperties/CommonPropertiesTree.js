import React, { useState, useEffect, useContext, useRef } from 'react'
import Tree, { TreeNode } from 'rc-tree'
import 'rc-tree/assets/index.css'
import AuthContext from '../../store/auth-context'
import { fetchContent, fetchNamespaces } from '../../util/common-properties-service'
import classes from './CommonProperties.module.css'

import { FcViewDetails, FcGenealogy } from 'react-icons/fc'


const getPendingChild = keyValue => {
  return {
    key: keyValue,
    title: 'Pending...',
  }
}

const CommonPropertiesTree = () => {
  const pathRef = useRef()
  console.log('common properties tree')

  const authCtx = useContext(AuthContext)
  const [fetchedProperties, setFetchedProperties] = useState([])

  useEffect(() => {
    const callFetchNamespaces = async () => {
      try {
        const response = await fetchNamespaces(authCtx)
        if (!response.ok) {
          console.log('failed query!')
          throw new Error('Something went wrong!')
        }
        const data = await response.json()
        console.log('common properties response data:' + data)
        const transformedResults = data.map(namespace => {
          let keyValue = '/' + namespace
          console.log('ns key=' + keyValue)
          return {
            key: keyValue,
            parent: '',
            title: namespace,
            namespace: namespace,
            type: 'NAMESPACE',
            children: [getPendingChild(keyValue + '.children')],
          }
        })
        setFetchedProperties(transformedResults)
      } catch (error) {
        console.log('error: ' + error)
      }
    }

    callFetchNamespaces()
  }, [authCtx])

  const onDragStart = info => {
    console.log('onDragStart', info)
  }

  const onDrop = info => {
    console.log('onDrop')
  }

  const findNodeFromKey = (key, properties) => {
    console.log('finding ' + key)
    const nodeIndex = properties.findIndex(p => p.key === key)
    console.log('found nodeIndex=' + nodeIndex)
    if (nodeIndex < 0) {
      // didn't find it
      console.log('not found in ' + JSON.stringify(properties))

      return null
    }
    const node = properties[nodeIndex]

    console.log('key found:' + node)
    return node
  }

  const findNode = (keySegs, properties) => {
    console.log('finding keysegs=' + keySegs)
    const len = keySegs.length
    let foundNode = null
    let baseKey = '/'
    let children = properties
    for (let i = 0; i + 1 < len; i++) {
      var rootKey = baseKey + keySegs[i + 1]
      console.log('root key =' + rootKey)
      if (rootKey.includes('_')) {
        // if array index, need to get intermediate node first
        // hack looking for array index
        const indexOfIndex = rootKey.indexOf('_')
        var intermediateKey = rootKey.substring(0, indexOfIndex)
        // get array node first
        foundNode = findNodeFromKey(intermediateKey, children)
        if (foundNode !== null) {
          baseKey = foundNode.key + '/'
          children = foundNode.children
          console.log('now search in ' + JSON.stringify(children))
        }
      }

      foundNode = findNodeFromKey(rootKey, children)

      console.log('found=' + foundNode)
      if (foundNode !== null) {
        baseKey = foundNode.key + '/'
        children = foundNode.children
        console.log('now search in ' + JSON.stringify(children))
      } else {
        baseKey = rootKey + '/'
      }
    }

    console.log('found:' + foundNode)
    return foundNode
  }

  const normalizeKeyPath = keyPath => {
    return keyPath.replaceAll('//', '/')
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
    console.log('key=' + key)

    const keySegs = key.split('/')
    console.log('keySegs=' + keySegs)

    // clone fetchedProperties
    const updatedProperties = [...fetchedProperties]

    const node = findNode(keySegs, updatedProperties)
    if (node === null) {
      console.log('node not found!')
      return
    } else {
      console.log('node=' + node)
    }
    const namespace = node.namespace
    console.log('segs leng = ' + keySegs.length)
    const isNS = keySegs.length == 2
    const isArrayIndex = node.isArrayIndex

    /*
    var jsonPath = isNS ? "/" : node.title;
    if (isArrayIndex) {
      jsonPath += "_" + node.title + "/";
    }
    */
    let jsonPath = node.key
    if (node.type === 'NAMESPACE') {
      jsonPath = '/'
    } else if (node.parent === '/') {
      jsonPath = node.title
    } else if (isArrayIndex) {
      jsonPath = '/' + node.parent + '_' + node.title
    }

    console.log('node=' + JSON.stringify(node))
    jsonPath = normalizeKeyPath(jsonPath)
    console.log('json path=' + jsonPath)

    const callFetchProperties = async () => {
      const response = await fetchContent(namespace, jsonPath, authCtx)
      const data = await response.json()

      const jkeys = Object.keys(data)

      const transformedResults = jkeys.map(key => {
        var isArrayIndex = false
        const name = key
        if (!isNaN(key)) {
          // trying to detect if this is an arry index
          key = jsonPath.substring(0, jsonPath.length) + '_' + key
          isArrayIndex = true
        }
        if (key.startsWith('/')) {
          key = key.substring(1)
        }
        console.log('key=' + key)
        var pathValue = '/' + namespace
        if (isArrayIndex) {
          pathValue += '/' + key
        } else {
          pathValue += '/' + jsonPath
          if (jsonPath[jsonPath.length - 1] !== '/') {
            pathValue += '/'
          }
          pathValue += key
        }
        pathValue = normalizeKeyPath(pathValue)

        const keyDataValue = data[key]
        const parent = jsonPath

        var isPrimative = !isArrayIndex
        if (keyDataValue === Object(keyDataValue)) {
          isPrimative = false
        }
        console.log('pathValueKey=' + pathValue)
        return {
          key: pathValue,
          icon: <FcViewDetails />,
          parent: parent,
          namespace: namespace,
          isArrayIndex: isArrayIndex,
          title: isPrimative ? key + '=' + keyDataValue : name,
          type: 'PROPERTY',
          children: isPrimative ? null : [getPendingChild(pathValue + '.children')],
        }
      })

      node.children = transformedResults
      console.log('new children for ' + node.title + '=' + JSON.stringify(transformedResults))
      setFetchedProperties(updatedProperties)
    }
    callFetchProperties()
  }

  const allowDrop = ({ dropNode, dropPosition }) => {}

  const autoExpandParent = false

  return (
    <Tree
      icon={<FcGenealogy />}
      allowDrop={allowDrop}
      onExpand={onExpand}
      draggable
      onDragStart={onDragStart}
      onDrop={onDrop}
      height={750}
      treeData={fetchedProperties}
    />
  )
}

export default CommonPropertiesTree
