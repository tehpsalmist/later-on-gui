import React, { useState } from 'react'
import cronstrue from 'cronstrue'
import { extractCronStringOrErrorMessage } from '../utils'
import DateTimePicker from 'react-datetime-picker'

export const NewJob = props => {
  const [timeType, setTimeType] = useState('cron')
  const [cron, setCron] = useState('')
  const [date, setDate] = useState(new Date())
  const [cronExplained, setCronExplained] = useState({ valid: true, value: '' })
  return <div>
    <div className='flex items-center'>
      <div className='flex flex-col p-2 mr-8'>
        Frequency type:
        <label>
          <input type='radio' value='cron' name='time-type' checked={timeType === 'cron'} onChange={e => setTimeType(e.target.value)} />
          {' '}Cron Pattern
        </label>
        <label>
          <input type='radio' value='date' name='time-type' checked={timeType === 'date'} onChange={e => setTimeType(e.target.value)} />
          {' '}One-time Date
        </label>
      </div>
      <label >
        {timeType === 'cron'
          ? <>
            <input className='font-mono border border-green-400 rounded p-1' placeholder='00 07 * * Mon-Fri' value={cron} onChange={e => {
              setCron(e.target.value)

              setCronExplained(extractCronStringOrErrorMessage(e.target.value))
            }} />
            <p className={`${cronExplained.valid ? 'text-green-600': 'text-red-600'}`}>{cronExplained.value}</p>
          </>
          : <DateTimePicker
              value={date}
              onChange={date => setDate(date)}
              clearIcon={null}
              showLeadingZeros
              disableClock
              minDate={new Date()}
            />}
        </label>
    </div>
    <br />
    TimeZone dropdown
    <br />
    actionUrl text with url validation?
    <br />
    failureUrl text with url validation?
    <br />
    method dropdown
    <br />
    headers key/value table of inputs
    <br />
    payload Ace editor?
  </div>
}
