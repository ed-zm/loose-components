import React from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks'
import { ORGANIZATION } from './index.graphql'

const Organization = ({ id }) => {
  const { data } = useQuery(ORGANIZATION, { variables: { id } })
  return {
    data
  }
}

export default Organization
