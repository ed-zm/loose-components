import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import { UserContext } from '../../../../../../contexts/User'
import { UPDATE_COMMENT, DELETE_COMMENT } from './index.graphql'
import { COMMENTS } from '../index.graphql'


const Comment = ({ task, id, text, variables }) => {
  const user = useContext(UserContext)
  const [ comment, setComment ] = useState(text)
  const [ mentions, setMentions ] = useState([])
  const [ edit, setEdit ] = useState(false)
  const [ updateComment, { loading: updatingComment }] = useMutation(UPDATE_COMMENT)
  const [ deleteComment, { loading: deletingComment }] = useMutation(DELETE_COMMENT)
  const onUpdateComment = async () => {
    await updateComment({
      variables: {
        commentId: id,
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
        updateOneComment: {
          __typename: "Comment",
          id,
          text: comment,
          task: {
            __typename: "Task",
            id: task.id
          },
          updatedAt: moment()
        }
      }
    })
    await setComment('')
    await setEdit(false)
  }
  const onDeleteComment = async () => {
    await deleteComment({
      variables: {
        id
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteOneComment: {
          __typename: "Comment",
          id
        }
      },
      update: (proxy, { data: { deleteOneComment }}) => {
        const proxyData: any = proxy.readQuery({ query: COMMENTS, variables })
        const newComments = proxyData.comments.filter(comment => comment.id !== id)
        proxy.writeQuery({ query: COMMENTS, variables, data: { comments: newComments } })
      }
    })
  }
  return({
    comment,
    setComment,
    mentions,
    setMentions,
    edit,
    setEdit,
    onUpdateComment,
    updatingComment,
    onDeleteComment,
    deletingComment
  })
}

export default Comment
