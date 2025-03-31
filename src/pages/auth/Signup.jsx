import React, { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearErrors, setSignupData } from '../../slices/authSlice';
import { showToast } from '../../components/Schema';
import DOMPurify from 'dompurify';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const Signup = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signLoading, signErrors, signError } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  //password hide and show
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [conPasswordVisible, setConPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleConPasswordVisibility = () => {
    setConPasswordVisible(!conPasswordVisible);
  };

  //handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    dispatch(clearErrors());
  };

  const getFieldError = (field) => Array.isArray(signErrors) ? signErrors.find(error => error.path === field) : null;
  const firstNameError = getFieldError('firstName');
  const lastNameError = getFieldError('lastName');
  const emailError = getFieldError('email');
  const passwordError = getFieldError('password');
  const confirmPasswordError = getFieldError('confirmPassword');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (firstNameError || lastNameError || emailError || passwordError || confirmPasswordError) {
      showToast('error', 'Please fix the errors before submitting the form!');
      return;
    }
    setIsSubmitting(true);

    try {
      const userData = {
        firstName: DOMPurify.sanitize(formValues.firstName),
        lastName: DOMPurify.sanitize(formValues.lastName),
        email: DOMPurify.sanitize(formValues.email),
        password: DOMPurify.sanitize(formValues.password),
        confirmPassword: DOMPurify.sanitize(formValues.confirmPassword),
      };

      const response = await dispatch(signupUser(userData)).unwrap();
      if (response.status === "success") {
        dispatch(setSignupData({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
        }));
        showToast('success', `${response.message}`);
        navigate('/verify-otp');
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
        <title>Signup | JustDate - Find Genuine Connections Today</title>
        <meta name="description" content="JustDate is a modern dating platform designed to help you meet real people seeking meaningful relationships. Join today and start connecting with like-minded individuals for friendship, romance, or commitment." />
        <link rel="canonical" href="https://justdate.netlify.app/signup" />
      </Helmet>
      <div className='page flex center' style={{ height: '100vh' }}>
        <form className="authBox flexcol center" onSubmit={handleSignup}>
          <h1 className="heading">Create your account</h1>

          <div className="minBox flexcol center">
            <input type="text" name='firstName' autoComplete="given-name" placeholder='Enter your first name...' value={formValues.firstName} onChange={handleChange} />
            {firstNameError && <p className="error">{firstNameError.msg}</p>}
          </div>
          <div className="minBox flexcol center">
            <input type="text" name='lastName' autoComplete="family-name" placeholder='Enter your last name...' value={formValues.lastName} onChange={handleChange} />
            {lastNameError && <p className="error">{lastNameError.msg}</p>}
          </div>
          <div className="minBox flexcol center">
            <input type="email" name='email' autoComplete='email' placeholder='Enter your email...' value={formValues.email} onChange={handleChange} />
            {emailError && <p className="error">{emailError.msg}</p>}
          </div>
          <div className="minBox flexcol center">
            <div className="wh relative password">
              <input type={passwordVisible ? "text" : "password"} style={{ textTransform: 'none' }} className='wh' name='password' autoComplete="new-password" placeholder='Enter your password...' value={formValues.password} onChange={handleChange} />
              <span onClick={togglePasswordVisibility}>
                {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
            {passwordError && <p className="error">{passwordError.msg}</p>}
          </div>
          <div className="minBox flexcol center">
            <div className="wh relative password">
              <input type={conPasswordVisible ? "text" : "password"} style={{ textTransform: 'none' }} className='wh' name="confirmPassword" autoComplete="confirm-password" placeholder='Enter your password again...' value={formValues.confirmPassword} onChange={handleChange} />
              <span onClick={toggleConPasswordVisibility}>
                {conPasswordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </span>
            </div>
            {confirmPasswordError && <p className="error">{confirmPasswordError.msg}</p>}
          </div>

          <button type='submit' disabled={isSubmitting || signLoading}>{(isSubmitting || signLoading) ? 'Signing...' : 'Signup'}</button>
          {signError && <p className="error flex center">{signError}</p>}
          <p className="text">Already have an account? <Link className='text hover' to='/login'>Click here</Link></p>
        </form>
      </div>
    </Fragment>
  )
};

export default Signup;