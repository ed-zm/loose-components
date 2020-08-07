import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { TASKS, ORGANIZATIONS } from './index.graphql'
import { UserContext } from '../../../contexts/User'
import getNodes from '../../../utils/getNodes'

const Tasks = ({ team, organization }) => {
  const user = useContext(UserContext)
  const [orderBy, setOrderBy ] = useState('createdAt_DESC')
  const [ quantity, setQuantity ] = useState(6)
  const [ titleFilter, setTitleFilter ] = useState('')
  const [ state, setState ] = useState(2)
  const [ organizationOrPersonal, setOrganizationOrPersonal ] = useState('')
  const [ createdOrAssigned, setCreatedOrAssigned ] = useState('')
  const where = {
    state,
    title_contains: titleFilter
  }
  if(createdOrAssigned === 'CREATED') where.createdBy = { id: user.id }
  if(createdOrAssigned === 'ASSIGNED') where.assignedTo = { id: user.id }
  if(team) where.team = { id: team.id }
  if(organization) where.organization = { id: organization.id }
  if(state > 1) {
    delete where.state
  }
  const { data, loading, refetch, error, variables, fetchMore } = useQuery(TASKS, {
    variables: {
      where,
      first: quantity,
      orderBy
    },
    // fetchPolicy: 'cache-and-network'
  })
  const pageInfo = useMemo(() => {
    return getNodes(data).pageInfo
  }, [data])
  const tasks = useMemo(() => {
    return getNodes(data)
  }, [data])
  const onFetchMore = async () => {
    if(pageInfo.hasNextPage) {
      await fetchMore({
        variables: {
          ...variables,
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if(!fetchMoreResult) return prev
          return { tasks: { ...fetchMoreResult.tasks, edges: [ ...prev.tasks.edges, ...fetchMoreResult.tasks.edges ] } }
        }
      })
    }
  }

  return {
    tasks: tasks.nodes.sort((a, b) => a.state - b.state),
    // count: tasks.count,
    pageInfo,
    variables,
    loading,
    error,
    state,
    setState,
    setTitleFilter,
    titleFilter,
    organizationOrPersonal,
    setOrganizationOrPersonal,
    createdOrAssigned,
    setCreatedOrAssigned,
    onFetchMore,
    orderBy,
    setOrderBy
  }
}

export default Tasks
