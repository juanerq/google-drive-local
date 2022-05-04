const getDirs = async (path) => {
  try {
    const url = `http://192.168.1.5:8080/${path}`
    const resp = await fetch(url)
    const data = await resp.json()
    
    if(data.error) 
      return data.error

    return data
  } catch (error) {
    console.log({error})
  }

}

export default getDirs