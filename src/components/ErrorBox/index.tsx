import "./style.css";

import { X } from 'lucide-react';

export function ErrorBox({error, closeError}: {error: string, closeError: () => any}){
    return (<div className="compErrorBox__main">
        <span className="compErrorBox__msg">{error}</span>
        <span className="compErrorBox__close" onClick={closeError}><X size={18}/></span>
    </div>)
}