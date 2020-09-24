import React, { Fragment, useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { UPDATE_TASK } from './index.graphql'
import { UserContext } from '../../../contexts/User'

const UpdateTask = ({ task, callback = () => {} }) => {
  const user = useContext(UserContext)
  const [ updateTask, { loading: updatingTask } ] = useMutation(UPDATE_TASK)
  const [ organization, setOrganization ] = useState(task.organization ? task.organization.id : '')
  const [ title, setTitle ] = useState(task.title)
  const [ description, setDescription ] = useState(task.description)
  const [ estimated, setEstimated ] = useState(task.estimated)
  const onUpdateTask = async () => {
    const where = {
      id: task.id
    }
    const data = {
      title: { set: title },
      description: { set: description },
      estimated: { set: estimated },
    }
    if(task.organization && !organization) data.organization = { disconnect: true }
    if(organization) data.organization = { connect: { id: organization } }
    await updateTask({
      variables: {
        where,
        data
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateOneTask: {
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
    updatingTask,
    organization,
    setOrganization
  }
}

export default UpdateTask
