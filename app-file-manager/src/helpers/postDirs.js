const postDirs = async (path = '', data = {}) => {

    const url = `http://192.168.1.5:8080/${path}`
    const resp = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const result = await resp.json()
    
    if(result.error) {
        throw new Error(result.error)
    }
    return result
}

export default postDirs