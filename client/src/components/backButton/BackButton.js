import { useNavigate } from "react-router";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function BackButton({className, onClick}) {
    const navigate = useNavigate();

    return (
        <ArrowBackIcon className={className} style={{'cursor': 'pointer'}} onClick={onClick? onClick : () => navigate(-1)}/>
    )
}

export default BackButton;