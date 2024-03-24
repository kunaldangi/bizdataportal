export enum OTPType {
    RegisterUser = 1,
    ForgetPassword = 2,
}

export function generate_otp_code(): number {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}