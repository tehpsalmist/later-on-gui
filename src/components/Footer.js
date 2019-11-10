import React from 'react'

export const Footer = props => {
  return <footer className='flex-center p-12 text-green-400'>
    &copy; tehpsalmist {new Date().getFullYear()}
  </footer>
}
