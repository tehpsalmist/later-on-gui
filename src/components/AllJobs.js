import React from 'react'
import useSWR from 'swr'

export const AllJobs = props => {
  const { data, error } = useSWR('/jobs')

  if (error) return <p className='text-red-600'>{error}</p>

  if (!data) return console.log('loading') || <p className='text-green-500'>Loading...</p>

  const { jobs } = data

  if (!jobs.length) return <p className='text-green-500'>No jobs created yet.</p>

  return <div>
    <pre>{JSON.stringify(jobs, null, 2)}</pre>
  </div>
}
