import "./style.css";

import { CircleAlert, X } from 'lucide-react';

export function ErrorToast({error, closeError}: {error: string, closeError: () => any}){
    setTimeout(() => {
        closeError();
    }, 5000);

    return (<div className="compErrorToast__main">
        <span className="compErrorToast__icon"><CircleAlert size={18}/></span>
        <span className="compErrorToast__msg">{error}</span>
        <span className="compErrorToast__close" onClick={closeError}><X height="16px" /></span>
    </div>)
}