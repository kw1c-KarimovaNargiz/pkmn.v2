import React, { useState, useEffect } from 'react';
import { useUser } from '../pages/UserContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';  
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import useApi from '../hooks/useApi'; // Import the useApi hook

const Copyright = () => (
    <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
            Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
    </Typography>
);

const PaperContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const AvatarStyled = styled(Avatar)(({ theme }) => ({
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
}));

const Form = styled('form')(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(3),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
}));

export default function SignIn() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission

    const { data, loading, error, triggerFetch } = useApi('login', {}, false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setIsSubmitted(true); // Set form as submitted
        triggerFetch(formData);
    };

    useEffect(() => {
        if (!isSubmitted) return; // Only show messages after form is submitted

        if (loading) {
            // toast.info('Logging in...', { toastId: 'loggingIn' });
        } else if (error) {
            toast.dismiss('loggingIn'); // Dismiss the logging in toast
            toast.error('Error logging in. Please check your credentials.');
            console.error('Login error:', error);
            setIsLoading(false);
        } else if (data && data.status === 'success') {
            toast.dismiss('loggingIn'); // Dismiss the logging in toast
            const userData = {
                name: data.data.name,
                email: data.data.email,
            };
            // console.log('User data:', data.data.token);
            setUser(userData);
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('user', JSON.stringify(userData));
            toast.success('Login successful!');
            navigate('/Index');
            setIsLoading(false);
        } else if (data && data.status !== 'success') {
            toast.dismiss('loggingIn'); // Dismiss the logging in toast
            toast.error('Invalid login credentials.');
            setIsLoading(false);
        }
    }, [data, loading, error, navigate, setUser, isSubmitted]);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <PaperContainer>
                <AvatarStyled>
                    <LockOutlinedIcon />
                </AvatarStyled>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <SubmitButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </SubmitButton>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/signup" variant="body2">
                                Don't have an account? Sign up
                            </Link>
                        </Grid>
                    </Grid>
                </Form>
            </PaperContainer>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}