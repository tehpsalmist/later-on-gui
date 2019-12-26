import React from 'react'
import { useAuth0 } from '../auth'
import { SWRConfig } from 'swr'

const baseURL = process.env.BASE_URL

console.log(baseURL)

export const SWRWrapper = ({ children }) => {
  const { authToken, loading } = useAuth0()

  return <SWRConfig
    value={{
      refreshInterval: 0,
      fetcher: (url = '/jobs', init = {}) => fetch(`${baseURL}${url}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
          ...typeof init.headers === 'object' && init.headers
        }
      })
        .then(res => {
          try {
            return res.json()
          } catch (e) {
            console.error(e)

            return res.text()
          }
        })
    }}
  >
    {children}
  </SWRConfig>
}
