import React, { useState, useEffect, useContext, useMemo } from 'react'
import Link from 'next/link'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TEAMS, ORGANIZATIONS } from './index.graphql'
import { UserContext } from '../../../contexts/User'
import getNodes from '../../../utils/getNodes'

const Teams = () => {
  const user = useContext(UserContext)
  const [orderBy, setOrderBy ] = useState('createdAt_DESC')
  const [ quantity, setQuantity ] = useState(6)
  const [ nameFilter, setNameFilter ] = useState('')
  const { data, loading, error, variables, fetchMore } = useQuery(TEAMS, {
    variables: {
      nameFilter,
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
