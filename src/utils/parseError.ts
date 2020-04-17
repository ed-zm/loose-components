export default (err) => {
  if(err) {
    const error = err.toString()
    let newError = ''
    console.log('components', error)
    newError = error.replace('Error: ', '')
    newError = newError.replace('GraphQL error: ', '')
    newError = newError.replace('Network error: ', '')
    console.log('components error', newError)
    return newError
  }
  return null
}
