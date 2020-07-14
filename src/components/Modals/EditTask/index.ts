import React, { Fragment, useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { UPDATE_TASK } from './index.graphql'
import { UserContext } from '../../../contexts/User'

const UpdateTask = ({ task, callback = () => {} }) => {
  const user = useContext(UserContext)
  const [ updateTask, { loading: updatingTask } ] = useMutation(UPDATE_TASK)
  const [ title, setTitle ] = useState(task.title)
  const [ description, setDescription ] = useState(task.description)
  const [ estimated, setEstimated ] = useState(task.estimated)
  const onUpdateTask = async () => {
    const variables: UpdateTaskVariables = {
      taskId: task.id,
      title,
      description,
      estimated
    }
    await updateTask({
      variables,
      optimisticResponse: {
        __typename: "Mutation",
        updateTask: {
          __typename: "Task",
          id: task.id,
          title,
          estimated,
          description,
          updatedAt: new Date().toISOString()
        }
      }
    })
    await setTitle('')
    await setDescription('')
    await setEstimated(0)
    await callback()
  }

  return {
    onUpdateTask,
    title,
    setTitle,
    estimated,
    setEstimated,
    description,
    setDescription,
    updatingTask
  }
}

export default UpdateTask
