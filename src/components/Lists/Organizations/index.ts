import React, { useState, useContext, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ORGANIZATIONS } from './index.graphql'
import { UserContext } from '../../../contexts/User'

const Organizations = () => {
  const user = useContext(UserContext)
  const [ continueFetching, setContinueFetching ] = useState(true)
  const [ quantity, setQuantity ] = useState(2)
  const [orderBy, setOrderBy ] = useState({ createdAt: 'desc' })
  const [ nameFilter, setNameFilter ] = useState('')
  const [ ownerOrMember, setOwnerOrMember ] = useState('')
  const where = {
    name: {
      contains: nameFilter
    }
  }
  if(ownerOrMember === 'MEMBER') where.users = { some: { id: { equals: user.id } }  }
  if(ownerOrMember === 'OWNER') where.ownerId = { equals: user.id }
  const { data, loading, error, variables, fetchMore } = useQuery(ORGANIZATIONS, {
    variables: {
      where,
      first: quantity,
      orderBy
    },
    fetchPolicy: 'network-only'
  })
  const organizations = useMemo(() => {
    if(data && data.organizations) return data.organizations
    return []
  }, [data])
  const onFetchMore = async () => {
    const organizationsLength = organizations.length
    if(continueFetching && organizationsLength > 0) {
      await fetchMore({
        variables: {
          ...variables,
          after: {
            id: organizations[organizationsLength - 1].id
          }
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if(!fetchMoreResult.organizations.length) {
            setContinueFetching(false)
            return prev
          }
          return { organizations: [ ...prev.organizations, ...fetchMoreResult.organizations ] }
        }
      })
    }
  }
  return {
    organizations,
    nameFilter,
    setNameFilter,
    onFetchMore,
    loading,
    variables,
    ownerOrMember,
    setOwnerOrMember,
    orderBy,
    setOrderBy,
    continueFetching
  }
}

export default Organizations
