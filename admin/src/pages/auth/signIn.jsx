import React from "react";
import { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import CustomTextField from "./CustomTextField";
import { Link, useNavigate } from 'react-router-dom'
import { customAxios } from "../../api/axiosPrivate";

import { useAuth } from "../../context/authContext";
const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [errMsg, setErrMsg] = useState('');
  const [auth, setAuth] = useAuth();
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
        const response = await customAxios.post('/admin/auth/login', { email, password });

        setAuth({
          ...auth,
          user_admin: response.data.user,
          token_admin: response.data.access_token,
        });
        localStorage.setItem("token_admin", response.data.access_token);
        localStorage.setItem('user_admin', JSON.stringify(response.data.user));

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
      {/* <Box sx={{ bgcolor: 'red', display: "flex", maxWidth: '420px', alignItems: "center", justifyContent: 'center' }}> */}
      <div className="items-center flex justify-center">
        <div className="font-extrabold  text-5xl "> Course Mate </div>
        {/* <img src={logo} alt="logo" className="w-[30%] h-[50%] " /> */}
      </div>
      <Box sx={{
        width: '100%', maxWidth: '420px',
        display: "flex", flexDirection: 'column',
        bgcolor: 'transparent', justifyContent: 'flex-start', alignItems: "center"
      }}>
        {/* <Typography variant="h5" sx={{ color: 'black', display: 'flex', alignSelf: 'flex-start', mb: '20px' }}>
          Sign in to your account
        </Typography> */}
        <CustomTextField label="email" onChange={(e) => { setEmail(e.target.value) }} errors={errors} />
        <CustomTextField label="password" type="password" onChange={(e) => { setPassword(e.target.value) }} errors={errors} />


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
        {/* </Box> */}
      </Box>
    </div>

  )


}

export default SignIn