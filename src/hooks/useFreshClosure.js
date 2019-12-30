import { useRef } from 'react'

export const useFreshClosure = callback => {
  const updaterRef = useRef()

  updaterRef.current = callback

  return (...args) => updaterRef.current(...args)
}