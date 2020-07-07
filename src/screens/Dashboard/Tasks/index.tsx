import React, { useState, useEffect, useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { TASKS, ORGANIZATIONS } from './index.graphql'
import { UserContext } from '../../../contexts/User'

interface CreateTaskVariables {
  title: string
  description: string
  state: Number
  estimated: Number
  createdBy: any
  organization?: any
}

const Tasks = () => {
  const [ state, setState ] = useState(0)
  const { data, loading, refetch, error } = useQuery(TASKS, { variables: { state }})
  const sortedTasks = data && data.tasks ? data.tasks.sort((a, b) => a.state - b.state) : []
  useEffect(() => {
    refetch({ variables: { state } })
  }, [state])
  return {
    tasks: sortedTasks,
    loading,
    error,
    state,
    setState
  }
}

export default Tasks
