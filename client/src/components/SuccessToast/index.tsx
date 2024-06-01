import "./style.css";

import { CircleCheck, X } from 'lucide-react';

export function SuccessToast({success, closeSuccess}: {success: string, closeSuccess: () => any}){
    setTimeout(() => {
        closeSuccess();
    }, 5000);

    return (<div className="compSuccessToast__main compSuccessToast__main--show">
        <span className="compSuccessToast__icon"><CircleCheck size={18}/></span>
        <span className="compSuccessToast__msg">{success}</span>
        <span className="compSuccessToast__close" onClick={closeSuccess}><X height="16px" /></span>
    </div>)
}