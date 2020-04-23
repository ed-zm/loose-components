import React, { useContext, useState, useEffect } from 'react'
import moment from 'moment'
import { useQuery } from '@apollo/react-hooks'
import Assign from './components/Assign'
import Labels from './components/Labels'
import Comments from './components/Comments'
import { TASK } from './index.graphql'
import { UserContext } from '../../../contexts/User'

const Task = ({ id }) => {
  const user = useContext(UserContext)
  const [ isMember, setIsMember ] = useState(false)
  const where = id.length > 6 ? { id } : { code: id }
  const { data, loading, error } = useQuery(TASK, { variables: { where, userId: user.id } })
  useEffect(() => {
    if(data && data.task && data.task.organization && data.task.organization.users > 0) {
      setIsMember(true)
    }
  }, [data])
  return({
    data,
    loading,
    error,
    isMember
  })
}

export default Task
