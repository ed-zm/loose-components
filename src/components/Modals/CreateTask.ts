import React, { Fragment, useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { CREATE_TASK, ORGANIZATIONS } from './index.graphql'
import { TASKS } from '../../screens/Dashboard/Tasks/index.graphql'
import { UserContext } from '../../contexts/User'

const CreateTask = ({ tasks, callback = () => {} }) => {
  const user = useContext(UserContext)
  const [ createTask, { loading: creatingTask } ] = useMutation(CREATE_TASK)
  const { data: orgs } = useQuery(ORGANIZATIONS)
  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ organization, setOrganization ] = useState('')
  const [ estimated, setEstimated ] = useState(0)
  const onCreateTask = async () => {
    const variables: CreateTaskVariables = {
      title,
      description,
      state: 0,
      estimated,
      createdBy: { connect: { id: user.id } },
    }
    if(organization) variables.organization = { connect: { id: organization }}
    else {
      variables.assignedTo = { connect : { id: user.id } }
    }
    await createTask({
      variables: { data: variables },
      optimisticResponse: {
        __typename: "Mutation",
        createTask: {
          __typename: "Task",
          id: "-1",
          title,
          state: 0,
          estimated,
          code: 'AAAA',
          description,
          createdBy: {
            __typename: "User",
            id: user.id
          },
          organization: !organization ? null : {
            __typename: "Organization",
            id: organization
          },
          createdAt: new Date().toISOString()
        }
      },
      update: (proxy, { data: { createTask }}) => {
        const data = proxy.readQuery({ query: TASKS })
        //@ts-ignore
        const newTasks = tasks.slice()
        newTasks.push(createTask)
        proxy.writeQuery({ query: TASKS, data: { tasks: newTasks } })
      }
    })
    await setTitle('')
    await setDescription('')
    await setOrganization('')
    await setEstimated(0)
    await callback()
  }

  return {
    orgs,
    onCreateTask,
    title,
    setTitle,
    estimated,
    setEstimated,
    description,
    setDescription,
    organization,
    setOrganization,
    creatingTask
  }
}

export default CreateTask
