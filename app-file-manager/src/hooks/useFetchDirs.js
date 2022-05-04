import { useEffect, useState } from "react"
import getDirs from '../helpers/getDirs'

export const useFetchDirs = (path) => {
  const [newDir, setNewDir] = useState('')
  const [state, setState] = useState({
    data: [],
    loading: true
  })

  useEffect(() => {
    getDirs(path)
      .then(data => {

        setState({
          data,
          loading: false
        })

      })

  }, [path, newDir])
  
  return [ state, setNewDir ]
}
