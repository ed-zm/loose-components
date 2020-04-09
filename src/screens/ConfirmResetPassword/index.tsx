import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/react-hooks'
import { CONFIRM_RESET_PASSWORD } from './index.graphql'

const ConfirmResetPassword = ({ code }) => {
  const [ password, setPassword ] = useState('')
  const [ confirmPassword, setConfirmPassword ] = useState('')
  const [ confirmResetPassword, { data } ] = useMutation(CONFIRM_RESET_PASSWORD)
  const checkPasswords = password !== confirmPassword
  const onConfirmPassword = async () => {
    await confirmResetPassword({
      variables: { password, resetPasswordCode: code }
    })
  }
  return ({
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    data,
    checkPasswords,
    onConfirmPassword
  })
}

export default ConfirmResetPassword
