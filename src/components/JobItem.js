import React, { useState } from 'react'
import { EditJob, JobListing } from '.'

export const JobItem = ({ className = '', style = {}, job }) => {
  const [editing, setEditing] = useState(false)

  return <li className='p-2 striped relative'>
    <h3 className='text-lg text-green-500'>{job.actionUrl}</h3>
    {editing
      ? <EditJob job={job} onClose={() => setEditing(false)} />
      : <JobListing job={job} setEditing={() => setEditing(true)} />}
  </li>
}
