import React from "react";
import {
  FormControl, TextField, Typography
} from "@mui/material";

const CustomTextField = ({ label, onChange, type, errors }) => {
  return (
    <>
      <FormControl error={!!errors[label]} sx={{ maxWidth: '300px', width: '100%' }}>
        <TextField label={label} variant="standard"
          onChange={onChange} type={type} error={!!errors[label]}
          InputLabelProps={{
            style: {
              color: 'black',
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderRadius: '15px',

              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
            width: '100%',
            maxWidth: '300px',
            //
            borderRadius: '15px', mt: '15px'

          }} />
        {errors[label] && <Typography variant="caption" color="error">{errors[label]}</Typography>}
      </FormControl>
    </>
  )
}
export default CustomTextField