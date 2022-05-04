import { useState } from 'react';
import '../styles/uploadFiles.css'
import uploadFiles from '../services/uploadFiles';

import ListUploadedFiles from './ListUploadedFiles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faFileArrowUp } from '@fortawesome/free-solid-svg-icons'


const UploadFiles = ({ path, setNewDir, setPopupStatus }) => {
  const [filesList, setFilesList] = useState({})

  const filesName =  Object.entries(filesList).map(([,file]) => file.name)

  const handleOnChange = ({ target }) => {
    const files = {}
    for(const file of Object.entries(target.files)) {
      files[file[1].name] = file[1]
    }

    if(Object.keys(target.files).length > 0)
      setFilesList(filesList => ({...filesList, ...files}))

    console.log(files);
  }

  const handleSubmit = async () => {
    if(Object.keys(filesList).length > 0) {
      let formData = new FormData()

      for(const file of Object.entries(filesList)) {
        const name = file[1].name.replace(/-/g, '_')
        formData.append('files', file[1], name)
      }
      uploadFiles(path, formData)
        .then(files => {
          setNewDir(files)
          setFilesList({})
          setPopupStatus(false)
        })
        .catch(error => {
          console.log(error);
        })
    }
  }

  return (
    <div id="upload-files">
      <div className='button-upload'>
        <label>
          <FontAwesomeIcon icon={faPlus}/>
          <p>Add files</p>
          <input onChange={handleOnChange} type='file' id='upload' name='upload' multiple/>
        </label>
        <button onClick={handleSubmit}>
          <FontAwesomeIcon icon={faFileArrowUp}/> Upload
        </button>
      </div>
      <div className='file-list'>
        {
          filesName.map(name => (
            <ListUploadedFiles key={name} name={name} />
          ))
        }
      </div>


    </div>
  )
}

export default UploadFiles