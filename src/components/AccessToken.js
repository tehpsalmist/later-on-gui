import React, { useState, useRef } from 'react'
import { useAuth0 } from '../auth'

export const AccessToken = ({ className }) => {
  const inputRef = useRef()
  const { authToken } = useAuth0()
  const [copied, setCopied] = useState(false)

  const copy = e => {
    if (authToken) {
      inputRef.current && inputRef.current.select()

      try {
        const success = document.execCommand('copy')

        if (success) {
          setCopied(true)
        }

        e.target.focus()
      } catch (e) {
        console.error('unable to copy', e)
      }
    }
  }

  return <div className={className}>
    <h3 className='text-xl text-center'>Access Token:</h3>
    {authToken
      ? <div className='flex justify-between items-center rounded p-2 border border-green-300'>
        <input ref={inputRef} className='w-full truncate mr-auto font-mono focus:outline-none' value={authToken} readOnly />
        <button className='rounded-full bg-gray-300 text-green-500 min-h-12 min-w-12 flex-center shadow-md ml-4 cursor-pointer hover:bg-gray-400 focus:outline-none' onClick={e => copy(e)}>Copy</button>
      </div>
      : 'Fetching Latest Token...'}
    {copied && <p className='text-center text-green-500'>Copied!</p>}
  </div>
}
