import React, { useState } from 'react';
import { useUser } from '../pages/UserContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import { loginUser } from '../services/api';

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
    const [message, setMessage] = useState('');
    const { setUser } = useUser();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await loginUser(formData);
            console.log('Login response:', response);

            if (response.status === 'success' && response.data) {
                const userData = {
                    name: response.data.name,
                    email: response.data.email,
                };

              
                setUser(userData);
                localStorage.setItem('authToken', response.token);
                setMessage('Login successful!');
                navigate('/Index');
            } else {
                setMessage('Invalid login credentials.');
            }
        } catch (error) {
            setMessage('Error logging in. Please check your credentials.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false); 
        }
    };

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
                {message && (
                    <Typography variant="body2" color={message.includes('Error') ? 'error' : 'primary'}>
                        {message}
                    </Typography>
                )}
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
                    >
                        Sign In
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
