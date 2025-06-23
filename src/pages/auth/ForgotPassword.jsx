import { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { showToast } from '../../components/Schema';
import { clearErrors, forgotPassword, setEmailData } from "../../slices/authSlice";
import DOMPurify from 'dompurify';


const ForgotPassword = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { fopaLoading, fopaErrors, fopaError } = useSelector((state) => state.auth);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        role: ''
    });

    //form signup
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        dispatch(clearErrors());
    };

    const getForgotError = (field) => Array.isArray(fopaErrors) ? fopaErrors.find(error => error.path === field) : null;
    const emailError = getForgotError('email');

    const handleForgot = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        if (emailError) {
            showToast('error', 'Please fix the errors before submitting the form!');
            return;
        }
        setIsSubmitting(true);
        try {
            const userData = {
                email: DOMPurify.sanitize(formData.email)
            };
            const response = await dispatch(forgotPassword(userData)).unwrap();

            if (response.status) {
                dispatch(setEmailData({
                    email: userData.email
                }));
                showToast('success', `${response.message}`);
                navigate('/new-password');
            }
        } catch (error) {
            showToast('error', 'Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        dispatch(clearErrors());
    }, [dispatch]);


    return (
        <Fragment>
            <Helmet>
                <title>Forgot Password | Justdate</title>
                <meta name="description" content="Forgot your password? Enter your email address to receive a One-Time Password (OTP) and reset your account securely on justdate. Regain access to exclusive deals and a seamless shopping experience." />
                <link rel="canonical" href="https://justdate.netlify.app/forgot-password" />
            </Helmet>

            <div className='page flex center' style={{ height: '100vh' }}>
                <form className="authBox flexcol center" onSubmit={handleForgot}>
                    <h1 className="heading">Forgot Password?</h1>

                    <input type="email" name='email' autoComplete='email' placeholder='Enter your email...' value={formData.email} onChange={handleChange} />
                    {emailError && <p className="error">{emailError.msg}</p>}

                    <div className='minBox flexcol center'>
                        <button type="submit" disabled={isSubmitting || fopaLoading}>{(isSubmitting || fopaLoading) ? 'Sending...' : 'Send OTP'}</button>
                        {fopaError && <p className="error">{fopaError}</p>}
                        <Link to="/login" className='text'>Go Back</Link>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}

export default ForgotPassword