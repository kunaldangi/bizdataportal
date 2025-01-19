"use client";
import "./style.css";

import Image from "next/image";
import { useEffect, useState } from "react";

import { AlignJustify } from 'lucide-react';

function closeIndexBar(){
    let indexBar = document.getElementById("home__indexbar--display") as HTMLElement;
    indexBar.style.width = "0px";
    indexBar.style.opacity = "0";
    indexBar.style.padding = "0px";
}

function openIndexBar(){
    let indexBar = document.getElementById("home__indexbar--display") as HTMLElement;
    indexBar.style.width = "180px";
    indexBar.style.opacity = "1";
    indexBar.style.padding = "10px";
}

let isIndexBarOpen = false;
export function Navbar() {
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const handleResize = () => {
        if(window.innerWidth <= 768){
            if(isIndexBarOpen){
                closeIndexBar();
                isIndexBarOpen = false;
            }
            setIsSmallScreen(true);
        }
        else{
            setIsSmallScreen(false);
            openIndexBar();
            let indexBar = document.getElementById("home__indexbar--display") as HTMLElement;
            indexBar.style.position = "relative";
            isIndexBarOpen = true;
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
        if(isIndexBarOpen){
            closeIndexBar();
            isIndexBarOpen = false;
        }
        else{
            openIndexBar();
            if(isSmallScreen){
                let indexBar = document.getElementById("home__indexbar--display") as HTMLElement;
                indexBar.style.position = "absolute";
                indexBar.style.height = "calc(100vh - 75px)";
            }
            
            isIndexBarOpen = true;
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