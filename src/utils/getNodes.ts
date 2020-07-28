const initialState = {
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: '',
    endCursor: ''
  },
  nodes: []
}

export default data => {
  if(data) {
    const dataKeys = Object.keys(data)
    if(dataKeys.length > 0) {
      const obj = data
      const key = dataKeys[0]
      const nodes = obj[key].edges.map(edge => edge.node)
      return {
        nodes,
        pageInfo: data[key].pageInfo,
        // count: data[key].aggregate.count
      }
    }
    return initialState
  }
  return initialState
}
