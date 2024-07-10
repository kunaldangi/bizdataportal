import "./style.css";
import { ChangeEvent} from "react";

export function Switch({check, switchId, disabled, switchClass = "switch", sliderClass = "slider round", onSwitchChange = (e)=>{} }: {check: boolean,switchId: string, disabled: boolean, switchClass: string, sliderClass: string, onSwitchChange: (e: ChangeEvent) => void}){
    return(<>
        <label className={switchClass}>
            <input type="checkbox" id={switchId} disabled={disabled} onChange={(e)=>{onSwitchChange(e)}} checked={check} />
            <span className={sliderClass}></span>
        </label>
    </>)
}