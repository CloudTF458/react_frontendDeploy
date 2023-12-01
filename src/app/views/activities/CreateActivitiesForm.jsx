import {
    Grid,
    Icon,
    styled,
  } from "@mui/material";
  import { LoadingButton } from '@mui/lab';
  import { Span } from "app/components/Typography";
  import { Alert, Snackbar } from "@mui/material";
  import { useState, useContext } from "react";
  import { BrowserView, MobileView } from "react-device-detect";
  import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
  import * as utils from 'app/utils/utils';
  // import { useNavigate } from "react-router-dom";
  import React from "react";
  import { userContext } from "../../contexts/user-context"
  
  const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
  }));
  
  const CreateActivitiesForm = () => {
    // const navigate = useNavigate();
    const [state, setState] = useState({});
    const [open, setOpen] = React.useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [msgType, setMsgType] = useState("error");
    const context = useContext(userContext);
    const [loading, setLoading] = useState(false);
  
    function handleClose(_, reason) {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    }
  
    const handleSubmit = async (activity) => {
      setLoading(true);
  
      // se configura el cuerpo de la consulta para crear el evento en la BD
      const body = {
        "valor": Number(activityValor),
        "descripcion": activityDescription,
        "nombre_evento": eventName,
      };
      
      console.log("context:", context)
      const config = {
        method: "POST",
        headers: {
          Authorization: `Token ${context.token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };
      console.log("body:", body)
      console.log("event:", activity)
      try {
        let response = await utils.crearActividad(config)
        setLoading(false);
        if (response.error){
          setOpen(true)
          setErrMsg(`Error: ${JSON.stringify(response.error_cause)}`)
          setMsgType("error")
          return ;
        }
        else {
          setOpen(true)
          setErrMsg("Activity created successfully!")
          setMsgType("success")
        }
        // navigate("/")
      }
      catch (e) {
        console.error("exception:", e)
        setLoading(false);
        setOpen(true)
        setErrMsg("Error, por favor contacte a soporte!")
        setMsgType("error")
      }
    };
  
  
    const handleChange = (activity) => {
      activity.persist();
      setState({ ...state, [activity.target.name]: activity.target.value });
      console.log(state)
    };

  
    const {
      activityValor,
      activityDescription,
      eventName,
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
                  name="activityDescription"
                  label="Activity Description"
                  onChange={handleChange}
                  value={activityDescription || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />

                <TextField
                  type="text"
                  name="activityValor"
                  label="Valor"
                  onChange={handleChange}
                  value={activityValor || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
    
              </Grid>
    
              <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                
              <TextField
                  type="text"
                  name="eventName"
                  label="Name of Event"
                  onChange={handleChange}
                  value={eventName || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
    
              </Grid>
            </Grid>
    
            <LoadingButton color="primary" variant="contained" type="submit" loading={loading}>
              <Icon>send</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Create Activity</Span>
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
                  name="activityDescription"
                  label="Activity Description"
                  onChange={handleChange}
                  value={activityDescription || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />

                <TextField
                  type="text"
                  name="activityValor"
                  label="Valor"
                  onChange={handleChange}
                  value={activityValor || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
             
              <TextField
                  type="text"
                  name="eventName"
                  label="Name of Event"
                  onChange={handleChange}
                  value={eventName || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
    
            <LoadingButton color="primary" variant="contained" type="submit" loading={loading}>
              <Icon>send</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Create Activity</Span>
            </LoadingButton>
          </ValidatorForm>
        </MobileView>
      </div>
    );
  };
  
  export default CreateActivitiesForm;