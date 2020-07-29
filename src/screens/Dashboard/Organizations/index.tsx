import React, { useState, useContext, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ORGANIZATIONS } from './index.graphql'
import { UserContext } from '../../../contexts/User'
import getNodes from '../../../utils/getNodes'

const Organizations = () => {
  const user = useContext(UserContext)
  const [ quantity, setQuantity ] = useState(2)
  const [ nameFilter, setNameFilter ] = useState('')
  const { data, loading, error, variables, fetchMore } = useQuery(ORGANIZATIONS, {
    variables: {
      nameFilter,
      first: quantity,
      // last: quantity
    }
  })
  const onFetchMore = async () => {
    if(pageInfo.hasNextPage) {
      await fetchMore({
        variables: {
          ...variables,
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if(!fetchMoreResult) return prev
          return { organizations: { ...fetchMoreResult.organizations, edges: [ ...prev.organizations.edges, ...fetchMoreResult.organizations.edges ] } }
        }
      })
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
    onFetchMore,
    loading,
    pageInfo,
    variables
  }
}

export default Organizations
