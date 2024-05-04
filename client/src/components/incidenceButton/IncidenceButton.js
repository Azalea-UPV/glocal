import './incidenceButton.css'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

function IncidenceButton({onClick}) {

    return (
        <div className='incidenceButton' onClick={onClick}>
            <PriorityHighIcon />
        </div>
    )
}

export default IncidenceButton;