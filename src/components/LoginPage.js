import {
  GoogleLogin,
  googleLogout,
  GoogleOAuthProvider,
} from '@react-oauth/google';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import brainIcon from '../assets/images/brain.png';
import '../App.css';

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (credentialResponse) => {
    console.log('Successfully logged in!:', credentialResponse);
    const decode = jwtDecode(credentialResponse.credential);
    console.log('decoded user info:', decode);
    localStorage.setItem('user', JSON.stringify(decode));
    navigate('/landingpage');
  };

  return (
    <div className='fade-in min-h-screen flex items-center justify-center bg-gradient-to-b from-[#022839] to-[#3e3656]'>
      <div className='bg-gradient-to-l from-[#94B0B7] to-[#C2C8C5] p-10 rounded-lg shadow-lg flex flex-col items-center'>
        <div className='flex items-center gap-4 mb-6'>
          <h1 className='text-5xl font-bold text-[#022839]'>AlgoPlaces</h1>
          <img
            src={brainIcon}
            alt='brain icon'
            className='h-12 w-12 object-contain '
          />
        </div>
        <h1 className='text-2xl font-bold mb-6 text-[#022839]'>Sign In</h1>
        <GoogleLogin
          onSuccess={handleLogin}
          onError={(credentialResponse) =>
            console.log('Failed to login!:', credentialResponse)
          }
        />
      </div>
    </div>
  );
}
