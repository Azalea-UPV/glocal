import SettingsIcon from '@mui/icons-material/Settings';

function ConfigButton({onClick}) {
    return (
        <SettingsIcon onClick={onClick} style={{'cursor': 'pointer'}} />
    )
}

export default ConfigButton;