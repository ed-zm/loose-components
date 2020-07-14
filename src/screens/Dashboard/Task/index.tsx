import React, { useContext, useState, useEffect } from 'react'
import moment from 'moment'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Assign from './components/Assign'
import Labels from './components/Labels'
import Comments from './components/Comments'
import { TASK, DELETE_TASK } from './index.graphql'
import { UserContext } from '../../../contexts/User'

const Task = ({ id }) => {
  const user = useContext(UserContext)
  const [ isMember, setIsMember ] = useState(false)
  const where = id.length > 6 ? { id } : { code: id }
  const [ deleteTask, { loading: deletingTask, error: deleteTaskError } ] = useMutation(DELETE_TASK)
  const { data, loading, error } = useQuery(TASK, { variables: { where, userId: user.id } })
  useEffect(() => {
    if(data && data.task && data.task.organization && data.task.organization.users > 0) {
      setIsMember(true)
    }
  }, [data])
  const onDeleteTask = async () => {
    await deleteTask({
      variables: {
        id: data.task.id
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteTask: {
          __typename: "Task",
          id: data.task.id
        }
      }
    })
  }
  return({
    data,
    loading,
    error,
    onDeleteTask,
    deletingTask,
    deleteTaskError,
    isMember
  })
}

export default Task
