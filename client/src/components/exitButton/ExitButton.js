import ExitToAppIcon from '@mui/icons-material/ExitToApp';

function ExitButton({onClick}) {
    return (
        <ExitToAppIcon onClick={onClick} style={{cursor: 'pointer'}} />
    )
}

export default ExitButton;