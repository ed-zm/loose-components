import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { RESET_PASSWORD } from './index.graphql'

const ResetPassword = () => {
  const [ email, setEmail ] = useState('')
  const [ resetPassword, { data } ] = useMutation(RESET_PASSWORD)
  const onResetPassword = async () => {
    await resetPassword({ variables: { email } })
  }
  return({
    email,
    setEmail,
    data,
    onConfirmPassword
  })
}

export default ResetPassword
