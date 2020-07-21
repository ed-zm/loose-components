import React, { useState, useMemo } from 'react'
import { LABELS, ADD_LABEL, REMOVE_LABEL } from './index.graphql'
import { useQuery, useMutation } from '@apollo/react-hooks'

const Labels = ({ task }) => {
  const [ label, setLabel ] = useState('')
  const [ add, setAdd ] = useState(false)
  const organizationId = task.organization ? task.organization.id : null
  const { data } = useQuery(LABELS, { variables: { taskId: task.id, organizationId }, skip: !organizationId})
  const [ addLabel, { loading: creatingLabel }] = useMutation(ADD_LABEL)
  const [ removeLabel, { loading: removingLabel }] = useMutation(REMOVE_LABEL)
  const onAddLabel = async () => {
    await addLabel({
      variables: { taskId: task.id, text: `${label}-${organizationId.id}`, organizationId },
      optimisticResponse: {
        __typename: "Mutation",
        createLabel: {
          __typename: "Label",
          id: -1,
          color: "green",
          text: `${label}-${organizationId}`,
          organization: {
            __typename: "Organization",
            id: organizationId
          }
        }
      },
      update: (proxy, { data: { createLabel } }) => {
        const proxyData: any = proxy.readQuery({ query: LABELS, variables: { taskId: task.id, organizationId } })
        const newLabels = proxyData.labels.slice()
        const labelExists = newLabels.find(label => label.text === createLabel.text )
        if(!labelExists) {
          newLabels.push(createLabel)
          proxy.writeQuery({ query: LABELS, variables: { taskId: task.id, organizationId }, data: { labels: newLabels } })
        }
      }
    })
    await setLabel('')
  }
  const onRemoveLabel = async (id) => {
    await removeLabel({
      variables: { taskId: task.id, id },
      optimisticResponse: {
        __typename: "Mutation",
        updateLabel: {
          __typename: "Label",
          id
        }
      },
      update: (proxy, { data: { updateLabel } }) => {
        const proxyData: any = proxy.readQuery({ query: LABELS, variables: { taskId: task.id, organizationId } })
        const newLabels = proxyData.labels.filter(label => label.id !== updateLabel.id)
        proxy.writeQuery({ query: LABELS, variables: { taskId: task.id, organizationId }, data: { labels: newLabels } })
      }
    })
  }
  const labels = useMemo(() => {
    if(data) return data.labels
    return []
  }, [data])

  return({
    onAddLabel,
    onRemoveLabel,
    removeLabel,
    labels,
    label,
    setLabel,
    creatingLabel,
    organizationId,
    add,
    setAdd
  })
}

export default Labels
