import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const SignIn = () => {
    const [username, setUsername] = useState('');
    const history = useNavigate();
    const handleSignIn = async () => {
        try {
            if (!username) {
                console.error('Username cannot be empty.');
                return;
            }
            const response = await axios.post('http://localhost:5000/api/users', {
                username: username
            });
            const token = response.data.token;
            localStorage.setItem('token', token);
            history('/controller');
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    return (
        <>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleSignIn}>Sign In</button>
        </>
    );
};

export default SignIn;
