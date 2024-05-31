import otpGenerator from 'otp-generator';

export const generateOtp = (digit: number) => {
    return otpGenerator.generate(digit, {
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: true,
    });
};
