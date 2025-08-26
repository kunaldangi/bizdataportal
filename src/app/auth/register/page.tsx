import './style.css';

import Image from 'next/image';

import { DividerLine } from '@/components/Divider';

import { RegisterForm } from './_components/RegisterButton';
import { GotoLogin } from './_components/GotoLogin';

export default function Page() {
    return (<>
        <div className="main">
            <div className="main__container--register">
                <div className="main__logo">
                    <Image src={"/biz-logo.svg"} width={100} height={100} alt='logo' priority={true} />
                </div>
                <RegisterForm />
                <DividerLine boxClass='main__dividerBox' lineClass='main__dividerLine'><div className='main__dividerText'> OR </div></DividerLine>
                <GotoLogin />
            </div>
        </div>
    </>);
}