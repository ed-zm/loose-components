import React, { Fragment, useState, useContext } from 'react'
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
  const { data } = useQuery(TASKS)
  const sortedTasks = data && data.tasks ? data.tasks.sort((a, b) => a.state - b.state) : []
  return {
    sortedTasks
  }
}

export default Tasks
