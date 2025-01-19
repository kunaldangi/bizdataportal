import "./style.css";

import { X } from 'lucide-react';

export function SuccessBox({success, closeSuccess}: {success: string, closeSuccess: () => any}){
    return (<div className="compSuccessBox__main">
        <span className="compSuccessBox__msg">{success}</span>
        <span className="compSuccessBox__close" onClick={closeSuccess}><X size={18}/></span>
    </div>)
}