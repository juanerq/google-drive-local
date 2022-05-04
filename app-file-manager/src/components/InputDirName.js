import { useState, useEffect } from 'react'
import { dirImgUrls } from '../resources/imgUrls'

export const InputDirName = ({ inputState, setDirName }) => {
  const [inputValue, setInputValue] = useState('')
  const { openFolder, folder } = dirImgUrls

  const handleFocus = (event) => event.target.select()
  
  const handleInput = (e) => {
    setInputValue(e.target.value)
    setDirName(e.target.value)
  }

  useEffect(() => {
    setInputValue('New Dir')
  },[inputState])

  return (
    <>
      { inputState
        ? <>
            <img src={openFolder} />
            <input 
                onChange={handleInput}
                onFocus={handleFocus}
                value={inputValue}
                className='input_create_dir'
                autoComplete='of'
                autoFocus/>
          </>
        : <>
            <img src={folder}/>
            <p className="name_dir name_create_dir">Create dir</p>
          </>
      }
    </>
  )
}
