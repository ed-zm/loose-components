import React, { useState, useEffect, useContext, useMemo } from 'react'
import Link from 'next/link'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TEAMS, ORGANIZATIONS } from './index.graphql'

const Teams = ({ organization }) => {
  const [ continueFetching, setContinueFetching ] = useState(true)
  const [orderBy, setOrderBy ] = useState({ createdAt: 'desc' })
  const [ quantity, setQuantity ] = useState(6)
  const [ nameFilter, setNameFilter ] = useState('')
  const where = {
    name: {
      contains: nameFilter
    }
  }
  if(organization) where.organization = { id: { equals: organization.id } }
  const { data, loading, error, variables, fetchMore } = useQuery(TEAMS, {
    variables: {
      where,
      first: quantity,
      orderBy
    },
    fetchPolicy: 'network-only'
  })
  const teams = useMemo(() => {
    if(data && data.teams) return data.teams
    return []
  }, [data])
  const onFetchMore = async () => {
    const teamsLength = teams.length
    if(continueFetching && teamsLength > 0) {
      await fetchMore({
        variables: {
          ...variables,
          after: {
            id: teams[teamsLength - 1].id
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if(!fetchMoreResult) {
            setContinueFetching(false)
            return prev
          }
          return { teams: [ ...prev.teams, ...fetchMoreResult.teams ] }
        }
      })
    }
  }
  return({
    teams,
    loading,
    nameFilter,
    setNameFilter,
    onFetchMore,
    variables,
    orderBy,
    setOrderBy,
    continueFetching
  })
}

export default Teams
