import React, { useState } from 'react';
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
import { registerUser } from '../services/api';  

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

export default function SignUp() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = (event) => {
    const { name, email, password, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      [email]: value,
      [password]: value,
    }));
  };

  // Handle form submission
  // Handle form submission
const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      // Call the registerUser function with the form data
      const response = await registerUser(formData);
      
      // Handle success response
      setMessage('User registered successfully!');
      console.log('Response:', response);
  
    } catch (error) {

      if (error.response && error.response.data && error.response.data.error) {
        setMessage(`Error: ${JSON.stringify(error.response.data.error)}`);
      } else {
        setMessage('Error registering user, please try again.');
      }
      console.error('Error registering user:', error);
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
          Sign up
        </Typography>
        {/* Display success/error message */}
        {message && (
          <Typography variant="body2" color={message.includes('Error') ? 'error' : 'primary'}>
            {message}
          </Typography>
        )}
        <Form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Username */}
            <Grid item xs={12}>
  <TextField
    variant="outlined"
    required
    fullWidth
    id="name"
    label="Name"
    name="name"
    autoComplete="name"
    value={formData.name}
    onChange={handleChange}
  />
</Grid>

            {/* Email */}
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
            Sign Up
          </SubmitButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
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
