import React, { useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { INVITE } from './index.graphql'

const Invite = ({ code }) => {
  const { data, loading, error } = useQuery(INVITE, { variables: { code } })
  const invite = useMemo(() => {
    if(data && data.invite) return data.invite
    return []
  }, [data])
  return {
    invite,
    loading,
    error
  }
}

export default Invite
