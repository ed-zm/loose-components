export default (err) => {
  if(err) {
    const error = err.toString()
    let newError = ''
    newError = error.replace('Error: ', '')
    newError = newError.replace('GraphQL error: ', '')
    newError = newError.replace('Network error: ', '')
    return newError
  }
  return null
}
