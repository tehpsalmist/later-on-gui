import React, { useState } from 'react'
import useSWR, { mutate, trigger } from 'swr'
import { cronDescriptionOrFormattedDate } from '../utils'
import { useAuth0 } from '../auth'
import { baseURL } from './SWRWrapper'
import { useFreshClosure } from '../hooks'

export const AllJobs = props => {
  const { authToken } = useAuth0()
  const { data, error } = useSWR('/jobs')
  const [deleting, setDeleting] = useState({})

  const onDelete = useFreshClosure((id, ok) => {
    setDeleting({ ...deleting, [id]: undefined })

    if (ok && data && Array.isArray(data.jobs)) {
      mutate(`/jobs`, { ...data, jobs: data.jobs.filter(j => j._id !== id) })
    }
  })

  const deleteJob = async id => {
    setDeleting({})

    const resp = await fetch(`${baseURL}/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    })

    onDelete(id, resp.ok)
  }

  if (error) return <p className='text-red-600'>{error.message}</p>

  if (!data) return <p className='text-green-500'>Loading...</p>

  const { jobs } = data

  if (!jobs.length) return <p className='text-green-500'>No jobs created yet.</p>

  return <ul>
    {
      jobs.map(job => {
        const timeValues = cronDescriptionOrFormattedDate(job.time)
      
        return <li className='flex justify-between mb-4' key={job._id}>
          <div>
            <h2>{job.actionUrl}</h2>
            <p>{timeValues.formatted}</p>
          </div>
          <div>
            <button
              className='btn bg-red-600 text-white'
              onClick={async e => {
                await deleteJob(job._id)
              }}
            >
              {deleting[job._id] ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      })
    }
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
