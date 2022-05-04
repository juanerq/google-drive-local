import UploadFiles from './UploadFiles'
import '../styles/popup.css'

const PopupUploadFiles = ({ path, setNewDir, setPopupStatus }) => {
  const fileManager = document.querySelector('.container_file_manager')
  
  const closePopup = ({ target }) => {
    if(target.className === 'background') {
      fileManager.style.overflow = ''
      setPopupStatus(false)
    }
  }

  const hidePopup = () => {
    fileManager.style.overflow = ''
    setPopupStatus(false)
  }

  return (
    <div className='background'
      onClick={closePopup}>
      <div id='cotainer-popup'>
        <UploadFiles path={path} setNewDir={setNewDir} setPopupStatus={hidePopup}/>
      </div>
    </div>
  )
}

export default PopupUploadFiles