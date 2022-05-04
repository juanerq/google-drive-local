import FileManagerGrid from './components/FileManagerGrid' 
import AddPath from './components/AddPath'
import './styles/fileManagerApp.css'
import { useState } from 'react'

const FileManagerApp = () => {
  const [ path, setPath ] = useState('')

  return (
    <div className='container'>
      <AddPath path={path} setPath={setPath}/>
      <FileManagerGrid path={path} setPath={setPath}/>
    </div>
  )
}

export default FileManagerApp
