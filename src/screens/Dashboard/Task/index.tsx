import React from 'react'
import moment from 'moment'
import { useQuery } from '@apollo/react-hooks'
import Assign from './components/Assign'
import Labels from './components/Labels'
import Comments from './components/Comments'
import { TASK } from './index.graphql'

const Task = ({ id }) => {
  const where = id.length > 6 ? { id } : { code: id }
  const { data, loading, error } = useQuery(TASK, { variables: { where } })
  return({
    data,
    loading,
    error
  })
}

export default Task
