import React, { Fragment, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearErrors } from '../../slices/authSlice';
import { showToast } from '../../components/Schema';
import DOMPurify from 'dompurify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logLoading, logError, logErrors } = useSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const getFieldError = (field) => Array.isArray(logErrors) ? logErrors.find(error => error.path === field) : null;
  const emailError = getFieldError('email');
  const passwordError = getFieldError('password');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (emailError || passwordError) {
      showToast('error', 'Please fix the errors before submitting the form!');
      return;
    }
    setIsSubmitting(true);

    try {
      const userData = {
        email: DOMPurify.sanitize(formValues.email),
        password: DOMPurify.sanitize(formValues.password),
      };
      const response = await dispatch(loginUser(userData)).unwrap();

      if (response.status === "success") {
        showToast('success', `${response.message}`);
        navigate('/');
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
        <title>Login | JustDate - Find Genuine Connections Today</title>
        <meta name="description" content="JustDate is a modern dating platform designed to help you meet real people seeking meaningful relationships. Join today and start connecting with like-minded individuals for friendship, romance, or commitment." />
        <link rel="canonical" href="https://justdate.netlify.app/login" />
      </Helmet>
      <div className='page flex center' style={{ height: '100vh' }}>
        <form className="authBox flexcol center" onSubmit={handleLogin}>
          <h1 className="heading">Login to your account</h1>

          <input type="email" name='email' autoComplete='email' placeholder='Enter your email...' value={formValues.email} onChange={handleChange} />
          {emailError && <p className="error">{emailError.msg}</p>}

          <div className="wh relative password">
            <input type={passwordVisible ? "text" : "password"} className='wh' name='password' autoComplete="current-password" placeholder='Enter your password...' value={formValues.password} onChange={handleChange} />
            <span onClick={togglePasswordVisibility}>
              {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </span>
          </div>
          {passwordError && <p className="error">{passwordError.msg}</p>}

          <button type='submit' disabled={isSubmitting || logLoading}>{(isSubmitting || logLoading) ? 'Loging...' : 'Login'}</button>
          {logError && <p className="error flex center">{logError}</p>}

          <div className="minBox flexcol center">
            <p className="text">Don't have an account? <Link className='text hover' to='/signup'>Click here</Link></p>
            <p className="text">Forgot your password? <Link className='text hover' to='/forgot-password'>Click here</Link></p>
          </div>
        </form>
      </div>
    </Fragment>
  )
};

export default Login;