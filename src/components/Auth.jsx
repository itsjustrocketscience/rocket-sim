// src/components/Auth.jsx
import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError(''); // Clear past errors
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message); // Show Firebase errors to the user
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', backgroundColor: '#2b2b36', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', color: '#4da8da' }}>
        {isLogin ? 'Pilot Login' : 'Register Pilot'}
      </h2>
      
      {error && (
        <div style={{ backgroundColor: '#ff4d4d', color: '#fff', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Pilot Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: 'none' }}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: 'none' }}
          required 
        />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#4da8da', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isLogin ? 'Initiate Launch Sequence (Login)' : 'Create Credentials'}
        </button>
      </form>

      <div style={{ margin: '20px 0', textAlign: 'center', color: '#aaa' }}>OR</div>

      <button onClick={handleGoogleAuth} style={{ width: '100%', padding: '12px', backgroundColor: '#fff', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
        Sign in with Google
      </button>

      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#aaa' }}>
        {isLogin ? "No pilot record? " : "Already registered? "}
        <span 
          style={{ color: '#4da8da', cursor: 'pointer', textDecoration: 'underline' }} 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Create one here.' : 'Login here.'}
        </span>
      </p>
    </div>
  );
}