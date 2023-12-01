import {
  Typography,
  Avatar,
  Grid,
  Icon,
  styled,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { Alert, Snackbar } from "@mui/material";
import { Span } from "app/components/Typography";
import { useEffect, useState, useContext } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import * as utils from 'app/utils/utils';
import { useNavigate } from "react-router-dom";
import React from "react";
import { userContext } from "../../contexts/user-context"

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const SimpleForm = ({ userData }) => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [msgType, setMsgType] = useState("error");
    const context = useContext(userContext);
    const [loading, setLoading] = useState(false);
    const imgSize = 250;
    const limitURL = 3100;

    function handleClose(_, reason) {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    }

    const [state, setState] = useState({
        inactivo: true,
        activo: true,
      });

    const handleSwitch = (name) => (event) => {
      console.log("test:",{ ...state, [name]: event.target.checked })
        setState({ ...state, [name]: event.target.checked });
    };

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      if (value !== state.password) return false;

      return true;
    });
    return () => ValidatorForm.removeValidationRule("isPasswordMatch");
  }, [state.password]);

  const handleSubmit = async (event) => {
    setLoading(true);
    // validaciones iniciales
    if (avatar != null) {
      if(avatar.length > limitURL) {
        setLoading(false);
        setOpen(true)
        setErrMsg("Error, image URL too large!")
        setMsgType("error")
        return ;
      }
    }

    // se actualizan los datos del usuario
    let is_active_bool = false;
    if (state.activo){
      is_active_bool = true;
    }

    const body = {
      "email": userData.email,
      "nombres": nombre || userData.nombres,
      "apellidos": userData.apellidos,
      "password": password || userData.password,
      "foto": avatar || userData.foto,
      "is_active": is_active_bool,
    };

    const config = {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    };
    console.log("body:", body)
    console.log("event:", event)
    let response = await utils.updateUser(config)
    setLoading(false);
    if (response.error){
      setOpen(true)
      setErrMsg(`Error: ${JSON.stringify(response.error_cause)}`)
      setMsgType("error")
      return ;
    }
    else {
      setOpen(true)
      setErrMsg("User updated successful!")
      setMsgType("success")
    }
    setState({apodo:""});
    setState({nombre:""});
    setState({password:""});
    setState({avatar:""});
    navigate("/")
  };

  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const {
    apodo,
    nombre,
    password,
    avatar,
    is_active,
  } = state;

  return (
    <div>
      <BrowserView>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={msgType} sx={{ width: "100%" }} variant="filled">
              {errMsg}
            </Alert>
          </Snackbar>
          <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
            <Grid container spacing={6}>
              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                <TextField
                  type="text"
                  name="nombre"
                  label="First name"
                  onChange={handleChange}
                  value={nombre || "" + userData.nombres}
                  style={{ textAlign: 'center' }}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />

                <TextField
                  type="text"
                  name="apodo"
                  id="standard-basic"
                  value={apodo || "" + userData.apodo}
                  onChange={handleChange}
                  label="Username"
                  disabled={true}
                  style={{ textAlign: 'center' }}
                  // validators={["required", "minStringLength: 4", "maxStringLength: 9"]}
                  // errorMessages={["this field is required"]}
                />

                <TextField
                  name="password"
                  type="password"
                  label="password"
                  value={password || "" + userData.password}
                  onChange={handleChange}
                  disabled={true}
                  style={{ textAlign: 'center' }}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />

                <FormControlLabel
                    label="Active/Inactive"
                    control={
                    <Switch
                        color="primary"
                        value={is_active || userData.is_active}
                        checked={state.activo}
                        onChange={handleSwitch("activo")}
                    />
                    }
                />
              </Grid>

              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                <TextField
                    name="avatar"
                    type="text"
                    label="Avatar"
                    value={avatar || "" + userData.foto}
                    onChange={handleChange}
                    style={{ textAlign: 'center' }}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                    />
                
                <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center'}}>
                  Please, insert a valid image URL.
                </Typography>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Avatar src={context.user_data.foto} sx= {{ mt: 2 }} style={{ width: imgSize, height: imgSize }}/>
                </div>

              </Grid>
            </Grid>

            <LoadingButton color="primary" variant="contained" type="submit" loading={loading} sx= {{ mt: 2 }}>
              <Icon>send</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Update User</Span>
            </LoadingButton>
          </ValidatorForm>
      </BrowserView>
      <MobileView>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={msgType} sx={{ width: "100%" }} variant="filled">
              {errMsg}
            </Alert>
          </Snackbar>
          <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
            <TextField
              type="text"
              name="nombre"
              label="First name"
              onChange={handleChange}
              value={nombre || "" + userData.nombres}
              style={{ textAlign: 'center' }}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />

            <TextField
              type="text"
              name="apodo"
              id="standard-basic"
              value={apodo || "" + userData.apodo}
              onChange={handleChange}
              label="Username"
              disabled={true}
              style={{ textAlign: 'center' }}
              // validators={["required", "minStringLength: 4", "maxStringLength: 9"]}
              // errorMessages={["this field is required"]}
            />

            <TextField
              name="password"
              type="password"
              label="password"
              value={password || "" + userData.password}
              onChange={handleChange}
              disabled={true}
              style={{ textAlign: 'center' }}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />

            <FormControlLabel
                label="Active/Inactive"
                control={
                <Switch
                    color="primary"
                    value={is_active || userData.is_active}
                    checked={state.activo}
                    onChange={handleSwitch("activo")}
                />
                }
            />
            <TextField
                name="avatar"
                type="text"
                label="Avatar"
                value={avatar || "" + userData.foto}
                onChange={handleChange}
                style={{ textAlign: 'center' }}
                validators={["required"]}
                errorMessages={["this field is required"]}
                />
            
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center'}}>
              Please, insert a valid image URL.
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar src={context.user_data.foto} sx= {{ mt: 2 }} style={{ width: imgSize, height: imgSize }}/>
            </div>
            
            <LoadingButton color="primary" variant="contained" type="submit" loading={loading} sx= {{ mt: 2 }}>
              <Icon>send</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Update User</Span>
            </LoadingButton>
          </ValidatorForm>
      </MobileView>
    </div>
  );
};

export default SimpleForm;
