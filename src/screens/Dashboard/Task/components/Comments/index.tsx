import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import { UserContext } from '../../../../../contexts/User'
import { COMMENTS, CREATE_COMMENT } from './index.graphql'


const Comments = ({ task }) => {
  const user = useContext(UserContext)
  const [ comment, setComment ] = useState('')
  const [ mentions, setMentions ] = useState([])
  const { data } = useQuery(COMMENTS, { variables: { taskId: task.id } })
  const [ createComment, { loading: creatingComment }] = useMutation(CREATE_COMMENT)
  const onCreateComment = async () => {
    await createComment({
      variables: {
        userId: user.id,
        taskId: task.id,
        text: comment,
        mentions: mentions.map(value => {
          const mention = value.split('@')[1]
          const title = `respond to ${mention} in ${task.code}`
          return {
            title,
            description: `Response Request in ${title} from ${mention}`,
            createdBy: {
              connect: { id: user.id }
            },
            assignedTo: {
              connect: { username: mention }
            }
          }
        })
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateTask: {
          __typename: "Task",
          id: task.id,
          comments: [{
            __typename: "Comment",
            id: -1,
            text: comment,
            task: {
              __typename: "Task",
              id: task.id
            },
            user: {
              __typename: "User",
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName
            },
            createdAt: moment()
          }]
        }
      },
      update: (proxy, { data: { updateTask } }) => {
        const proxyData: any = proxy.readQuery({ query: COMMENTS, variables: { taskId: task.id } })
        const newComments = proxyData.comments.slice()
        newComments.push(updateTask.comments[updateTask.comments.length - 1])
        proxy.writeQuery({ query: COMMENTS, variables: { taskId: task.id }, data: { comments: newComments } })
      }
    })
    await setComment('')
  }
  return({
    data,
    comment,
    setComment,
    mentions,
    setMentions,
    creatingComment,
    onCreateComment
  })
}

export default Comments
