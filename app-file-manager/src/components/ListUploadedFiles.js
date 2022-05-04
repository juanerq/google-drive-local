import { searchFileType } from '../resources/imgUrls';

const ListUploadedFiles = ({ name }) => {

  let fileImg = searchFileType(name)
    fileImg = fileImg === 'img' 
        ? 'https://img.icons8.com/fluency/96/000000/image.png'
        : fileImg

  return (
    <div className='uploaded-file'>
      <img src={fileImg} arl={name}/>
      <p>{name}</p>
      <img src='https://img.icons8.com/color/480/000000/delete.png' arl={name}/>
    </div>
  )
}

export default ListUploadedFiles