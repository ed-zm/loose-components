import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { TASKS, ORGANIZATIONS, RESPONSE_REQUESTS } from './index.graphql'
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
    fetchPolicy: 'network-only'
  })
  const {
    data: responseRequestsData,
    loading: responseRequestsLoading,
    refetch: responseRequestsRefetch,
    error: responseRequestsError,
    variables: responseRequestsVariables,
    fetchMore: responseRequestsFetchMore } = useQuery(RESPONSE_REQUESTS, {
    variables: {
      // where,
      first: quantity,
      orderBy
    },
    fetchPolicy: 'network-only'
  })

  const responseRequestsPageInfo = useMemo(() => {
    return getNodes(responseRequestsData).pageInfo
  }, [responseRequestsData])
  const tasksPageInfo = useMemo(() => {
    return getNodes(data).pageInfo
  }, [data])
  const pageInfo = useMemo(() => {
    return {
      hasNextPage: tasksPageInfo.hasNextPage || responseRequestsPageInfo.hasNextPage,
      hasPreviousPage: tasksPageInfo.hasPreviousPage || responseRequestsPageInfo.hasPreviousPage
    }
  }, [responseRequestsPageInfo, tasksPageInfo])

  const tasks = useMemo(() => {
    return getNodes(data)
  }, [data])
  const responseRequests = useMemo(() => {
    return getNodes(responseRequestsData)
  }, [responseRequestsData])
  const onFetchMore = async () => {
    if(tasksPageInfo.hasNextPage) {
      await fetchMore({
        variables: {
          ...variables,
          after: tasksPageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if(!fetchMoreResult) return prev
          return { tasks: { ...fetchMoreResult.tasks, edges: [ ...prev.tasks.edges, ...fetchMoreResult.tasks.edges ] } }
        }
      })
    }
    if(responseRequestsPageInfo.hasNextPage) {
      await responseRequestsFetchMore({
        variables: {
          ...variables,
          after: responseRequestsPageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if(!fetchMoreResult) return prev
          return { responseRequests: { ...fetchMoreResult.responseRequests, edges: [ ...prev.responseRequests.edges, ...fetchMoreResult.responseRequests.edges ] } }
        }
      })
    }
  }
  const items = [...responseRequests.nodes, ...tasks.nodes]
  return {
    tasks: items.sort((a, b) => a.state - b.state),
    // count: tasks.count,
    pageInfo,
    variables,
    loading: loading || responseRequestsLoading,
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
