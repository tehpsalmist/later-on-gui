import React, { useState, useEffect } from 'react'
import { useAuth0 } from '../auth'

export const RefreshToken = ({ className }) => {
  const { refreshToken, getRefreshToken } = useAuth0()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    if (refreshToken) {
      const range = document.createRange()
      range.selectNodeContents(document.querySelector('#refresh-token'))
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
    <h3 className='text-xl text-center'>Refresh Token:</h3>
    {refreshToken
      ? <div className='flex justify-between items-center rounded p-2 border border-red-300'>
        <pre id='refresh-token' className='truncate mr-auto'>{refreshToken}</pre>
        <button className='rounded-full bg-gray-300 text-red-500 min-h-12 min-w-12 flex-center shadow-md ml-4 cursor-pointer hover:bg-gray-400 focus:outline-none' onClick={e => copy()}>Copy</button>
      </div>
      : <button
        className='p-2 rounded bg-blue-300 text-gray-600 shadow-md hover:bg-blue-400 hover:text-gray-700 focus:bg-blue-500 focus:text-white'
        onClick={e => {
          getRefreshToken()
        }}
      >
        Get Refresh Token
      </button>}
    {copied && <p className='text-center text-green-500'>Copied!</p>}
    {refreshToken && copied && <p className='text-justify text-red-500'>
      Please note that a refresh token is highly privileged and should only be stored AND USED on your protected server. DO NOT store or use your refresh tokens in client-facing, browser-based applications. This is a massive security risk and could easily lead to your account(s) or identity being compromised.
    </p>}
  </div>
}
