
function Marker({ color, size }) {
    if (!color) {
        color = 'black';
    }
    const markerSize = size || 40;

    return (
        <svg width={markerSize} height={markerSize} xmlns="http://www.w3.org/2000/svg">
            <circle cx={markerSize / 2} cy={markerSize / 2} r={markerSize / 4.5} stroke={color} strokeWidth={markerSize / 6} fill="none" />
            <circle cx={markerSize / 2} cy={markerSize / 2} r={(markerSize / 2) - (markerSize / 10)} stroke={color} strokeWidth={markerSize / 50} fill="none" />
        </svg>
    );
}

export default Marker