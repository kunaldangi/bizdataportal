"use client";
import "./style.css";

import { AlignJustify } from 'lucide-react';
import Image from "next/image";
import { useEffect, useState } from "react";

let isIndexBarOpen = false;
export function Navbar() {
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    
    const handleResize = () => {
        let indexBar = document.querySelector(".home__indexbar") as HTMLElement;
        if(window.innerWidth <= 768){
            if(!isIndexBarOpen) indexBar.style.display = 'none'; // if index bar is open, don't show it
            setIsSmallScreen(true);
        } 
        else{
            indexBar.style.display = 'block';
            setIsSmallScreen(false);
        }
    };

    useEffect(() => {
        handleResize(); // initial check
        window.addEventListener('resize', handleResize); // listen for resize event

        return () => { // clean up
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function handleShowIndexBar() {
        let indexBar = document.querySelector(".home__indexbar") as HTMLElement;
        let display = window.getComputedStyle(indexBar).display;
        if(display === 'block') {
            indexBar.style.display = 'none';
            isIndexBarOpen = false;
            return;
        }
        if(display === 'none'){
            indexBar.style.display = 'block';
            isIndexBarOpen = true;
            return;
        }
    }

    return (
        <div className="home__navbar">
            <div className="navbar__logo">
                {isSmallScreen ? <AlignJustify width={40} height={40} onClick={handleShowIndexBar} /> : <Image src="/biz-logo-white.png" alt="Logo" width={60} height={60} /> }
            </div>
            <div className="navbar__profile">
                <span>GA</span>
            </div>
        </div>
    );
}