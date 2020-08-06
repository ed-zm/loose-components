import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { SIGN_UP } from './index.graphql'

const SignUp = ({ callback, inviteCode }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [signUpMutation, { data, loading: signingUp, error }] = useMutation(SIGN_UP)
  useEffect(() => {
    if(data && !!data.signUp) {
      const token = data.signUp !== 'created' ? data.signUp : ''
      callback(token)
    }
  }, [data])
  const onSignUp = async () => {
    await signUpMutation({
      variables: {
        email,
        password,
        firstName,
        lastName,
        username,
        inviteCode
      }
    })
  }
  return({
    firstName,
    setFirstName,
    lastName,
    setLastName,
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    onSignUp,
    signingUp,
    error,
    data
  })
}

export default SignUp
