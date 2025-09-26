import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface AuthModalProps {
  closeModal: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ closeModal }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetch('/db.json');
        if (!response.ok) throw new Error('Network response was not ok.');
        const data: { users: User[] } = await response.json();
        const baseUsers = data.users;

        const storedUsers: User[] = JSON.parse(localStorage.getItem('cryptoUsers') || '[]');
        const newUsers = storedUsers.filter(storedUser =>
            !baseUsers.some(baseUser => baseUser.id === storedUser.id)
        );

        const allUsers = [...baseUsers, ...newUsers];
        setUsers(allUsers);
        localStorage.setItem('cryptoUsers', JSON.stringify(allUsers));
      } catch (error) {
        console.error('Failed to load user data:', error);
        const storedUsers = localStorage.getItem('cryptoUsers');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            const defaultUsers = [{id: 1, fullName: "Demo User", email: "demo@example.com", password: "password123", phone: "123-456-7890", total_account_balance: 10000, investment_balance: 0, investments: []}];
            setUsers(defaultUsers);
            localStorage.setItem('cryptoUsers', JSON.stringify(defaultUsers));
        }
      }
    };
    loadInitialData();
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        alert('Login successful!');
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = '/dashboard';
    } else {
        alert('Invalid email or password.');
    }
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const phone = formData.get('phone') as string;

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    if (users.find(u => u.email === email)) {
        alert('User with this email already exists.');
        return;
    }

    const newUser: User = {
        id: users.length + 1,
        fullName,
        email,
        password,
        phone,
        total_account_balance: 0,
        investment_balance: 0,
        investments: [],
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('cryptoUsers', JSON.stringify(updatedUsers));

    alert('Sign up successful! Logging you in.');
    sessionStorage.setItem('loggedInUser', JSON.stringify(newUser));
    window.location.href = '/dashboard';
  };

  const loginForm = (
    <div className="modal-content">
        <span className="close-button" onClick={closeModal}>&times;</span>
        <h2>Login</h2>
        <form id="login-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required defaultValue="demo@example.com" />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required defaultValue="password123" />
            <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="#" onClick={(e) => {e.preventDefault(); setIsLogin(false);}}>Sign Up</a></p>
    </div>
  );

  const signupForm = (
    <div className="modal-content">
        <span className="close-button" onClick={closeModal}>&times;</span>
        <h2>Sign Up</h2>
        <form id="signup-form" onSubmit={handleSignup}>
            <label htmlFor="fullName">Full Name:</label>
            <input type="text" id="fullName" name="fullName" required />
            <label htmlFor="signup-email">Email:</label>
            <input type="email" id="signup-email" name="email" required />
            <label htmlFor="signup-password">Password:</label>
            <input type="password" id="signup-password" name="password" required />
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password" name="confirmPassword" required />
            <label htmlFor="phone">Phone Number (Optional):</label>
            <input type="tel" id="phone" name="phone" />
            <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <a href="#" onClick={(e) => {e.preventDefault(); setIsLogin(true);}}>Login</a></p>
    </div>
  );

  return (
    <div id="auth-modal" className="modal" style={{ display: 'flex' }}>
      {isLogin ? loginForm : signupForm}
    </div>
  );
};

export default AuthModal;
