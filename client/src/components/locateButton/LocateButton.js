import RoomIcon from '@mui/icons-material/Room';

const style = {
    backgroundColor: 'white',
    color: 'black',
    padding: '5px',
    borderRadius: '50px',
    cursor: 'pointer',
    fontSize: '1.5em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
}


function LocateButton({onClick, className}) {
    return (
        <div className={className} onClick={onClick} style={style} >
            <RoomIcon />
        </div>
    )
}

export default LocateButton;