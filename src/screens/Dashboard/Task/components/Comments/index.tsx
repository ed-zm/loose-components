import React, { useState, useContext, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import { UserContext } from '../../../../../contexts/User'
import { COMMENTS, CREATE_COMMENT } from './index.graphql'
import getNodes from '../../../../../utils/getNodes'


const Comments = ({ task }) => {
  const user = useContext(UserContext)
  const [ continueFetching, setContinueFetching ] = useState(true)
  const [ comment, setComment ] = useState('')
  const [ mentions, setMentions ] = useState([])
  const [orderBy, setOrderBy ] = useState({ createdAt: 'asc' })
  const [ quantity, setQuantity ] = useState(6)
  const { data, loading, variables, fetchMore } = useQuery(COMMENTS, {
    variables: {
      taskId: task.id,
      first: quantity,
      orderBy
    }
  })
  const [ createComment, { loading: creatingComment }] = useMutation(CREATE_COMMENT)
  const onCreateComment = async () => {
    const filteredMentions = mentions.filter(mention => (task.createdBy.username !== mention) && ((task.assignedTo.username !== mention)))
    if(user.username === task.createdBy.username) {
      filteredMentions.push(`@${task.assignedTo.username}`)
    }
    if(user.username === task.assignedTo.username) {
      filteredMentions.push(`@${task.createdBy.username}`)
    }
    await createComment({
      variables: {
        userId: user.id,
        taskId: task.id,
        text: comment,
        mentions: filteredMentions.map(value => {
          const mention = value.split('@')[1]
          const title = `respond to ${user.firstName} ${user.lastName} in ${task.code}`
          return {
            title,
            description: `Response Request in ${title} from ${mention}`,
            createdBy: {
              connect: { id: user.id }
            },
            state: 0,
            assignedTo: {
              connect: { username: mention }
            }
          }
        })

      },
      optimisticResponse: {
        __typename: "Mutation",
        updateOneTask: {
          __typename: "Task",
          id: task.id,
          comments: [{
            __typename: "Comment",
            id: -1,
            text: comment,
            state: 0,
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
            createdAt: moment(),
            updatedAt: null
          }]
        }
      },
      update: (proxy, { data: { updateOneTask } }) => {
        const data: any = proxy.readQuery({ query: COMMENTS, variables })
        const newComments = data.comments.slice()
        newComments.push(updateOneTask.comments[updateOneTask.comments.length - 1])
        console.log(newComments)
        proxy.writeQuery({ query: COMMENTS, variables, data: { comments: [ ...data.comments, ...newComments ]} })
      }
    })
    await setComment('')
  }
  const comments = useMemo(() => {
    if(data && data.comments) return data.comments
    return []
  }, [data])
  const onFetchMore = async () => {
    const commentsLength = comments.length
    if(continueFetching && commentsLength > 0) {
      await fetchMore({
        variables: {
          ...variables,
          after: { id: comments[commentsLength - 1].id },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if(!fetchMoreResult) {
            setContinueFetching(false)
            return prev
          }
          return { comments: [ ...prev.comments, ...fetchMoreResult.comments ] }
        }
      })
    }
  }
  return({
    comments,
    comment,
    setComment,
    mentions,
    setMentions,
    creatingComment,
    onCreateComment,
    loading,
    onFetchMore,
    continueFetching
  })
}

export default Comments
