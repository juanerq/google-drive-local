const uploadFiles = async (path, files) => {
  const url = `http://192.168.1.5:8080/upload/${path}`
  const resp = await fetch(url, {
      method: 'PUT',
      body: files
  })
  const result = await resp.json()

  if(result.status == 'error') {
    throw result
  }

  return result
}

export default uploadFiles