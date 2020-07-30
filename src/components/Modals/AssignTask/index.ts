import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { ASSIGN_TASK, UNASSIGN_TASK } from './index.graphql'

const AssignTask = ({ task }) => {
  const [ assignTask, { loading: assigningTask }] = useMutation(ASSIGN_TASK)
  const [ unassignTask, { loading: unassigningTask }] = useMutation(UNASSIGN_TASK)
  const onAssignTask = async (user) => {
    console.log('user')
    await assignTask({
      variables: {
        id: task.id,
        userId: user.id
      }
    })
  }
  return({
    assigningTask,
    onAssignTask
  })
}

export default AssignTask
