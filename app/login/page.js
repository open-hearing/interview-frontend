'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:8080';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleLoginSubmit(submitEvent) {
    submitEvent.preventDefault();
    setMessage('');
    const response = await fetch(API_BASE_URL + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password }),
    });
    const loginResult = await response.json();
    if (loginResult.authenticated === false) {
      setMessage(loginResult.message);
      return;
    }
    localStorage.setItem('sessionToken', loginResult.sessionToken);
    localStorage.setItem('username', loginResult.username);
    localStorage.setItem('password', password);
    localStorage.setItem('fullName', loginResult.fullName);
    localStorage.setItem('role', loginResult.role);
    router.push('/dashboard');
  }

  return (
    <main className="login-shell">
      <div className="card">
        <h1>User Portal</h1>
        <p className="subtitle">Sign in to manage users and family details.</p>
        <form onSubmit={handleLoginSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={username}
            onChange={(changeEvent) => setUsername(changeEvent.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(changeEvent) => setPassword(changeEvent.target.value)}
          />
          <button type="submit">Sign in</button>
        </form>
        {message ? <p className="notice" style={{ marginTop: 16 }}>{message}</p> : null}
        <p className="notice" style={{ marginTop: 20, marginBottom: 0 }}>
          Seeded administrator account: admin / password
        </p>
      </div>
    </main>
  );
}
