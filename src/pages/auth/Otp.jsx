import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { verifyOtp, deleteUser, signupUser } from '../../slices/authSlice';

import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const Otp = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { otpErrors, signupData } = useSelector((state) => state.auth);

    // Focus management
    const otpInputs = useRef([]);
    const focusNextInput = currentIndex => {
        if (currentIndex < otpInputs.current.length - 1) {
            otpInputs.current[currentIndex + 1].focus();
        }
    };

    const [otpDigits, setOtpDigits] = useState(Array(6).fill(''));
    const handleInputChange = async (index, newValue) => {
        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = newValue;
        setOtpDigits(newOtpDigits);
        if (newValue !== '' && index < otpDigits.length - 1) {
            focusNextInput(index);
        }
        const isOtpComplete = newOtpDigits.every(digit => digit !== '');

        if (isOtpComplete) {
            try {
                const otpResponse = await dispatch(verifyOtp({ otp: newOtpDigits.join(''), email: signupData.email, role: signupData.role })).unwrap();

                if (otpResponse.status === 'success') {
                    toast(<div className='flex center g5'> < VerifiedIcon />{otpResponse.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'rgb(0, 189, 0)' }, className: 'success', ariaProps: { role: 'status', 'aria-live': 'polite' } });
                    navigate('/login');
                } else {
                    toast(<div className='flex center g5'> < NewReleasesIcon /> {'OTP verification failed: ' + otpResponse.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
                }
            } catch (error) {
                toast(<div className='flex center g5'> < NewReleasesIcon /> {'OTP verification failed: ' + error.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '') {
            e.preventDefault();
            if (index > 0) {
                otpInputs.current[index - 1].focus();
            }
        } else if (/^\d$/.test(e.key)) {
            e.preventDefault();
            handleInputChange(index, e.key);
            focusNextInput(index);
        }
    };

    useEffect(() => {
        otpInputs.current[0].focus();
    }, []);

    //time
    const [timeLeft, setTimeLeft] = useState(60);
    const [timerRunning, setTimerRunning] = useState(true);
    useEffect(() => {
        if (timerRunning) {
            const timerInterval = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(timerInterval);
        }
    }, [timerRunning]);
    useEffect(() => {
        if (timeLeft === 0) {
            setTimerRunning(false);
        }
    }, [timeLeft]);

    const handleResendClick = async () => {
        try {
            const formData = new FormData();
            formData.append('firstName', signupData.firstName);
            formData.append('lastName', signupData.lastName);
            formData.append('email', signupData.email);
            formData.append('password', signupData.password);
            formData.append('confirmPassword', signupData.confirmPassword);
            const deleteResponse = await dispatch(deleteUser({ email: signupData.email, password: signupData.password })).unwrap();
            if (deleteResponse.status === 'success') {
                const response = await dispatch(signupUser(formData)).unwrap();
                if (response.status === "success") {
                    toast(<div className='flex center g5'> < VerifiedIcon />{response.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'rgb(0, 189, 0)' }, className: 'success', ariaProps: { role: 'status', 'aria-live': 'polite' } });
                    setTimeLeft(60);
                    setTimerRunning(true);
                } else {
                    toast(<div className='flex center g5'> < NewReleasesIcon /> {'Signup failed: ' + response.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
                }
            } else {
                toast(<div className='flex center g5'> < NewReleasesIcon /> {deleteResponse.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
            }
        } catch (error) {
            toast(<div className='flex center g5'> < NewReleasesIcon /> {error.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
        }
    };


    return (
        <Fragment>
            <Helmet>
                <title>Verify OTP | JustDate - Find Genuine Connections Today</title>
                <meta name="description" content="JustDate is a modern dating platform designed to help you meet real people seeking meaningful relationships. Join today and start connecting with like-minded individuals for friendship, romance, or commitment." />
                <link rel="canonical" href="https://justdate.netlify.app/verify-otp" />
            </Helmet>

            <div className='page flex center' style={{height: '100vh'}}>
                <div className="authBox flexcol center">
                    <h1 className="heading">Enter the OTP sent to your email</h1>

                    <div className="flex center g20">
                        {otpDigits.map((digit, index) => (
                            <input key={index} value={digit} maxLength={1} className='otpBox'
                                ref={el => (otpInputs.current[index] = el)}
                                onChange={e => handleInputChange(index, e.target.value)}
                                onKeyDown={e => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

                    <div className='flexcol center g10'>
                        <button style={{ width: 'fit-content' }} disabled={timerRunning} className={timerRunning ? "disabled" : ""} onClick={handleResendClick}>
                            {timerRunning ? `Resend OTP in ${timeLeft}` : "Resend OTP"}
                        </button>

                        <Link to="/signup" className='hover'>Back</Link>

                        {otpErrors && <p className="error flex center">{otpErrors}</p>}
                    </div>

                </div>
            </div>
        </Fragment>
    )
}

export default Otp