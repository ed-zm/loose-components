import React, { useContext, useState, useEffect, useMemo } from 'react'
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
  const task = useMemo(() => {
    if(data && data.task) return data.task
    return null
  }, [data])
  useEffect(() => {
    if(task &&
      ((task.organization && task.organization.users.length > 0) ||
      (task.createdBy.id === user.id))
    ) {
      setIsMember(true)
    }
  }, [task])
  return({
    task,
    loading,
    error,
    onDeleteTask,
    deletingTask,
    deleteTaskError,
    isMember
  })
}

export default Task
