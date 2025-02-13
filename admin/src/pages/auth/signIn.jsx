import React from "react";
import { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import CustomTextField from "./CustomTextField";
import { Link, useNavigate } from 'react-router-dom'
// import customAxios from '../../../../frontend/src/api/axiosPrivate'
// import axios from '../../api/axios';
import axios from "axios";
//import logo from '../../assets/logo.png'
//import { useAuth } from '../../../../frontend/src/context/auth'
const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [errMsg, setErrMsg] = useState('');
  //const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Input email';
    if (!password) newErrors.password = 'Input password';
    return newErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        
        localStorage.setItem('auth', JSON.stringify(res.data));
        console.log(auth.userInfo)
        navigate('/');

      } catch (err) {
        if (!err?.response) {
          setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
          setErrMsg('Missing Username or Password');
        } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized');
        } else {
          setErrMsg('Login Failed');
        }
      }
    }
  }

  return (

    <div className="border rounded-xl p-7 max-w-[420px] mx-auto my-7 border-black flex-col justify-center">
      <Box sx={{ bgcolor: 'blue', display: "flex", maxWidth: '420px', alignItems: "center", justifyContent: 'center' }}>
      <div className="items-center flex justify-center">
        {/* <img src={logo} alt="logo" className="w-[30%] h-[50%] " /> */}
      </div>
      <Box sx={{
        width: '100%', maxWidth: '420px',
        display: "flex", flexDirection: 'column',
        bgcolor: 'white', justifyContent: 'flex-start', alignItems: "center"
      }}>
        {/* <Typography variant="h5" sx={{ color: 'black', display: 'flex', alignSelf: 'flex-start', mb: '20px' }}>
          Sign in to your account
        </Typography> */}
        <CustomTextField label="email" onChange={(e) => { setEmail(e.target.value) }} errors={errors} />
        <CustomTextField label="password" onChange={(e) => { setPassword(e.target.value) }} errors={errors} />


        <Button onClick={handleSubmit} variant="contained" sx={{
          color: 'white', bgcolor: 'silver', borderRadius: '30px', height: '50px', textTransform: 'none',
          fontSize: '20px', mb: '50px', mt: '20px',
          '&:hover': {
            color: 'white',
            bgcolor: 'black',
          }
        }}>
          Sign in
        </Button>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Typography variant="h8" sx={{ mr: '5px' }}>
            Forget password?
          </Typography>
          <Link to='/signup' > <div className="font-semibold hover:font-bold"> help </div>  </Link>
        </Box>
      </Box>
      </Box>
    </div>

  )


}

export default SignIn