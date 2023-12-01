import { LoadingButton } from '@mui/lab';
import { Card, Grid, TextField } from '@mui/material';
import { Alert, Snackbar } from "@mui/material";
import { Box, styled, useTheme } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import { Formik } from 'formik';
import { useState, useContext } from 'react';
import useAuth from 'app/hooks/useAuth';
import * as utils from 'app/utils/utils';
import { NavLink, useNavigate } from   'react-router-dom';
import * as Yup from 'yup';
import React from "react";
import { userContext } from '../../contexts/user-context';

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(Box)(() => ({
  height: '100%',
  padding: '32px',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const JWTRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100% !important',
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
  // email: 'jason@ui-lib.com',
  // password: 'dummyPass',
  email: '',
  password: '',
  remember: true,
};

// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be 6 character length')
    .required('Password is required!'),
  email: Yup.string().email('Invalid Email address').required('Email is required!'),
});

const JwtLogin = () => {
  const theme = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const context = useContext(userContext)
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
        "password": values.password
      }

      let config = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };

      // se valida el inicio de sesión
      let response = await utils.loginUser(config)
      if (response.error){
        setOpen(true)
        setErrMsg(response.error_cause)
        setMsgType("error")
        setLoading(false);
        return ;
      }
      else if(!response.description.user_details.user.is_active){
        setOpen(true)
        setErrMsg('User is currently inactive!')
        setMsgType("error")
        setLoading(false);
        return ;
      }
      else {
        setOpen(true)
        setErrMsg("Login successful!")
        setMsgType("success")
      }
      console.log("response:", response)
      // Actualiza el contexto
      console.log("contexto antes:",context)
      console.log("valores: 1.",response.description.token,
      "2." ,response.description.user_details)
      await context.setUserToken(response.description.token);
      await context.setUserData(response.description.user_details)
      
      console.log("contexto despues:",context)

      // se redirige al dashboard
      await login("jason@ui-lib.com", "dummyPass")
      navigate('/dashboard');
    } catch (e) {
      console.error("exception:", e)
      setOpen(true)
      setErrMsg("Error, por favor contacte a soporte!")
      setMsgType("error")
      setLoading(false);
    }
  };

  return (
    <JWTRoot>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={msgType} sx={{ width: "100%" }} variant="filled">
          {errMsg}
        </Alert>
      </Snackbar>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
              <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
            </JustifyBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
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
                      sx={{ mb: 1.5 }}
                    />

                    {/* <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />

                        <Paragraph>Remember Me</Paragraph>
                      </FlexBox>

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox> */}

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Login
                    </LoadingButton>

                    <Paragraph>
                      Don't have an account?
                      <NavLink
                        to="/session/signup"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Register
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
            </ContentBox>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot>
  );
};

export default JwtLogin;
