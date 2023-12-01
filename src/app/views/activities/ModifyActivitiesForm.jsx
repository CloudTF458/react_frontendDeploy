import {
    Grid,
    Icon,
    styled,
  } from "@mui/material";
  import { LoadingButton } from '@mui/lab';
  import { Span } from "app/components/Typography";
  import { Alert, Snackbar } from "@mui/material";
  import { BrowserView, MobileView } from "react-device-detect";
  import { useState, useEffect, useContext } from "react";
  import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
  import * as utils from 'app/utils/utils';
  // import { useNavigate } from "react-router-dom";
  import React from "react";
  import { userContext } from "../../contexts/user-context"
  
  const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
  }));
  
  const CreateActivitiesForm = ({ selectedActivity }) => {
    // const navigate = useNavigate();
    const [state, setState] = useState({});
    const [open, setOpen] = React.useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [msgType, setMsgType] = useState("error");
    const context = useContext(userContext);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      // Actualizar el estado cuando se seleccionan datos del datatable
      if (selectedActivity) {
        setState({
          activityValor: selectedActivity.actividad_valor || "",
          activityNewDescription: selectedActivity.actividad || "",
          activityOldDescription: selectedActivity.actividad || "",
        });
      }
    }, [selectedActivity]);

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
        "descripcion": activityNewDescription,
        "antigua_descripcion": activityOldDescription,
        "valor": Number(activityValor),
      };
      
      console.log("context:", context)
      const config = {
        method: "PUT",
        headers: {
          Authorization: `Token ${context.token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };
      console.log("body:", body)
      console.log("event:", activity)
      try {
        let response = await utils.modificarActividad(config)
        setLoading(false);
        if (response.error){
          setOpen(true)
          setErrMsg(`Error: ${JSON.stringify(response.error_cause)}`)
          setMsgType("error")
          return ;
        }
        else {
          setOpen(true)
          setErrMsg("Activity modified successfully!")
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
      activityNewDescription,
      activityOldDescription,
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
                  name="activityNewDescription"
                  label="New Description"
                  onChange={handleChange}
                  value={activityNewDescription || ""}
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
                  name="activityOldDescription"
                  label="Old Description"
                  onChange={handleChange}
                  value={activityOldDescription || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
    
              </Grid>
            </Grid>
    
            <LoadingButton color="primary" variant="contained" type="submit" loading={loading}>
              <Icon>send</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Modify Activity</Span>
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
                  name="activityNewDescription"
                  label="New Description"
                  onChange={handleChange}
                  value={activityNewDescription || ""}
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
                  name="activityOldDescription"
                  label="Old Description"
                  onChange={handleChange}
                  value={activityOldDescription || ""}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
            <LoadingButton color="primary" variant="contained" type="submit" loading={loading}>
              <Icon>send</Icon>
              <Span sx={{ pl: 1, textTransform: "capitalize" }}>Modify Activity</Span>
            </LoadingButton>
          </ValidatorForm>
        </MobileView>
      </div>
    );
  };
  
  export default CreateActivitiesForm;