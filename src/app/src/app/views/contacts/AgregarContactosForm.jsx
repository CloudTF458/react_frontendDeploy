import {
    Grid,
    Icon,
    styled,
  } from "@mui/material";
  import { LoadingButton } from '@mui/lab';
  import { Alert, Snackbar } from "@mui/material";
  import { Span } from "app/components/Typography";
  import { useState, useContext } from "react";
  import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
  import * as utils from 'app/utils/utils';
  import React from "react";
  import { userContext } from "../../contexts/user-context"

  const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
  }));
  
  const AgregarContactosForm = () => {
      const [state, setState] = useState({ email: '' });
      const context = useContext(userContext)
      const [open, setOpen] = React.useState(false);
      const [errMsg, setErrMsg] = useState("");
      const [msgType, setMsgType] = useState("error");
      const [loading, setLoading] = useState(false);

      const { 
        email 
      } = state

      function handleClose(_, reason) {
        if (reason === "clickaway") {
          return;
        }
        setOpen(false);
      }
    
      const handleSubmit = async (event) => {
        setLoading(true);
        // Se valida que el campo del correo de contacto no sea nulo
        if (state == null) {
          setLoading(false);
          setOpen(true)
          setErrMsg("Error, unspecified contact!")
          setMsgType("error")
          return ;
        }
        // Se agrega al contacto
        let usuario = context.user_data
        console.log("context:",usuario)
        const body = {
          "correo_usuario": usuario.user.email,
          "correo_contacto": email
        }
        console.log("body:",  body)
        console.log("state:", state)

        const config = {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(body),
        };
        try {
          let response = await utils.agregarContacto(config)
          setLoading(false);
          if (response.error){
            setOpen(true)
            setErrMsg(`Error: ${JSON.stringify(response.error_cause)}`)
            setMsgType("error")
            return ;
          }
          else {
            setOpen(true)
            setErrMsg("Contact added successfully!")
            setMsgType("success")
          }
          console.log("response:", response)
        }
        catch (e) {
          console.log("exception:", e)
          setLoading(false);
          setOpen(true)
          setErrMsg("Error:" + e)
          setMsgType("error")
        }
        
    };
  
    const handleChange = (event) => {
      event.persist();
      setState({ ...state, [event.target.name]: event.target.value });
    };

    return (
      <div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={msgType} sx={{ width: "100%" }} variant="filled">
            {errMsg}
          </Alert>
        </Snackbar>
        <ValidatorForm 
            onSubmit={handleSubmit} 
            onError={() => null} 
            >
          <Grid container spacing={6}>
            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
  
              <TextField
                // type="text"
                name="email"
                label="Email"
                value={email || ""}
                onChange={handleChange}
                validators={['required', 'isEmail']}
                errorMessages={['this field is required', 'email is not valid']}
              />
            </Grid>
          </Grid>
  
          <LoadingButton color="primary" variant="contained" type="submit" loading={loading}>
            <Icon>send</Icon>
            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add contact</Span>
          </LoadingButton>
        </ValidatorForm>
      </div>
    );
  };
  
  export default AgregarContactosForm;