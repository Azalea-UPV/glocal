import { useTranslation } from "react-i18next";

function LanguageButton({code}){
    const { _, i18n } = useTranslation()
    const current_language =  i18n.language || window.localStorage.i18nextLng;

    function changeLanguage() {
        i18n.changeLanguage(code)
    }

    return (
        <div style={{cursor: "pointer", color: current_language == code? 'black': 'gray'}} onClick={changeLanguage} >
            {code}
        </div>
    )
}

function LanguageButtons() {
    const languages = ["en", "es", "val"]
    return (
        <div style={{display: 'flex', flex: 'wrap', flexDirection: 'row', gap: '10px'}}>
            {languages.map((code) => <LanguageButton code={code} key={code} />)}
        </div>
    )
}

export default LanguageButtons;