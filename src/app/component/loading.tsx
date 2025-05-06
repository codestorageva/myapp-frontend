import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const LoadingSymbol = () => {
  return (
   <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
  )
}

export default LoadingSymbol