import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

//components
import Loader from './components/Loader/Loader';
const Protector = lazy(() => import('./components/Protector'));
const Layout = lazy(() => import('./components/Layout'));

//public
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const Otp = lazy(() => import('./pages/auth/Otp'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const VerifyPassword = lazy(() => import('./pages/auth/VerifyPassword'));

//private
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/auth/Profile'));
const Chats = lazy(() => import('./pages/social/Chats'));
const Chat = lazy(() => import('./pages/social/Chat'));
const Likes = lazy(() => import('./pages/social/Likes'));



function App() {

  const user = useSelector((state) => state.auth.user);

  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Toaster />
        <Routes>

          {/* private */}
          <Route element={<Protector user={user} />}>
            <Route path='/' element={<Layout><Home /></Layout>} />
            <Route path='/discover' element={<Layout><Home /></Layout>} />
            <Route path='/profile' element={<Layout><Profile /></Layout>} />
            <Route path='/likes' element={<Layout><Likes /></Layout>} />
            <Route path='/chats' element={<Layout><Chats /></Layout>} />
            <Route path='/chat/:receiverId' element={<Layout><Chat /></Layout>} />
          </Route>

          {/* public */}
          <Route element={<Protector user={!user} redirect='/' />}>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/verify-otp' element={<Otp />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/new-password' element={<VerifyPassword />} />
          </Route>

          {/* both */}
          <Route path='/loader' element={<Loader />} />

          {/* not found */}
          <Route path='*' element={<div className='page flex center wh'>Are you kidding me? Kuchh bhi!</div>} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;