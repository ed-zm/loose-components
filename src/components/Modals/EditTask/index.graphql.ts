import gql from 'graphql-tag'

export const UPDATE_TASK = gql`
  mutation($taskId: ID!, $title: String, $description: String, $estimated: Int) {
    updateTask(
      where: {
        id: $taskId
      },
      data: {
        title: $title,
        description: $description,
        estimated: $estimated
      }
    ) {
      id
      title
      description
      estimated
      updatedAt
    }
  }
`
