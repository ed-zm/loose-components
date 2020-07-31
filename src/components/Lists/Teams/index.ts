import React, { useState, useEffect, useContext, useMemo } from 'react'
import Link from 'next/link'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TEAMS, ORGANIZATIONS } from './index.graphql'
import getNodes from '../../../utils/getNodes'

const Teams = ({ organization }) => {
  const [orderBy, setOrderBy ] = useState('createdAt_DESC')
  const [ quantity, setQuantity ] = useState(6)
  const [ nameFilter, setNameFilter ] = useState('')
  const where = {
    name_contains: nameFilter
  }
  if(organization) where.organization = { id: organization.id }
  const { data, loading, error, variables, fetchMore } = useQuery(TEAMS, {
    variables: {
      where,
      first: quantity,
      orderBy
    }
  })
  const teams = useMemo(() => {
    return getNodes(data)
  }, [data])
  const pageInfo = useMemo(() => {
    return teams.pageInfo
  }, [teams])
  const onFetchMore = async () => {
    if(pageInfo.hasNextPage) {
      await fetchMore({
        variables: {
          ...variables,
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if(!fetchMoreResult) return prev
          return { teams: { ...fetchMoreResult.teams, edges: [ ...prev.teams.edges, ...fetchMoreResult.teams.edges ] } }
        }
      })
    }
  }
  return({
    teams: teams.nodes,
    loading,
    nameFilter,
    setNameFilter,
    onFetchMore,
    pageInfo,
    variables,
    orderBy,
    setOrderBy
  })
}

export default Teams
