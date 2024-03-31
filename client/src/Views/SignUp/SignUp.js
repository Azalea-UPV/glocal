import LoginButton from '../../components/loginButton/LoginButton';
import { login, signUp } from "../../logic/user";

import { useNavigate } from 'react-router';
import { useRef, useState } from "react";
import { TextField } from "@mui/material";
import { motion } from "framer-motion"
import { useTranslation } from 'react-i18next';

import './signup.css'

function SignUp() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loginOk, setLoginOk] = useState(true);
    const mailRef = useRef();
    const passRef = useRef();
    const userRef = useRef();

    function onLogin(ok) {
        if (ok) {
            navigate('/');
        }
        setLoginOk(ok);
    }

    function onClickSignUp() {
        const mail = mailRef.current.value;
        const password = passRef.current.value;
        const user = userRef.current.value;

        signUp(mail, user, password, (ok) => {
            if (ok) {
                login(mail, password, onLogin);
            }
            setLoginOk(ok);
        });
    }

    function onKeyUpPassword(e) {
        if (e.key === 'Enter') {
            onClickSignUp();
        }
    }

    return (            
        <motion.div className='loginBackground'       
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5 }}
        >
            <div className='loginContainer'>
                <div style={{marginBottom: '20px', fontWeight: 'bold', fontSize: '1.5em'}}>{t('register')}</div>
                <TextField variant="outlined" inputRef={userRef} label={t('username')}/>
                <TextField variant="outlined" inputRef={mailRef} label={t('email')}/>
                <TextField variant="outlined" inputRef={passRef} label={t('password')} type="password" onKeyUp={onKeyUpPassword}/>
                {loginOk || <>Error en login</>}
                <div style={{marginTop: '30px'}}><LoginButton onClick={onClickSignUp}/></div>
            </div>
        </motion.div>
    )    
}

export default SignUp;