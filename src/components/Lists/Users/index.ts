import React, { useState, useMemo, useEffect, useContext } from 'react'
import moment from 'moment'
import { useQuery } from '@apollo/react-hooks'
import { USERS } from './index.graphql'
import { UserContext } from '../../../contexts/User'

const Users = ({ team, organization, type, typeId, invite }) => {
  const user = useContext(UserContext)
  const [ continueFetching, setContinueFetching ] = useState(true)
  const [ name, setName ] = useState('')
  const [ now ] = useState(moment())
  const [ orderBy, setOrderBy ] = useState({ firstName: 'asc' })
  const where = {
    OR: [
      { firstName: { contains: name } },
      { lastName: { contains: name } }
    ],
  }
  if(organization) where.organizations = { some: { id: { equals: organization.id } } }
  if(team) where.teams = { some: { id: { equals: team.id } } }
  if(invite && type && typeId) {
    where.id = { not: { equals: user.id} }
    where.receivedInvites = {
      none: {
        typeId: { equals: typeId },
        type: { equals: type },
        from: {
          id: { equals: user.id }
        }
      }
    }
    where.receivedInvites = {
      every: {
        expireAt: { lt: now }
      }
    }

    // set filters as null as we are joining new users instead of filtering
    delete where.organizations
    delete where.teams
  }
  const { data, error, refetch, fetchMore, variables, loading } = useQuery(USERS, {
    variables: {
      where,
      orderBy
    },
    fetchPolicy: 'only-network',
    notifyOnNetworkStatusChange: true
  })
  const users = useMemo(() => {
    if(data && data.users) return data.users
    return []
  }, [data])
  const onFetchMore = async () => {
    const usersLength = users.length
    if(continueFetching && usersLength > 0) {
      await fetchMore({
        variables: {
          ...variables,
          after: { id: users[usersLength - 1].id },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if(!fetchMoreResult.users.length) {
            setContinueFetching(false)
            return prev
          }
          return { users: [ ...prev.users, ...fetchMoreResult.users ] }
        }
      })
    }
  }
  return {
    users,
    onFetchMore,
    name,
    setName,
    orderBy,
    setOrderBy,
    refetch,
    loading,
    continueFetching
  }
}

export default Users
