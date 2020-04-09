import React from 'react'
import router from 'next/router'

const Home = (props) => {
  return(
    <div>
      <div onClick = { () => router.push('/sign-in')}>sign in</div>
      <div onClick = { () => router.push('/sign-up')}>sign up</div>
      <div onClick = { () => router.push('/dashboard/organizations')}>organizations</div>
      <div onClick = { () => router.push('/dashboard/tasks')}>tasks</div>
    </div>
  )
}

export default Home
