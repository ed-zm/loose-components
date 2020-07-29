import React, { useState, useContext, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ORGANIZATIONS } from './index.graphql'
import { UserContext } from '../../../contexts/User'
import getNodes from '../../../utils/getNodes'

const Organizations = () => {
  const user = useContext(UserContext)
  const [ quantity, setQuantity ] = useState(2)
  const [ nameFilter, setNameFilter ] = useState('')
  const [ cursor, setCursor ] = useState({after: null, before: null})
  const { data, loading, error, variables } = useQuery(ORGANIZATIONS, {
    variables: {
      nameFilter,
      ...cursor,
      first: quantity,
      // last: quantity
    }
  })
  const onSetCursor = async (action) => {
    if(action === 'BEFORE' && pageInfo.hasPreviousPage) {
      setCursor({ before: pageInfo.startCursor, after: null})
    }
    if(action === 'AFTER' && pageInfo.hasNextPage) {
      setCursor({ before: null, after: pageInfo.endCursor })
    }
  }
  const organizations = useMemo(() => {
    return getNodes(data)
  }, [data])
  const pageInfo = useMemo(() => {
    return organizations.pageInfo
  }, [organizations])
  return {
    organizations: organizations.nodes,
    nameFilter,
    setNameFilter,
    onSetCursor,
    loading,
    pageInfo,
    variables
  }
}

export default Organizations
