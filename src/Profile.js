import React, {useEffect, useState} from 'react';
import { styled } from '@mui/system';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";


const Root = styled('div')(({ theme }) => ({
    flexGrow: 1,
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(20),
    height: theme.spacing(20),
}));




async function changeUserName(userdata) {

    const token = localStorage.getItem('accessToken');
    return fetch('http://api-login.loc/api/user/update', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify(userdata)
    })
        .then(data => data.json())
    //.then(data =>console.log(data))
}


function UserData({user}){

    const [showEdit, setShowEdit] = useState(true);
    const [showNameForm, setShowNameForm] = useState(false);
    const [showName, setShowName] = useState(true);
    const [username, setUserName] = useState(user.username);

    const handleInputChange = (e) => {
        setUserName(e.target.value);
    }


    const handleClick = () => {
        setShowEdit(false);
        setShowNameForm(true);
        setShowName(false);



    }


    const handleNameClick = async (e) => {



        if (username !== user.username) {

            const response = await changeUserName({username: username});
            if('user' in response){
                user.username = response.username;
                localStorage.setItem('user', JSON.stringify(response['user']));
            }
        }

        setShowNameForm(false);
        setShowEdit(true);
        setShowName(true);

    }

    return (
        <div>
            <Typography variant="h6">User Details:</Typography>
            <Typography variant="body1">ID: {user.id}</Typography>
            <Typography variant="body1">Email: {user.email}</Typography>
            <Typography variant="body1">Name: {showName ? username : null}</Typography>
            {showEdit ? <EditComponent onEditClick={() => handleClick()} /> : null}
            {showNameForm ? <UserNameForm username = {username} onNameFormClick ={() => handleNameClick()} handleInputChange = {handleInputChange}/> : null }
        </div>
    );

}

function EditComponent({onEditClick}) {
    return(
        <Button onClick={onEditClick}>
            <EditIcon />
        </Button>
    );

}


function UserNameForm ({username, onNameFormClick, handleInputChange}) {

    const handleSubmit = (e) => {
        e.preventDefault();
        onNameFormClick(username);
    }

    return (

        <form onSubmit={handleSubmit} noValidate  sx={{ width: '100%', marginTop: 1 }}>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="userName"
                name="userName"
                value={username}
                onChange={handleInputChange}
                //label="Email Address"

            />

            <Button
                type="submit"
                //fullWidth
                //variant="contained"
                //color="primary"
                //sx={{ marginTop: 3, marginBottom: 2 }}

            >
                <DoneOutlineIcon/>

            </Button>
        </form>
    );



}


export default function Profile() {

    const [anchorEl, setAnchorEl] = useState(null);


    const open = Boolean(anchorEl);
    const user = JSON.parse(localStorage.getItem('user'));

    const handleMenu = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    useEffect(() => {
        console.log('anchorEl:', anchorEl);
    }, [anchorEl]);

    return (
        <Root>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Profile
                    </Typography>
                    <IconButton onClick={handleMenu} color="inherit">
                        <Avatar src="" />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Card sx={{ flexGrow: 1 }} variant="outlined">
                <CardContent>
                    <LargeAvatar src="/" />
                    <Typography variant="h5">
                        Welcome {user.username}!
                    </Typography>
                    <UserData user={user} />
                </CardContent>
            </Card>
        </Root>
    );


}

