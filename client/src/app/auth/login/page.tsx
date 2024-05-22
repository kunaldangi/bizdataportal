import './style.css';

import Image from 'next/image';

import { DividerLine } from '@/components/Divider';

import { LoginButton } from './_components/LoginButton';
import { GotoRegister } from './_components/GotoRegister';

export default function Page() {
    return (<>
        <div className="main">
            <div className="main__container">
                <div className="main__logo">
                    <Image src={"/biz-logo.svg"} width={100} height={100} alt='logo' priority={true} />
                </div>
                <div className="main__title">Welcome Back!</div>
                <div className="main__form">
                    <input type="email" id="loginId__email" placeholder='Email' className='main__form--email' />
                    <input type="password" id="loginId__pwd" placeholder='Password' className='main__form--password' />
                    <LoginButton url={process.env.BACKEND_URL} />
                </div>
                <DividerLine boxClass='main__dividerBox' lineClass='main__dividerLine'><div className='main__dividerText'> OR </div></DividerLine>
                <GotoRegister />
            </div>
        </div>
    </>);
}