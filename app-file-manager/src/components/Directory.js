import { useState } from "react"
import '../styles/directory.css'
import { searchFileType } from '../resources/imgUrls'

const Directory = ({ name = '', setPath, data, path, setShowImg }) => {
    const [openDir, setOpenDir] = useState(false)
    const dirImg = searchFileType(name, true, openDir)

    let fileImg = searchFileType(name)
    fileImg = fileImg === 'img' 
        ? `http://192.168.1.5:8080/img/${path}-${name}`
        : fileImg

    const handleClick = () => {
        setPath(path => `${path}${path ? '-' : ''}${name}`)
    }

    const openFile = ({target}) => {
        let isImg = searchFileType(target?.alt || target?.innerHTML)
        if(isImg === 'img')
            setShowImg({
                url: fileImg,
                name
            })
    }

    return (
    <>  { Array.isArray(data) 
        ?
            <div className="directory"
                onClick={ handleClick }
                onMouseEnter={ () => setOpenDir(true) }
                onMouseLeave={ () => setOpenDir(false) }>
                <img src={dirImg} alt={name} />
                <p className="name_dir">{name}</p>
            </div>
        :
            <div className="directory">
                <div>
                    <img onClick={openFile} src={fileImg} alt={name}/> 
                </div>
                <p onClick={openFile} className="name_dir">{name}</p>
            </div>
        }   
    </>
    )
}

export default Directory