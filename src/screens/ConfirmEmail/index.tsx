import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/react-hooks'
import { CONFIRM_EMAIL } from './index.graphql'

const ConfirmEmail = ({ code }) => {
  const [ confirmEmail, { data, error, loading } ] = useMutation(CONFIRM_EMAIL)
  useEffect(() => {
    confirmEmail({ variables: {
      emailVerificationCode: code
    }})
  }, [])
  return({
    data,
    error,
    loading
  })
}

export default ConfirmEmail
