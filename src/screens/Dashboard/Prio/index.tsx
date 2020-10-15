import React, { useMemo } from 'react'
import moment from 'moment'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { PRIO_TASKS, SNOOZE_TASK } from './index.graphql'

const now = new Date()

const Prio = () => {
  const [ snoozeTask ] = useMutation(SNOOZE_TASK)
  const { data, loading, error, refetch, variables } = useQuery(PRIO_TASKS, {
    variables: {
      where: {
        state: { equals: 0 },
        snoozedUntil: {
          lt: now.toISOString()
        }
      },
      orderBy: [
        { priority: 'desc' }
      ]
    }
  })
  const onSnooze = async ({ snoozeTill, task }) => {
    const variables = {
      taskId: task.id,
      data: {}
    }
    if(snoozeTill === 'LOW') {
      variables.data.priority = {set: 0 }
    } else if(snoozeTill === 'MEDIUM') {
      variables.data.priority = { set: 1 }
    } else {
      if(typeof snoozeTill === 'number') {
        variables.data.snoozedUntil = { set: moment().add(snoozeTill, 'hours').toISOString() }
      }
    }
    await snoozeTask({
      variables,
    })
    await refetch()
  }
  const tasks = useMemo(() => {
    if(data && data.tasks) return data.tasks
    return []
  }, [data])
  return {
    loading,
    tasks,
    onSnooze
  }
}

export default Prio
