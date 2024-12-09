import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../pages/UserContext';
import { toast } from 'react-toastify';

import useApi from '../hooks/useApi';
import '../styling/signin.css';

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { data, loading, error, triggerFetch } = useApi('login', {}, false);

    const images = [ '/mew.jpg'];

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setIsSubmitted(true);
        triggerFetch(formData);
    };

    useEffect(() => {
        if (!isSubmitted) return;

        if (error) {
            toast.error('Error logging in. Please check your credentials.');
            setIsLoading(false);
        } else if (data?.status === 'success') {
            const userData = {
                name: data.data.name,
                email: data.data.email,
            };
            setUser(userData);
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('user', JSON.stringify(userData));
            toast.success('Login successful!');
            navigate('/Index');
            setIsLoading(false);
        } else if (data?.status !== 'success') {
            toast.error('Invalid login credentials.');
            setIsLoading(false);
        }
    }, [data, loading, error, navigate, setUser, isSubmitted]);

    return (
        <div className="auth-container">
            <div className="form-side">
                <div className="auth-card">
                    <h2>Login</h2>
                    <p>Please enter your login and password!</p>
                    
                    <form onSubmit={handleSubmit} className="signin-form">
                        <div className="form-group">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="forgot-password">
                            <a href="#!">Forgot password?</a>
                        </div>

                        <button 
                            type="submit" 
                            className="signin-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Login'}
                        </button>

                        <div className="signup-link">
                            Don't have an account? <Link to="/signup">Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>
            {/* <Slideshow images={images} /> */}
        </div>
    );
};

export default SignIn;