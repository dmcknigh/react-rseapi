// Built-in Dependencies
import React, { useState, useRef, useEffect, useContext } from 'react'

// Internal Dependencies
import Card from '../Layout/Card'

// Redux
import AuthContext from '../../store/auth-context'

// Utilities
import { fetchContent, putContent } from '../../util/common-properties-service'

// Constants
const NAMESPACE = 'messages'
const JPATH = '/messages'

const TeamView = () => {
  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 50,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      width: 800,
    },

    {
      title: 'Time',
      dataIndex: 'time(ms)',
      key: 'time(ms)',
      width: 100,
    },
  ]

  // Component State
  const [messages, setMessages] = useState([])

  // Context
  const authCtx = useContext(AuthContext)

  // Refs
  const lastMsg = useRef(null)
  const userMessageRef = useRef()

  useEffect(() => {
    const callFetchMessages = async () => {
      const response = await fetchContent(NAMESPACE, JPATH, authCtx)
      const data = await response.json()
      setMessages(data)
    }

    callFetchMessages()
  }, [authCtx])

  // Scroll to the bottom of the message list
  useEffect(() => {
    lastMsg.current?.scrollIntoView({ behavior: 'smooth' })
  })

  const onSendMessage = event => {
    const msg = userMessageRef.current.value
    const t = new Date().getTime()

    const msgJSON = { 'user': authCtx.userId, 'message': msg, 'time(ms)': t }
    const newMessages = [...messages, msgJSON]
    setMessages(newMessages)

    const msgContainer = { messages: newMessages }

    // call send API
    putContent(NAMESPACE, '/', msgContainer, authCtx)

    userMessageRef.current.value = ''
  }

  return (
    <Card>
      <div className='flex flex-col h-96 overflow-y-auto scroll-smooth'>
        <table className='table-auto w-full text-sm text-left text-gray-500'>
          <thead className='bg-blue-500 text-white text-left text-xs uppercase sticky top-0'>
            <tr>
              {columns.map((column, id) => {
                return (
                  <th key={id} scope='col' className='py-3 px-6'>
                    {column.title}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {messages?.map((message, id) => {
              const date = new Date(message['time(ms)'])
              return (
                <tr key={id} scope='row' className='bg-white border-b hover:bg-blue-500 hover:text-white'>
                  <td scope='col' className='py-4 px-6'>
                    {message.user}
                  </td>
                  <td scope='col' className='py-4 px-6'>
                    {message.message}
                  </td>
                  <td scope='col' className='py-4 px-6'>
                    {date?.toLocaleString('en-US')}
                  </td>
                </tr>
              )
            })}
            <tr>
              <td ref={lastMsg}></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='flex justify-between items-center mt-4'>
        <input
          id='text'
          className='w-full py-2 pl-4 border-white rounded-md bg-black text-white'
          autoComplete='off'
          ref={userMessageRef}
          required
          type='text'
        />
        <button className='ml-8 py-2 px-4 border-white rounded-md bg-blue-500 text-sm text-white' onClick={onSendMessage}>
          Send Message
        </button>
      </div>
    </Card>
  )
}

export default TeamView
