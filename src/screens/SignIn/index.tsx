import React, { useState, useEffect, useContext } from 'react'
import { useMutation, useLazyQuery } from '@apollo/react-hooks'
import router from 'next/router'
import { SIGN_IN, LOGGED_IN } from './index.graphql'
import { UserContext } from '../../contexts/User'

const SignIn = ({ callback, setToken }) => {
  const user = useContext(UserContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [signInMutation, { loading: signingIn, error }] = useMutation(SIGN_IN)
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
  return({
    email,
    setEmail,
    password,
    setPassword,
    onSignIn,
    signingIn,
    error
  })
}

export default SignIn
