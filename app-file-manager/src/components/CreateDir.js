import { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'

import { newDirectoryOrFile } from '../services/newDirectory'
import { InputDirName } from './InputDirName'

export const CreateDir = ({ path, setNewDir }) => {  
    const [inputState, setInputState] = useState(false)
    const [dirName, setDirName] = useState('New Dir')

    const dirCreation = (e) => {
      if(!inputState)
        setInputState(true)
    }
    const cancelCreation = () => {
      setInputState(false)
    }

    const handleSubmit = (e) => {
      e.preventDefault()

      newDirectoryOrFile(path, dirName, 'dir')
        .then((res) => {
          setNewDir(res.path)
          setInputState(false)
        })
        .catch(console.error)
    }

    return (
      <form onSubmit={handleSubmit}
        className="directory create_directory"
        onClick={dirCreation}>

        <FontAwesomeIcon 
          onClick={cancelCreation}
          icon={faCirclePlus} 
          className={
                      inputState 
                        ? 'icon_add icon_cancel_add'
                        : 'icon_add icon_transition'
                    }
        />
        <InputDirName 
          setDirName={setDirName} 
          inputState={inputState}/>
      </form>
    )
}
