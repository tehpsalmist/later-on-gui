import React from 'react'

export const Modal = ({ className = '', style = {}, children, show, onHide = () => {} }) => {
  if (!show) return null

  return <div className='fixed inset-0 w-screen min-h-screen overflow-y-scroll pt-16 flex items-center flex-col' style={{ backgroundColor: 'rgba(0,0,0,.2)' }}>
    <div className='fixed inset-0 w-screen h-screen z-10' onClick={onHide}></div>
    <div className={`bg-white w-11/12 sm:w-2/3 rounded p-2 sm:p-4 my-16 z-20 ${className}`}>
      {children}
    </div>
  </div>
}
