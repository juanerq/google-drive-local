import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons"

const PathBack = ({ setPath }) => {
    const handleBack = () => {
        setPath(path => path.split('-').splice(0, path.split('-').length - 1).join('-'))
    }

    return (
        <button className='button_back' onClick={handleBack}>
            <FontAwesomeIcon icon={faCaretLeft} />
            <p>Back</p>
        </button>
    )
}

export default PathBack