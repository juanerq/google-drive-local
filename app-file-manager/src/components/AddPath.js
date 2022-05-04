import { useState, useEffect } from 'react'

const AddPath = ({ setPath, path }) => {
  const [inputValue, setInputValue] = useState(path)

  const handleInputValue = (e) => {
    setInputValue(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setPath(inputValue)
  }

  useEffect(() => {
    setInputValue(path.replace(/-/g,'/'))
  }, [path])

  return (
    <form onSubmit={ handleSubmit } className='form_addpath'>
      <input 
        type="text"
        value={ inputValue }
        onChange={ handleInputValue }
      />
    </form>
  )
}

export default AddPath