import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom'
import './personButton.css'

function PersonButton({route}) {
    return (
        <Link to={route}>
            <PersonIcon className={'personButton'} />
        </Link>
    )
}

export default PersonButton;