import React, { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { loginUser, clearErrors } from '../../slices/authSlice';
import DOMPurify from 'dompurify';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { errors, generalError } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState({
    email: '',
    password: ''
  });

  //password hide and show
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  //handlers
  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    dispatch(clearErrors());
  };

  const emailError = Array.isArray(errors) ? errors.find(error => error.path === 'email') : null;
  const passwordError = Array.isArray(errors) ? errors.find(error => error.path === 'password') : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (emailError || passwordError || generalError) {
      toast(<div className='flex center g5'> < NewReleasesIcon /> Please fix the errors in the form.</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
      return;
    }
    setIsSubmitting(true);

    try {
      const sanitizedFormValues = {
        email: DOMPurify.sanitize(formValues.email),
        password: DOMPurify.sanitize(formValues.password),
      };
      const response = await dispatch(loginUser(sanitizedFormValues)).unwrap();
      if (response.status === "success") {
        toast(<div className='flex center g5'> < VerifiedIcon /> {response.message}</div>, { duration: 3000, position: 'top-center', style: { color: 'rgb(0, 189, 0)' }, className: 'success', ariaProps: { role: 'status', 'aria-live': 'polite' } });
        navigate('/');
      }
    } catch (error) {
      toast(<div className='flex center g5'> < NewReleasesIcon /> Error logging in...</div>, { duration: 3000, position: 'top-center', style: { color: 'red' }, className: 'failed', ariaProps: { role: 'status', 'aria-live': 'polite' } });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Fragment>
      <Helmet>
        <title>Login | JustDate - Find Genuine Connections Today</title>
        <meta name="description" content="JustDate is a modern dating platform designed to help you meet real people seeking meaningful relationships. Join today and start connecting with like-minded individuals for friendship, romance, or commitment." />
        <link rel="canonical" href="https://justdate.netlify.app/login" />
      </Helmet>
      <div className='page flex center' style={{height: '100vh'}}>
        <form className="authBox flexcol center" onSubmit={handleLogin}>
          <h1 className="heading">Login to your account</h1>

          <input type="email" name='email' autoComplete='email' placeholder='Enter your email...' value={formValues.email} onChange={handleChange} />
          {emailError && <p className="error">{emailError.msg}</p>}

          <div className="wh relative password">
            <input type={passwordVisible ? "text" : "password"} className='wh' name='password' autoComplete="new-password" placeholder='Enter your password...' value={formValues.password} onChange={handleChange} />
            <span onClick={togglePasswordVisibility}>
              {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </span>
          </div>
          {passwordError && <p className="error">{passwordError.msg}</p>}

          <button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Login'}</button>
          {errors?.length > 0 && <p className="error flex center">Please correct the above errors.</p>}
          {generalError && <p className="error flex center">{generalError}</p>}
          <div className="minBox flexcol center">
            <p className="text">Don't have an account? <Link className='text hover' to='/signup'>Click here</Link></p>
            <p className="text">Now what? <Link className='text hover' to='/forgot-password'>Forgot your password again!!</Link></p>
          </div>
        </form>
      </div>
    </Fragment>
  )
};

export default Login;