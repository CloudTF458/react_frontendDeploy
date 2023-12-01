import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { Card, Grid, TextField } from '@mui/material';
import { Alert, Snackbar } from "@mui/material";
import { Box, styled } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import useAuth from 'app/hooks/useAuth';
import { Formik } from 'formik';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import * as utils from 'app/utils/utils';
import React from "react";

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(JustifyBox)(() => ({
  height: '100%',
  padding: '32px',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const JWTRegister = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100vh !important',
  '& .card': {
    maxWidth: 800,
    minHeight: 400,
    margin: '1rem',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
  },
}));

// inital login credentials
const initialValues = {
  email: '',
  nombres: '',
  apellidos: '',
  password: '',
  username: '',
  foto: '',
  // remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be 6 character length')
    .required('Password is required!'),
  email: Yup.string().email('Invalid Email address').required('Email is required!'),
});

const JwtRegister = () => {
  const theme = useTheme();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [msgType, setMsgType] = useState("error");

  function handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  const handleFormSubmit = async (values) => {
    setLoading(true);

    try {
      // se configura el archivo de configuración para la solicitud
      let body = {
        "email": values.email,
        "nombres": values.nombres,
        "apellidos": values.apellidos,
        "password": values.password,
        "apodo": values.username,
        "foto": values.foto
      }
      console.log("body:",body)

      let config = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };

      // se registra al usuario
      let response = await utils.createUser(config)
      console.log("response:",response)
      if (response.error){
        setOpen(true)
        setErrMsg(response.error_cause)
        setMsgType("error")
        setLoading(false);
        return ;
      }
      else {
        setOpen(true)
        setErrMsg("Registration successful!")
        setMsgType("success")
      }
      console.log("response:", response)

      // me vuelvo al login
      register(values.email, values.username, values.password);
      navigate('/');

      setLoading(false);
    } catch (e) {
      console.log(e);
      setOpen(true)
      setErrMsg("Error, el usuario puede que sea invalido o ya exista, si el problema persiste por favor contacte a soporte!")
      setMsgType("error")
      setLoading(false);
    }
  };

  return (
    <JWTRegister>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={msgType} sx={{ width: "100%" }} variant="filled">
          {errMsg}
        </Alert>
      </Snackbar>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <ContentBox>
              <img
                width="100%"
                alt="Register"
                src="/assets/images/illustrations/posting_photo.svg"
              />
            </ContentBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <Box p={4} height="100%">
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="username"
                      label="Username"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.username}
                      onChange={handleChange}
                      helperText={touched.username && errors.username}
                      error={Boolean(errors.username && touched.username)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="nombres"
                      label="nombres"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.nombres}
                      onChange={handleChange}
                      helperText={touched.nombres && errors.nombres}
                      error={Boolean(errors.nombres && touched.nombres)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="apellidos"
                      label="apellidos"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.apellidos}
                      onChange={handleChange}
                      helperText={touched.apellidos && errors.apellidos}
                      error={Boolean(errors.apellidos && touched.apellidos)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      type="text"
                      name="foto"
                      label="foto"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.foto}
                      onChange={handleChange}
                      helperText={touched.foto && errors.foto}
                      error={Boolean(errors.foto && touched.foto)}
                      sx={{ mb: 3 }}
                    />

                    {/* <FlexBox gap={1} alignItems="center">
                      <Checkbox
                        size="small"
                        name="remember"
                        onChange={handleChange}
                        checked={values.remember}
                        sx={{ padding: 0 }}
                      />

                      <Paragraph fontSize={13}>
                        I have read and agree to the terms of service.
                      </Paragraph>
                    </FlexBox> */}

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ mb: 2, mt: 3 }}
                    >
                      Regiser
                    </LoadingButton>

                    <Paragraph>
                      Already have an account?
                      <NavLink
                        to="/session/signin"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Login
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </JWTRegister>
  );
};

export default JwtRegister;
