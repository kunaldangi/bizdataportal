import "./style.css";
import { useEffect } from "react";

export function Switch({check, switchId, disabled, switchClass = "switch", sliderClass = "slider round" }: {check: boolean,switchId: string, disabled: boolean, size: number, switchClass: string, sliderClass: string}){
    console.log(switchClass);
    useEffect(() => {
        let switchElement = document.getElementById(switchId) as HTMLInputElement;
        switchElement.checked = check;
    }, [check]);

    return(<>
        <label className={switchClass}>
            <input type="checkbox" id={switchId} disabled={disabled} />
            <span className={sliderClass}></span>
        </label>
    </>)
}