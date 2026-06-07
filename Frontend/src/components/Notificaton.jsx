// import React from 'react'

const Notificaton = ({message}) => {
    if (!message) {
        return null
    }

  return (
    <div>
      <p className='notification'>{message}</p>
    </div>
  )
}

export default Notificaton
