import gql from 'graphql-tag'

export const UPDATE_TASK = gql`
  mutation($where: TaskWhereUniqueInput!, $data: TaskUpdateInput) {
    updateTask(
      where: $where
      data: $data
    ) {
      id
      title
      organization {
        id
      }
      description
      estimated
      updatedAt
    }
  }
`
