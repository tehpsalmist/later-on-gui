import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useLogError } from '../hooks'

export const FailureLogs = ({ className = '', style = {}, jobId }) => {
  const [page, setPage] = useState(1)

  const {
    data: {
      failures = [],
      totalFailures,
      failuresReturned,
      limit,
      page: currentPage,
      skipped
    } = {},
    error
  } = useSWR(`/failures/${jobId}?page=${page}`)

  const [logs, setLogs] = useState(failures)

  useEffect(() => {
    if (logs[logs.length - 1]?._id !== failures[failures.length - 1]?._id) {
      setLogs(l => [...l, ...failures])
    }
  }, [failures[failures.length - 1]?._id])

  useLogError(error)

  return <ul className='-mx-2 sm:-mx-4'>
    <h2 className='p-2 break-words'>Failures for Job ID: {jobId}</h2>
    <p className='p-2'>Total: {totalFailures}</p>
    {logs.map(log => <li key={log._id} className='striped p-2 text-xs sm:text-sm md:text-base'>
      <pre className='whitespace-pre-wrap'>{JSON.stringify(log, null, 2)}</pre>
    </li>)}
    {logs.length < totalFailures && <button className='btn bg-blue-400 text-white mx-auto' onClick={e => setPage(p => p + 1)}>Load More</button>}
  </ul>
}
