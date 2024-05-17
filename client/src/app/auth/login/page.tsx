import './style.css';

import Image from 'next/image';

import { LoginButton } from './LoginButton';

export default function Page() {
    return (<>
        <div className="main">
            <div className="main__container">
                <div className="main__logo">
                    <Image src={"/biz-logo.svg"} width={100} height={100} alt='' />
                </div>

                <div className="main__title">Welcome Back!</div>
                <div className="main__form">
                    <input type="email" name="" id="" placeholder='Email' className='main__form--email' />
                    <input type="password" name="" id="" placeholder='Password' className='main__form--password' />
                    <LoginButton />
                </div>
            </div>
        </div>
    </>);
}