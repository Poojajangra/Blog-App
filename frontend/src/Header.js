import React, {useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './UserContext';

function Header() {
  const { user, login, logout } = useAuth();

  useEffect(() => { // Debugging line
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    })
    .then(response => response.json())
    .then(userInfo => {
      login(userInfo);
    })
    .catch(error => {
      console.error('Error fetching profile:', error);
    });
  }, []);

  function handlogout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    }).then(() => {
      logout();
    }).catch(error => {
      console.error('Error during logout:', error);
    });
  }

  const username = user?.username;

  return (
    <header>
      <Link to="/" className="logo">NutriVerse</Link>
      <nav>
        {username ? (
          <>
            <Link to="/create">Create New Post</Link>
            <a onClick={handlogout}>LogOut</a>     
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;


