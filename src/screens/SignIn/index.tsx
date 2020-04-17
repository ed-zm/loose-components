import React, { useState, useEffect, useContext } from 'react'
import { useMutation, useLazyQuery } from '@apollo/react-hooks'
import router from 'next/router'
import { SIGN_IN, LOGGED_IN, RESEND_VERIFICATION_EMAIL } from './index.graphql'
import { UserContext } from '../../contexts/User'

const SignIn = ({ callback, setToken }) => {
  const user = useContext(UserContext)
  const [email, setEmail] = useState('')
  const [ resendVerificationEmailSent, setResendVerificationEmailSent ] = useState(false)
  const [password, setPassword] = useState('')
  const [signInMutation, { loading: signingIn, error }] = useMutation(SIGN_IN)
  const [resendVerificationEmailMutation, {
    data: resendVerificationEmailData,
    loading: resendingVerificationEmail,
    error: resendVerificationEmailError
  }] = useMutation(RESEND_VERIFICATION_EMAIL)
  const [loggedIn, { data }] = useLazyQuery(LOGGED_IN)
  useEffect(() => {
    const redirect = async () => {
      await user.actions.setUser({ ...data.loggedIn })
      await callback()
    }
    if(data && data.loggedIn) {
      redirect()
    }
  }, [data])
  useEffect(() => {
    if(resendVerificationEmailData && resendVerificationEmailData.resendVerificationEmail) {
      setResendVerificationEmailSent(true)
    }
  }, [resendVerificationEmailData])
  const onSignIn = async () => {
    const response = await signInMutation({
      variables: {
        email,
        password
      }
    })
    if(response && response.data && response.data.signIn) {
      await setToken(response.data.signIn)
      await callback()
    } else {
      throw new Error('Invalid Credentials')
    }
  }
  const onResendVerificationEmail = async () => {
    console.log('resendVerificationEmail')
    await resendVerificationEmailMutation({
      variables: {
        email
      }
    })
  }
  return({
    email,
    setEmail,
    password,
    setPassword,
    onSignIn,
    signingIn,
    error,
    resendVerificationEmailSent,
    resendingVerificationEmail,
    resendVerificationEmailError,
    onResendVerificationEmail
  })
}

export default SignIn
