import React, { useState, useEffect } from 'react'
import useSWR, { mutate, trigger } from 'swr'
import { cronDescriptionOrFormattedDate } from '../utils'
import { useAuth0 } from '../auth'
import { baseURL } from './SWRWrapper'
import { useFreshClosure } from '../hooks'
import { JobItem } from './JobItem'

export const AllJobs = ({ setJobs }) => {
  const { authToken } = useAuth0()
  const { data, error } = useSWR('/jobs')

  const { jobs, totalJobs = 0 } = (data || {})

  useEffect(() => {
    if (data) {
      setJobs(totalJobs)
    }
  }, [totalJobs])

  if (error) return <p className='text-red-600'>{error.message}</p>

  if (!data) return <p className='text-green-500'>Loading...</p>

  if (!jobs.length) return <p className='text-green-500'>No jobs created yet.</p>

  return <ul>
    {jobs.map(job => <JobItem job={job} key={job._id} />)}
  </ul>
}

// {
//   "_id": "5e0447606ac92a63cd527437",
//   "actionUrl": "https://57108d10.ngrok.io",
//   "failureUrl": "https://57108d10.ngrok.io/fail",
//   "method": "POST",
//   "payload": {
//     "princess": "peach"
//   },
//   "headers": {
//     "Content-Type": "application/json",
//     "special": "wut wut"
//   },
//   "time": "2020-05-11T13:43:05.000",
//   "timeZone": "America/New_York",
//   "nextTick": 1589218985000,
//   "userId": "google-oauth2|115429329466308578194"
// }
