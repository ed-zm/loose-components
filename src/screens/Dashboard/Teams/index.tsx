import React, { useState, useEffect, useContext, useMemo } from 'react'
import Link from 'next/link'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TEAMS, ORGANIZATIONS } from './index.graphql'
import { UserContext } from '../../../contexts/User'
import getNodes from '../../../utils/getNodes'

const Teams = () => {
  const user = useContext(UserContext)
  const [orderBy, setOrderBy ] = useState('createdAt_DESC')
  const [ quantity, setQuantity ] = useState(3)
  const [ cursor, setCursor ] = useState({after: null, before: null})
  const [ nameFilter, setNameFilter ] = useState('')
  const { data, loading, error, variables } = useQuery(TEAMS, {
    variables: {
      nameFilter,
      ...cursor,
      first: quantity,
      orderBy
      // last: quantity
    }
  })

  const teams = useMemo(() => {
    return getNodes(data)
  }, [data])
  const pageInfo = useMemo(() => {
    return teams.pageInfo
  }, [teams])

  const onSetCursor = async (action) => {
    if(action === 'BEFORE' && pageInfo.hasPreviousPage) {
      setCursor({ before: pageInfo.startCursor, after: null})
    }
    if(action === 'AFTER' && pageInfo.hasNextPage) {
      setCursor({ before: null, after: pageInfo.endCursor })
    }
  }
  return({
    teams: teams.nodes,
    loading,
    nameFilter,
    setNameFilter,
    onSetCursor,
    pageInfo,
    variables
  })
}

export default Teams
