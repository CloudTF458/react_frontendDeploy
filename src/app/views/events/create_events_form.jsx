import {
  Typography,
  Grid,
  Icon,
  Autocomplete,
  styled,
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { Span } from "app/components/Typography";
import { Alert, Snackbar } from "@mui/material";
import { useState, useContext } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { BrowserView, MobileView} from "react-device-detect";
import * as utils from 'app/utils/utils';
// import { useNavigate } from "react-router-dom";
import React from "react";
import { userContext } from "../../contexts/user-context"

const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const SimpleForm = () => {
  // const navigate = useNavigate();
  const [state, setState] = useState({});
  const suggestions = [
    'VIAJE',
    'HOGAR',
    'PAREJA',
    'COMIDA',
    'OTRO',
  ];
  const AutoComplete = styled(Autocomplete)(() => ({
    width: 300,
    marginBottom: '16px',
  }));
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

  const handleSubmit = async (event) => {
    setLoading(true);

    // se configura el cuerpo de la consulta para crear el evento en la BD
    const body = {
      "nombre": eventName,
      "descripcion": eventDescription,
      "tipo": eventType,
      "foto": eventPicture
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
    console.log("event:", event)
    try {
      let response = await utils.crearEvento(config)
      setLoading(false);
      if (response.error){
        setOpen(true)
        setErrMsg(`Error: ${JSON.stringify(response.error_cause)}`)
        setMsgType("error")
        return ;
      }
      else {
        setOpen(true)
        setErrMsg("Event created successfully!")
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


  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
    console.log(state)
  };

  const handleChangeType = async (newValue) => {
    console.log(newValue);
    let name = "eventType"
    setState({ ...state, [name]: newValue });
    console.log(state)
  };

  const {
    eventName,
    eventDescription,
    eventType,
    eventPicture,
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
                name="eventName"
                label="Event Name"
                onChange={handleChange}
                value={eventName || ""}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />

              <TextField
                type="text"
                name="eventDescription"
                label="Event Description"
                onChange={handleChange}
                value={eventDescription || ""}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />

            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
              
              <AutoComplete
                options={suggestions}
                getOptionLabel={(option) => option}
                onChange={(event, newValue) => handleChangeType(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    type="text"
                    name="eventType"
                    label="Type of Event"
                  />
                )}
                value={eventType || ""}
              />

              <TextField
                name="eventPicture"
                type="text"
                label="Image URL"
                value={eventPicture || ""}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
                sx={{ mt: -2 }}
              />
              
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center'}}>
                Please, insert a valid image URL.
              </Typography>

            </Grid>
          </Grid>

          <LoadingButton color="primary" variant="contained" type="submit" loading={loading}>
            <Icon>send</Icon>
            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Create Event</Span>
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
                name="eventName"
                label="Event Name"
                onChange={handleChange}
                value={eventName || ""}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
              <TextField
                type="text"
                name="eventDescription"
                label="Event Description"
                onChange={handleChange}
                value={eventDescription || ""}
                validators={["required"]}
                errorMessages={["this field is required"]}
              />
              <AutoComplete
                options={suggestions}
                getOptionLabel={(option) => option}
                onChange={(event, newValue) => handleChangeType(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    type="text"
                    name="eventType"
                    label="Type of Event"
                  />
                )}
                value={eventType || ""}
              />
              <TextField
                name="eventPicture"
                type="text"
                label="Image URL"
                value={eventPicture || ""}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={["this field is required"]}
                sx={{ mt: -2 }}
              />
                
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center'}}>
                Please, insert a valid image URL.
              </Typography>
            <LoadingButton color="primary" variant="contained" type="submit" loading={loading}>
              <Icon>send</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Create Event</Span>
            </LoadingButton>
          </ValidatorForm>  
      </MobileView>
    </div>
  );
};

export default SimpleForm;
