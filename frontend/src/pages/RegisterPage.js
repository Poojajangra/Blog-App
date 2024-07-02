import React, { useState } from 'react';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function register(ev) {
    ev.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert('Registration successful');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed');
    }
  }

  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterPage;
