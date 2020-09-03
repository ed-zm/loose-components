import React, { useState, useContext, useMemo } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import moment from 'moment'
import { UserContext } from '../../../../../contexts/User'
import { COMMENTS, CREATE_COMMENT } from './index.graphql'
import getNodes from '../../../../../utils/getNodes'


const Comments = ({ task }) => {
  const user = useContext(UserContext)
  const [ comment, setComment ] = useState('')
  const [ mentions, setMentions ] = useState([])
  const [orderBy, setOrderBy ] = useState('createdAt_ASC')
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
        updateTask: {
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
      update: (proxy, { data: { updateTask } }) => {
        const data: any = proxy.readQuery({ query: COMMENTS, variables })
        const newComments = data.comments.edges.slice()
        newComments.push({ node: updateTask.comments[updateTask.comments.length - 1], __typename: "CommentEdge" })
        // newComments.push(updateTask.comments[updateTask.comments.length - 1])
        proxy.writeQuery({ query: COMMENTS, variables, data: { comments: { ...data.comments, edges: newComments }} })
      }
    })
    await setComment('')
  }
  const comments = useMemo(() => {
    return getNodes(data)
  }, [data])
  const pageInfo = useMemo(() => {
    return comments.pageInfo
  }, [comments])
  const onFetchMore = async () => {
    if(pageInfo.hasNextPage) {
      await fetchMore({
        variables: {
          ...variables,
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if(!fetchMoreResult) return prev
          return { comments: { ...fetchMoreResult.comments, edges: [ ...prev.comments.edges, ...fetchMoreResult.comments.edges ] } }
        }
      })
    }
  }
  return({
    comments: comments.nodes,
    pageInfo,
    comment,
    setComment,
    mentions,
    setMentions,
    creatingComment,
    onCreateComment,
    loading,
    onFetchMore
  })
}

export default Comments
