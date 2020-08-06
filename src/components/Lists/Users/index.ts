import React, { useState, useMemo, useEffect, useContext } from 'react'
import moment from 'moment'
import { useQuery } from '@apollo/react-hooks'
import { USERS } from './index.graphql'
import { UserContext } from '../../../contexts/User'
import getNodes from '../../../utils/getNodes'

const Users = ({ team, organization, type, typeId, invite }) => {
  const user = useContext(UserContext)
  const [ name, setName ] = useState('')
  const [ now ] = useState(moment())
  const [ orderBy, setOrderBy ] = useState('firstName_ASC')
  const where = {
    OR: [
      { firstName_contains: name },
      { lastName_contains: name }
    ],
  }
  if(organization) where.organizations_some = { id: organization.id }
  if(team) where.teams_some = { id: team.id }
  if(invite && type && typeId) {
    where.id_not = user.id
    where.receivedInvites_none = {
      typeId,
      type,
      from: {
        id: user.id
      }
    }
    where.receivedInvites_every = {
      expireAt_lt: now
    }

    // set filters as null as we are joining new users instead of filtering
    delete where.organizations_some
    delete where.teams_some
  }
  const { data, error, refetch, loading } = useQuery(USERS, {
    variables: {
      where,
      orderBy
    },
    fetchPolicy: 'only-network',
    notifyOnNetworkStatusChange: true
  })
  const users = useMemo(() => {
    return getNodes(data)
  }, [data])
  const pageInfo = useMemo(() => {
    return users.pageInfo
  }, [users])
  const onFetchMore = async () => {
    if(pageInfo.hasNextPage) {
      await fetchMore({
        variables: {
          ...variables,
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if(!fetchMoreResult) return prev
          return { users: { ...fetchMoreResult.users, edges: [ ...prev.users.edges, ...fetchMoreResult.users.edges ] } }
        }
      })
    }
  }
  return {
    users: users.nodes,
    onFetchMore,
    pageInfo,
    name,
    setName,
    orderBy,
    setOrderBy,
    refetch,
    loading
  }
}

export default Users
