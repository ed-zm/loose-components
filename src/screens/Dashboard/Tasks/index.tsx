import React, { useState, useEffect, useContext, useMemo } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { TASKS, ORGANIZATIONS } from './index.graphql'
import { UserContext } from '../../../contexts/User'
import getNodes from '../../../utils/getNodes'

const Tasks = () => {
  const user = useContext(UserContext)
  const [orderBy, setOrderBy ] = useState('createdAt_DESC')
  const [ quantity, setQuantity ] = useState(3)
  const [ page, setPage ] = useState(1)
  const [ titleFilter, setTitleFilter ] = useState('')
  const [ state, setState ] = useState(0)
  const [ cursor, setCursor ] = useState({after: null, before: null})
  const [ organizationOrPersonal, setOrganizationOrPersonal ] = useState('')
  const [ createdOrAssigned, setCreatedOrAssigned ] = useState('')
  // const variables =
  const { data, loading, refetch, error, variables } = useQuery(TASKS, {
    variables: {
      state: state === 2 ? null : state,
      createdBy: createdOrAssigned === 'CREATED' ? user.id : null,
      assignedTo: createdOrAssigned === 'ASSIGNED' ? user.id : null,
      titleFilter,
      ...cursor,
      first: quantity,
      orderBy
      // last: quantity
    }
  })
  const tasks = useMemo(() => {
    return getNodes(data)
  }, [data])
  const pageInfo = useMemo(() => {
    return tasks.pageInfo
  }, [tasks])
  const onSetCursor = async (action) => {
    if(action === 'BEFORE' && pageInfo.hasPreviousPage) {
      setCursor({ before: pageInfo.startCursor, after: null})
    }
    if(action === 'AFTER' && pageInfo.hasNextPage) {
      setCursor({ before: null, after: pageInfo.endCursor })
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
    page,
    setPage,
    onSetCursor
  }
}

export default Tasks
