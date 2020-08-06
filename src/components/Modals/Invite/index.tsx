import React, { useState } from 'react'

const Invite = () => {
  const [ email, setEmail ] = useState('')
  const [ tab, setTab ] = useState('EMAIL')
  const [inviting, setInviting] = useState(false);
  return {
    tab,
    setTab,
    inviting,
    setInviting,
    email,
    setEmail
  }
}

export default Invite
