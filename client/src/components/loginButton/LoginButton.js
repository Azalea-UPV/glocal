import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

function LoginButton({ onClick, loginOk }) {
    const [showCross, setShowCross] = useState(false);

    useEffect(() => {
        setShowCross(loginOk <= 0);
        setTimeout(() => setShowCross(false), 3 * 1000);
    }, [loginOk]);

    return (
        <motion.div
            onClick={onClick}
            style={{
                padding: '20px',
                backgroundColor: '#ebebeb',
                borderRadius: '40%',
                border: '1px solid black',
                cursor: 'pointer',
            }}
            whileHover={{ scale: 1.1 }} // Escala aumenta al pasar el mouse
            whileTap={{ scale: 0.9 }} // Escala disminuye al hacer clic
        >
            {!showCross && <ArrowForwardIcon style={{ fontSize: '2em' }} />}
            {showCross && (
                <motion.div
                    animate={{ scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                    <CloseIcon style={{ fontSize: '2em', color: 'red' }} />
                </motion.div>
            )}
        </motion.div>
    );
}

export default LoginButton;
