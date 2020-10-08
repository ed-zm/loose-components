import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { TASKS, ORGANIZATIONS, RESPONSE_REQUESTS } from './index.graphql'
import { UserContext } from '../../../contexts/User'

const Tasks = ({ team, organization }) => {
  const user = useContext(UserContext)
  const [ continueFetchingTasks, setContinueFetchingTasks ] = useState(true)
  const [ continueFetchingResponseRequests, setContinueFetchingResponseRequests ] = useState(true)
  const [orderBy, setOrderBy ] = useState({ createdAt: 'desc' })
  const [ quantity, setQuantity ] = useState(3)
  const [ titleFilter, setTitleFilter ] = useState('')
  const [ state, setState ] = useState(2)
  const [ organizationOrPersonal, setOrganizationOrPersonal ] = useState('')
  const [ createdOrAssigned, setCreatedOrAssigned ] = useState('')
  const where = {
    state: { equals: state },
    title: {
      contains: titleFilter
    }
  }
  if(createdOrAssigned === 'CREATED') where.createdBy = { id: { equals: user.id } }
  if(createdOrAssigned === 'ASSIGNED') where.assignedTo = { id: { equals: user.id } }
  if(team) where.team = { id: { equals: team.id } }
  if(organization) where.organization = { id: { equals: organization.id } }
  if(state > 1) {
    delete where.state
  }
  const { data, loading, refetch, error, variables, fetchMore } = useQuery(TASKS, {
    variables: {
      where,
      first: quantity,
      orderBy: [orderBy]
    },
    fetchPolicy: 'network-only'
  })
  // const {
  //   data: responseRequestsData,
  //   loading: responseRequestsLoading,
  //   refetch: responseRequestsRefetch,
  //   error: responseRequestsError,
  //   variables: responseRequestsVariables,
  //   fetchMore: responseRequestsFetchMore } = useQuery(RESPONSE_REQUESTS, {
  //   variables: {
  //     where: {
  //       state: { equals: state },
  //     },
  //     first: quantity,
  //     orderBy: [orderBy]
  //   },
  //   fetchPolicy: 'network-only'
  // })
  //
  // const responseRequests = useMemo(() => {
  //   if(responseRequestsData && responseRequestsData.responseRequests) {
  //     return responseRequestsData.responseRequests
  //   }
  //   return []
  // }, [responseRequestsData])

  const responseRequests = []

  const tasks = useMemo(() => {
    if(data && data.tasks) return data.tasks
    return []
  }, [data])

  const onFetchMore = async (resolve) => {
    const tasksLength = tasks.length
    // const responseRequestsLength = responseRequests.length
    let tasksPage = []
    let responseRequestsPage = []
    if(continueFetchingTasks && tasksLength > 0) {
      await fetchMore({
        variables: {
          ...variables,
          after: {
            id: tasks[tasksLength - 1].id
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          tasksPage = fetchMoreResult.tasks
          // debugger
          if(!fetchMoreResult.tasks.length) {
            return prev
          }
          return { tasks: [ ...prev.tasks, ...fetchMoreResult.tasks ] }
        }
      })
    }
    // if(continueFetchingResponseRequests && responseRequestsLength > 0) {
    //   await responseRequestsFetchMore({
    //     variables: {
    //       ...responseRequestsVariables,
    //       after: { id: responseRequests[responseRequestsLength - 1].id },
    //     },
    //     updateQuery: (prev, { fetchMoreResult }) => {
    //       responseRequestsPage = fetchMoreResult.responseRequests
    //       // debugger
    //       if(!fetchMoreResult.responseRequests.length) {
    //         return prev
    //       }
    //       return { responseRequests: [ ...prev.responseRequests, ...fetchMoreResult.responseRequests ] }
    //     }
    //   })
    // }
    if(!tasksPage.length && continueFetchingTasks) await setContinueFetchingTasks(false)
    // if(!responseRequestsPage.length && continueFetchingResponseRequests) await setContinueFetchingResponseRequests(false)
  }
  const items = [...responseRequests, ...tasks]
  console.log(tasks)
  return {
    tasks: items.sort((a, b) => a.state - b.state),
    // count: tasks.count,
    // pageInfo,
    variables,
    continueFetching: continueFetchingTasks /*|| continueFetchingResponseRequests*/,
    loading: loading /*|| responseRequestsLoading*/,
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
