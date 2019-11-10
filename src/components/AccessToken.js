import React, { useState } from 'react'
import { useAuth0 } from '../auth'

export const AccessToken = ({ className }) => {
  const { authToken } = useAuth0()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    if (authToken) {
      const range = document.createRange()
      range.selectNodeContents(document.querySelector('#access-token'))
      window.getSelection().addRange(range)

      try {
        const success = document.execCommand('copy')

        if (success) {
          setCopied(true)
        }

        window.getSelection().removeAllRanges()
      } catch (e) {
        console.error('unable to copy', e)
      }
    }
  }

  return <div className={className}>
    <h3 className='text-xl text-center'>Access Token:</h3>
    {authToken
      ? <div className='flex justify-between items-center rounded p-2 border border-green-300'>
        <pre id='access-token' className='truncate mr-auto'>{authToken}</pre>
        <button className='rounded-full bg-gray-300 text-green-500 min-h-12 min-w-12 flex-center shadow-md ml-4 cursor-pointer hover:bg-gray-400 focus:outline-none' onClick={e => copy()}>Copy</button>
      </div>
      : 'Fetching Latest Token...'}
    {copied && <p className='text-center text-green-500'>Copied!</p>}
  </div>
}
