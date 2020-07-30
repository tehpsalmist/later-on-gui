import React, { useState, Fragment, useMemo } from 'react'
import swr, { trigger, mutate } from 'swr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import cronstrue from 'cronstrue'
import DateTimePicker from 'react-datetime-picker'
import { tz } from 'moment-timezone'
import { Formik, FieldArray, Field } from 'formik'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-github'
import { useAuth0 } from '../auth'
import { extractCronStringOrErrorMessage, isValidUrl, isCronSyntax } from '../utils'
import { toast } from 'react-toastify'

const tzGuess = tz.guess()
const methods = ['GET', 'POST', 'PUT', 'DELETE']

export const EditJob = ({ job = {}, onClose }) => {
  const isCron = useMemo(() => isCronSyntax(job.time), [job.time])

  const { authToken } = useAuth0()

  const [date, setDate] = useState((!isCron && job.time && new Date(job.time)) || new Date())
  const [dateError, setDateError] = useState('')
  const [cronExplained, setCronExplained] = useState({ valid: true, value: '' })
  const [payload, setPayload] = useState(job.payload ? JSON.stringify(job.payload, null, 2) : '')
  const [payloadErrors, setPayloadErrors] = useState([])

  return <Formik
    initialValues={{
      timeType: !job.time || isCron ? 'cron' : 'date',
      cron: (isCron && job.time) || '',
      timeZone: job.timeZone || tzGuess || 'UTC',
      actionUrl: job.actionUrl || '',
      failureUrl: job.failureUrl || '',
      failureLogging: job.failureLogging || false,
      method: job.method || 'GET',
      headers: job._id
        ? Array.isArray(job.headers)
          ? job.headers
          : job.headers instanceof Headers
            ? job.headers.entries().map(([key, value]) => ({ key, value }))
            : job.headers != null
              ? Object.keys(job.headers).map(key => ({ key, value: job.headers[key] }))
              : []
        : [
          {
            key: 'Content-Type',
            value: 'application/json'
          }
        ]
    }}
    onSubmit={async ({
      timeType,
      cron,
      timeZone,
      actionUrl,
      failureUrl,
      failureLogging,
      method,
      headers
    }, {
      resetForm,
      setSubmitting
    }) => {
      setSubmitting(true)

      const result = await fetch(`${process.env.BASE_URL}/jobs/${job._id || ''}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        method: job._id ? 'PUT' : 'POST',
        body: JSON.stringify({
          time: timeType === 'cron' ? cron : date,
          timeZone,
          actionUrl,
          failureUrl: failureUrl || undefined,
          failureLogging,
          method,
          headers: headers.filter(h => h.key && h.value).reduce((map, { key, value }) => ({ ...map, [key]: value }), {}),
          payload: method === 'POST' || method === 'PUT' ? JSON.parse(payload) : undefined
        })
      })
        .catch(err => err instanceof Error ? err : new Error(JSON.stringify(err)))

      setSubmitting(false)

      if (result instanceof Error || !result.ok) {
        return toast('Failed to save', { progressClassName: 'bg-red-400' })
      }

      toast('Job Saved!', { progressClassName: 'bg-green-400' })
      trigger('/jobs')

      if (!job._id) resetForm()
    }}
    validate={values => {
      const errors = {}

      values.headers.forEach((header, index) => {
        if ((header.key && !header.value) || (!header.key && header.value)) {
          if (!errors.headers) {
            errors.headers = {}
          }

          errors.headers[index] = {
            value: !header.value || 'must have a value with each header key',
            key: !header.key || 'missing header key'
          }
        }
      })

      if ((values.method === 'POST' || values.method === 'PUT')) {
        if (payloadErrors.length) {
          errors.payload = 'Invalid JSON'
        }

        if (!payload) {
          errors.payload = 'payload is required'
        }
      }

      if (values.actionUrl && !isValidUrl(values.actionUrl)) {
        errors.actionUrl = 'Invalid URL'
      }

      if (values.failureUrl && !isValidUrl(values.failureUrl)) {
        errors.failureUrl = 'Invalid URL'
      }

      if (values.timeType === 'date' && dateError) {
        errors.date = dateError
      }

      if (values.timeType === 'cron' && !cronExplained.valid) {
        errors.cron = cronExplained.value
      }

      return errors
    }}
  >
    {({ errors, handleSubmit, handleChange, values, validateForm, isValid, isSubmitting }) => {
      return <form onSubmit={handleSubmit}>
        {typeof onClose === 'function' && <button
          type='button'
          className='btn text-red-600 focus:shadow-outline absolute top-0 right-0 mr-4 mt-4'
          onClick={e => onClose()}>
          Cancel
        </button>}
        <div className='mb-2'>
          Frequency
          <div className='flex items-center'>
            <div className='flex flex-col p-2 mr-8'>
              <label>
                <Field type='radio' value='cron' name='timeType' onChange={handleChange} />
                {' '}Cron Pattern
              </label>
              <label>
                <Field type='radio' value='date' name='timeType' onChange={handleChange} />
                {' '}One-time Date
              </label>
            </div>
            <label >
              {values.timeType === 'cron'
                ? <>
                  <Field
                    className='input'
                    onChange={handleChange}
                    placeholder='00 07 * * Mon-Fri'
                    name='cron'
                    required={values.timeType === 'cron'}
                    validate={value => {
                      const validation = extractCronStringOrErrorMessage(value)

                      if (!value) {
                        validation.value = ''
                      }

                      setCronExplained(validation)

                      if (!validation.valid) return validation.value
                    }}
                  />
                  <p className={`${cronExplained.valid ? 'text-green-600': 'text-red-600'}`}>{cronExplained.value}</p>
                </>
                : <>
                  <DateTimePicker
                    value={date}
                    onChange={date => {
                      const isValid = date > new Date()

                      setDateError(isValid ? '' : 'Time must be in the future.')
                      setDate(date)
                    }}
                    clearIcon={null}
                    showLeadingZeros
                    disableClock
                    minDate={new Date()}
                    format='yyyy/MM/dd HH:mm:ss a'
                  />
                  <p className={`${!dateError ? 'text-green-600': 'text-red-600'}`}>{dateError}</p>
                </>}
            </label>
          </div>
        </div>
        <div>
          <label>
            <span className='w-32 inline-block'>TimeZone</span>
            <Field as='select' className='input bg-white h-8' onChange={handleChange} name='timeZone'>
              {tz.names().map(name => <option key={name} value={name}>{name}</option>)}
            </Field>
          </label>
        </div>
        <hr className='my-4' />
        <div className='mb-2'>
          <label>
            <span className='w-32 inline-block'>Action URL</span>
            <Field className='input' onChange={handleChange} style={{ width: 400 }} required type='text' name='actionUrl' placeholder='https://my-service.io/webhook' />
            <p className='text-red-500'>{errors.actionUrl}</p>
          </label>
        </div>
        <div className='mb-2'>
          <label>
            <span className='w-32 inline-block'>Method</span>
            <Field as='select' className='input bg-white h-8' name='method' onChange={handleChange}>
              {methods.map(method => <option key={method} value={method}>{method}</option>)}
            </Field>
          </label>
        </div>
        {(values.method === 'POST' || values.method === 'PUT') && <div className='mb-2'>
          Payload
          <AceEditor
            placeholder={`{ "my": "data" }`}
            theme='github'
            mode='json'
            height='200px'
            width='100%'
            onChange={value => setPayload(value)}
            onValidate={v => {
              setPayloadErrors(v)
              validateForm()
            }}
            fontSize={14}
            value={payload}
            setOptions={{
              tabSize: 2
            }}/>
          <p className='text-red-500'>{errors.payload}</p>
        </div>}
        <FieldArray name="headers">
          {({ move, swap, push, insert, unshift, pop, form, remove }) => <div>
            Headers
            <div className='headers-grid'>
              {values.headers.map((header, index) => <Fragment key={index}>
                <label>
                  <span className='sr-only'>Header {index} Key</span>
                  <Field name={`headers.${index}.key`} className='input w-full' />
                </label>
                <label className='flex'>
                  <span className='sr-only'>Header {index} Name</span>
                  <Field name={`headers.${index}.value`} className='input flex-grow' />
                  <button type='button' className='rounded flex-center p-1 border border-red-400 text-red-500 hover:bg-red-400 hover:text-white hover:shadow' onClick={e => remove(index)}>Remove Header</button>
                </label>
                {errors && errors.headers && errors.headers[index] && (errors.headers[index].key || errors.headers[index].value) && <>
                  <p className='text-red-500'>{errors.headers[index].key}</p>
                  <p className='text-red-500'>{errors.headers[index].value}</p>
                </>}
              </Fragment>)}
              <div className='w-auto'>
                <button type='button' onClick={e => insert(values.headers.length, { key: '', value: '' })} className='btn bg-blue-400 text-white'>
                  Add Header
                </button>
              </div>
            </div>
          </div>}
        </FieldArray>
        <hr className='my-4' />
        <div className='mb-2 flex flex-col'>
          <label>
            <span className='w-32 inline-block'>Failure URL</span>
            <Field className='input' style={{ width: 400 }} type='text' name='failureUrl' placeholder='optional (POST endpoint)' />
            <p className='text-red-500'>{errors.failureUrl}</p>
            <p className='italic font-light text-sm'>Receive a payload detailing the failure of any job execution that does not succeed.</p>
          </label>
          <label className='mt-2'>
            <span className='w-32 inline-block'>Failure Logging</span>
            <Field type='checkbox' name='failureLogging' />
            <p className='italic font-light text-sm'>Stores logs for any job execution that does not succeed. Turning this off means no logs will be stored (and thus cannot be retroactively enabled). All logs are cleared within one week.</p>
          </label>
        </div>
        <button type='submit' disabled={!isValid || isSubmitting} className={`btn bg-green-500 text-white ${isValid ? '' : 'cursor-not-allowed'}`}>
          {onClose ? 'Save Job' : 'Create Job'}
          {isSubmitting && <FontAwesomeIcon icon={faSync} spin className='ml-2' />}
        </button>
      </form>
    }}
  </Formik>
}
