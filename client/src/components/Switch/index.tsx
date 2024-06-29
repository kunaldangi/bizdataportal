import "./style.css";
import { ChangeEvent, useEffect } from "react";

export function Switch({check, switchId, disabled, switchClass = "switch", sliderClass = "slider round", onSwitchChange = (e)=>{} }: {check: boolean,switchId: string, disabled: boolean, switchClass: string, sliderClass: string, onSwitchChange: (e: ChangeEvent) => void}){
    useEffect(() => {
        let switchElement = document.getElementById(switchId) as HTMLInputElement;
        switchElement.checked = check;
    }, [check]);

    return(<>
        <label className={switchClass}>
            <input type="checkbox" id={switchId} disabled={disabled} onChange={(e)=>{onSwitchChange(e)}} />
            <span className={sliderClass}></span>
        </label>
    </>)
}