import React, { useState } from 'react'
import { cronDescriptionOrFormattedDate } from '../utils'
import { trigger } from 'swr'
import { baseURL } from './SWRWrapper'
import { useAuth0 } from '../auth'
import { Modal, FailureLogs } from '.'

export const JobListing = ({ className = '', style = {}, job, setEditing }) => {
  const { authToken } = useAuth0()
  const [deleting, setDeleting] = useState(false)

  const deleteJob = async id => {
    setDeleting(true)

    const resp = await fetch(`${baseURL}/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    })

    trigger('/jobs')
  }

  const timeValues = cronDescriptionOrFormattedDate(job.time)

  const [open, setOpen] = useState(false)

  return <div className='flex justify-between mb-4'>
    <div>
      <h2>{job.actionUrl}</h2>
      <p>{timeValues.formatted}</p>
      {(job.failed || job.failureLogging) && <p className='text-red-600'>
        {job.failed && 'Job Failed. '}
        <button className='text-red-400' onClick={e => setOpen(true)}>
          View Failure Log Entries
        </button>
      </p>}
      <p>Failure Logging: {job.failureLogging ? 'Enabled' : 'Disabled'}</p>
    </div>
    <div className='flex items-center space-x-2'>
      <button
        type='button'
        className='btn bg-blue-400 text-white'
        onClick={e => {
          setEditing(true)
        }}
      >
        Edit
      </button>
      <button
        type='button'
        className='btn bg-red-600 text-white'
        onClick={async e => {
          if (confirm('Are you sure you want to delete this job? It can\'t be undone!')) {
            const deletion = await deleteJob(job._id)
              .catch(err => err instanceof Error ? err : new Error(JSON.stringify(err)))
            
            if (deletion instanceof Error) {
              setDeleting(false)
              console.error('unable to delete job', deletion)
            }
          }
        }}
      >
        {deleting[job._id] ? 'Deleting...' : 'Delete'}
      </button>
    </div>
    {open && <Modal show onHide={() => setOpen(false)}>
      <FailureLogs jobId={job._id} />
    </Modal>}
  </div>
}
