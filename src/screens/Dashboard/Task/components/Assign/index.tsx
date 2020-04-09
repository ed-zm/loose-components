import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { USERS, ASSIGN_TASK, UNASSIGN_TASK } from './index.graphql'

const Assign = ({ task }) => {
  const [ assignTo, setAssignTo ] = useState('')
  const variables: { assignedToId?: String } = {}
  if(task.assignedTo) variables.assignedToId = task.assignedTo.id
  const { data, refetch: refetchUsers } = useQuery(USERS, { variables })
  const [ assignTask, { loading: assigningTask }] = useMutation(ASSIGN_TASK)
  const [ unassignTask, { loading: unassigningTask }] = useMutation(UNASSIGN_TASK)
  const onAssignTask = async () => {
    await assignTask({
      variables: {
        id: task.id,
        userId: assignTo
      }
    })
    await setAssignTo('')
    await refetchUsers({
      fetchPolicy: 'cache-and-network'
    })
  }
  useEffect(() => {
    if(data && !!data.users.length) setAssignTo(data.users[0].id)
  }, [data])
  return({
    assignTo,
    setAssignTo,
    data,
    assigningTask,
    onAssignTask
  })
}

export default Assign
