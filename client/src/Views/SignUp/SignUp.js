import LoginButton from '../../components/loginButton/LoginButton';
import { getCaptcha, signUp } from "../../logic/user";
import { useNavigate } from 'react-router';
import { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";
import { motion } from "framer-motion"
import { useTranslation } from 'react-i18next';
import ReplayIcon from '@mui/icons-material/Replay';

import './signup.css'

function SignUp() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState();
    const [captchaSrc, setCaptchaSrc] = useState('');
    const mailRef = useRef();
    const passRef = useRef();
    const userRef = useRef();
    const captchaRef = useRef();

    function reloadCaptcha() {
        setCaptchaSrc(getCaptcha());
    }

    useEffect(function() {
        reloadCaptcha();
    }, []);

    function onClickSignUp() {
        const mail = mailRef.current.value;
        const password = passRef.current.value;
        const user = userRef.current.value;
        const captcha = captchaRef.current.value;

        signUp(mail, user, password, captcha, (response) => {
            if (response === true) {
                navigate('/');
            } else {
                reloadCaptcha();
                setLoginError(t(`error_${response['error']}`));
            }
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
                <TextField variant="outlined" inputRef={passRef} label={t('password')} type="password"/>
                <TextField variant="outlined" inputRef={passRef} label={t('confirm_password')} type="password"/>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'end'}}>
                    <img src={captchaSrc} style={{maxWidth: '100%'}}/>
                    <ReplayIcon onClick={reloadCaptcha} style={{cursor: 'pointer'}}/>
                </div>
                <TextField variant="outlined" inputRef={captchaRef} label={t('type_captcha')} onKeyUp={onKeyUpPassword}/>
                {loginError || <>{loginError}</>}
                <div style={{marginTop: '30px'}}><LoginButton onClick={onClickSignUp}/></div>
            </div>
        </motion.div>
    )    
}

export default SignUp;