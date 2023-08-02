import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('abduhamidbotirov@gmail.com');
    const [password, setPassword] = useState('strongpassword!@#$12Mopasd!&$');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/admin-login', {
                email: email,
                password: password
            });

            // Save the token to localStorage
            localStorage.setItem('admin-token', response.data.token);

            // Redirect to the admin page
            navigate('/admin');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default Login;
