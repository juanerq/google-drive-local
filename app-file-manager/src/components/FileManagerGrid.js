import { useState } from 'react'

import Directory from '../components/Directory' 
import { CreateDir } from './CreateDir'
import PathBack from './PathBack'
import { useFetchDirs } from '../hooks/useFetchDirs'
import PopupUploadFiles from './PopupUploadFiles'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileArrowUp } from '@fortawesome/free-solid-svg-icons'

import '../styles/popup.css'


const PopupShowImg = ({ showImg, setShowImg }) => {
  
  const { url, name } = showImg

  const closeShowImg = ({ target }) => {
    if(target.className === 'background' || target.className === 'popup-show-img')
      setShowImg({ url:'', name:'' })
  }

  return (
    <div className='background'
      onClick={closeShowImg}>
      <div id='cotainer-popup' className='popup-show-img'>
        <img src={url} alt={name}/> 
      </div>
    </div>
  )
}


const FileManagerGrid = ({ path, setPath }) => {
  const [result, setNewDir] = useFetchDirs( path )
  const [popupStatus, setPopupStatus] = useState(false)
  const [showImg, setShowImg] = useState({
    url: '',
    name: ''
  })
  
  let { data, loading } = result

  const changePath = (path) => {
    result.data = {}
    result.loading = true
    setPath(path)
  }

  const showPopup = () => {
    const fileManager = document.querySelector('.container_file_manager')
    fileManager.style.overflow = 'hidden'
    setPopupStatus(true)
  }

  return (
    <div className='container_file_manager'>

      <div className='actions'>
        { path
          ? <PathBack setPath={changePath}/>
          : <span></span>
        }
        <button className='action-upload-files'
          onClick={showPopup}>
          <FontAwesomeIcon icon={faFileArrowUp}/> Upload files
        </button>
      </div>

      { popupStatus
        ? <PopupUploadFiles path={path} setNewDir={setNewDir} setPopupStatus={setPopupStatus}/>
        : ''
      }
      {
        showImg.url
        ? <PopupShowImg showImg={showImg} setShowImg={setShowImg}/>
        : ''
      }

      { !loading
        ? 
        <div className='container_dirs'>
          <CreateDir path={path} setNewDir={setNewDir}/>
          {
            Object.entries(data.content)
              .map(([name, content]) => (
                <Directory 
                  key={name} 
                  name={name} 
                  data={content} 
                  path={path}
                  setPath={changePath}
                  setShowImg={setShowImg}
                />
              ))
          }
        </div>
        :
        ''
      }
    </div>
  )
}

export default FileManagerGrid
