import React, {useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../UserContext'; // Adjust the path if necessary

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {login } = useAuth();


  async function handlogin(ev) {
    ev.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const userInfo = await response.json();
        console.log(userInfo);
        login(userInfo);
        setRedirect(true);
      } else {
        alert('Wrong credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Failed to login. Please try again later.');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form className="login" onSubmit={handlogin}>
      <h1>Login</h1>
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
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginPage;

