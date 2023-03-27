import React, { useState, useEffect, useContext, useRef } from 'react'
import Tree from 'rc-tree'
import 'rc-tree/assets/index.css'
import AuthContext from '../../store/auth-context'
import { fetchJobs, fetchJobSpools } from '../../util/jobs-service'
import classes from './Jobs.module.css'

import { FcServices, FcDocument, FcOk, FcHighPriority } from 'react-icons/fc'

const getPendingChild = keyValue => {
  return {
    key: keyValue,
    title: 'Pending...',
  }
}

const JobsTree = props => {
  const prefixRef = useRef()
  const ownerRef = useRef()

  const authCtx = useContext(AuthContext)

  let defaultOwnerFilter = localStorage.getItem('lastJobsQueryOwner')
  if (defaultOwnerFilter === null || defaultOwnerFilter.length === 0) {
    defaultOwnerFilter = authCtx.userId
  }
  const [enteredOwner, setEnteredOwner] = useState(defaultOwnerFilter)

  let defaultPrefixFilter = localStorage.getItem('lastJobsQueryPrefix')
  if (defaultPrefixFilter === null || defaultPrefixFilter.length === 0) {
    defaultPrefixFilter = '*'
  }
  const [enteredPrefix, setEnteredPrefix] = useState(defaultPrefixFilter)

  const [fetchedJobs, setFetchedJobs] = useState([])
  useEffect(() => {
    console.log('jobs owner' + enteredOwner)
    const callFetchJobs = async () => {
      const response = await fetchJobs(enteredPrefix, enteredOwner, authCtx)
      const data = await response.json()

      console.log('jobs data=' + data)
      if (!data.items) {
        alert('jobs query failed')
        return
      } else {
        console.log('jobs data items:' + data.items)
      }

      const transformedResults = data.items.map(jobData => {
        console.log('job id=' + jobData.jobId)
        console.log('job status='+jobData.status)
        const title = jobData.jobName + '/' + jobData.jobId
        let icon = <FcServices />
        if (jobData.status==='COMPLETED'){
          icon = <FcOk />
        }
        else if (jobData.status==='ABEND'){
          icon = <FcHighPriority />
        }

        return {
          key: title,
          icon: icon,
          type: 'JOB',
          title: title,
          status: jobData.status,
          children: [getPendingChild(title + '.children')],
        }
      })
      setFetchedJobs(transformedResults)
      console.log('jobs results=' + transformedResults)
      localStorage.setItem('lastJobsQueryPrefix', enteredPrefix)
      localStorage.setItem('lastJobsQueryOwner', enteredOwner)
    }

    callFetchJobs()
  }, [enteredPrefix, enteredOwner, authCtx])

  const onDragStart = info => {
    console.log('onDragStart', info)
  }

  const onDrop = info => {
    console.log('onDrop')
  }

  const findNodeFromKey = (key, jobs) => {
    console.log('finding ' + key)
    const nodeIndex = jobs.findIndex(p => p.key === key)
    const node = jobs[nodeIndex]

    console.log('key found:' + node)
    return node
  }

  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys)

    const len = expandedKeys.length
    console.log('len=' + len)
    const key = expandedKeys[len - 1]

    const [jobName, jobId] = key.split('/')
    const updatedJobs = [...fetchedJobs]

    const node = findNodeFromKey(key, updatedJobs)

    const callFetchFiles = async () => {
      const response = await fetchJobSpools(jobName, jobId, authCtx)
      const data = await response.json()
      const transformedResults = data.items.map(jobSpoolData => {
        console.log('spool dsName=' + jobSpoolData.dsName)
        console.log('spool id=' + jobSpoolData.id)
        return {
          key: jobName + '/' + jobId + '/' + jobSpoolData.id,
          icon: <FcDocument />,
          type: 'SPOOL',
          jobId: jobId,
          jobName: jobName,
          title: jobSpoolData.dsName,
          fileId: jobSpoolData.id,
        }
      })
      if (transformedResults !== null) {
        node.children = transformedResults
      }
      setFetchedJobs(updatedJobs)
    }
    callFetchFiles()
  }

  const allowDrop = ({ dropNode, dropPosition }) => {}

  const autoExpandParent = false

  const ownerChangeHandler = event => {
    console.log('owner changed')
    setEnteredOwner(event.target.value)
  }

  const prefixChangeHandler = event => {
    setEnteredPrefix(event.target.value)
  }

  const handleQuery = event => {
    event.preventDefault()
    console.log('query changed')
    //  setPrefix(enteredPrefix);

    const newOwner = ownerRef.current.value
    console.log('owner=' + newOwner)
    //  setOwner(enteredOwner);
  }

  const onSelect = (selectedKeys, e) => {
    const selNode = e.node
    if (selNode.type === 'SPOOL') {
      props.onJobFileSelected(selNode.key)
    }
  }

  return (
    <div>
      <div className={classes.control}>
        <form onSubmit={handleQuery}>
          <label htmlFor='prefix'>Prefix</label>
          <input type='text' id='prefix' required ref={prefixRef} defaultValue={enteredPrefix} onChange={prefixChangeHandler} />
          <label htmlFor='owner'>Owner</label>
          <input type='text' id='owner' required ref={ownerRef} defaultValue={enteredOwner} onChange={ownerChangeHandler} />
        </form>
      </div>
      <div className='draggable-demo'>
        <Tree
          icon={<FcServices />}
          allowDrop={allowDrop}
          onExpand={onExpand}
          onSelect={onSelect}
          autoExpandParent={autoExpandParent}
          draggable
          onDragStart={onDragStart}
          onDrop={onDrop}
          height={750}
          treeData={fetchedJobs}
        />
      </div>
    </div>
  )
}

export default JobsTree
