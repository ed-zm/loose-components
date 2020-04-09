import React, { Fragment, useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { TASKS, CREATE_TASK, ORGANIZATIONS } from './index.graphql'
import { UserContext } from '../../../contexts/User'
import TaskCard from '../../../components/TaskCard'

interface CreateTaskVariables {
  title: string
  description: string
  state: Number
  estimated: Number
  createdBy: any
  organization?: any
}

const Tasks = () => {
  const user = useContext(UserContext)
  const { data } = useQuery(TASKS)
  const { data: orgs } = useQuery(ORGANIZATIONS)
  const [ createTask ] = useMutation(CREATE_TASK)
  const [ title, setTitle ] = useState('')
  const [ description, setDescription ] = useState('')
  const [ organization, setOrganization ] = useState('')
  const [ estimated, setEstimated ] = useState(0)
  const sortedTasks = data && data.tasks ? data.tasks.sort((a, b) => a.state - b.state) : []
  const onCreateTask = async () => {
    const variables: CreateTaskVariables = {
      title,
      description,
      state: 0,
      estimated,
      createdBy: { connect: { id: user.id } },
    }
    if(organization) variables.organization = { connect: { id: organization }}
    createTask({
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
        const newTasks = sortedTasks.slice()
        newTasks.push(createTask)
        proxy.writeQuery({ query: TASKS, data: { tasks: newTasks } })
      }
    })
  }
  return {
    onCreateTask,
    sortedTasks,
    title,
    setTitle,
    estimated,
    setEstimated,
    description,
    setDescription,
    organization,
    setOrganization,
    orgs
  }
}

export default Tasks
