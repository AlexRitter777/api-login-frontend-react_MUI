import React, { useState } from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

import swal from 'sweetalert';

const Root = styled(Grid)(({ theme }) => ({
    height: '100vh',
}));

const FormPaper = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(8, 4),
    padding: theme.spacing(4, 4, 8 ,4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    margin: theme.spacing(1),
    //backgroundColor: theme.palette.secondary.main,
}));


async function loginUser(credentials) {
    return fetch('http://api-login.loc/api/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
        //.then(data =>console.log(data))

}

export default function Signin() {


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailError(value.trim() === '' ? 'Please enter your email' : '');

    }

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordError(value.trim() === '' ? 'Please enter your password' : '');

    }

    const validateFields = () => {
        const isEmailEmpty = email.trim() === '';
        const isPasswordEmpty = password.trim() === '';

        setEmailError(isEmailEmpty ? 'Please enter your email' : '');
        setPasswordError(isPasswordEmpty ? 'Please enter your password' : '');

        return !(isEmailEmpty || isPasswordEmpty);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateFields();

        if (!isValid) {
            return;
        }



        const response = await loginUser({
            email,
            password
        });

        console.log(response);


        if('accessToken' in response) {
            swal("Success", response.message, "success", {
                buttons: false,
                timer: 2000,
            })
            .then((value) => {
                localStorage.setItem('accessToken', response['accessToken']);
                localStorage.setItem('user', JSON.stringify(response['user']));
                window.location.href = '/profile';
            })
        } else {
          swal("Failed", response.message, "error");
          //add server error
        }

    }

    return (
        <Root container>
            <CssBaseline />
            <Grid item xs={false} md={7} sx={{ backgroundImage: 'url(https://source.unsplash.com/random)', backgroundSize: 'cover' }} />
            <Grid item xs={12} md={5}>
                <FormPaper elevation={6} square>
                    <StyledAvatar>
                        {/*<LockOutlinedIcon />*/}
                    </StyledAvatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form noValidate onSubmit={handleSubmit} sx={{ width: '100%', marginTop: 1 }}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            name="email"
                            label="Email Address"
                            value={email}
                            onChange={handleEmailChange}
                            error={emailError}
                            helperText={emailError}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            error={passwordError}
                            helperText={passwordError}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 3, marginBottom: 2 }}
                        >
                            Sign In
                        </Button>
                    </form>
                </FormPaper>
            </Grid>
        </Root>
    );

}




