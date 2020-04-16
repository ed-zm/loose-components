import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { SIGN_UP } from './index.graphql'

const SignUp = ({ callback }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [signUpMutation, { data }] = useMutation(SIGN_UP)
  const onSignUp = async () => {
    const signedUp = await signUpMutation({
      variables: {
        email,
        password,
        firstName,
        lastName,
        username
      }
    })
    if(signedUp) {
      callback()
    }
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
    data
  })
}

export default SignUp
