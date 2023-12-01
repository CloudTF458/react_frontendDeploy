import {
  Grid,
  Icon,
  styled,
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { Span } from "app/components/Typography";
import { Alert, Snackbar } from "@mui/material";
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

const SimpleForm = ({ selectedData }) => {
  // const navigate = useNavigate();
  const [state, setState] = useState({});
  const [open, setOpen] = React.useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [msgType, setMsgType] = useState("error");
  const context = useContext(userContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Actualizar el estado cuando se seleccionan datos del datatable
    if (selectedData) {
      setState({ 
        activityDescription: selectedData.actividad || "",
        email_contact: "",
        participation_value: "",
      });
    }
  }, [selectedData]);

  function handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  const handleSubmit = async (event) => {
    setLoading(true);

    let emails = email_contact.split(", ")
    let participationValues = participation_value
    let totalUsers = emails.length
    let percentage = 1 / totalUsers

    // Validamos si el usuario no ingresó datos en el campo de valor de participación.
    // Si no lo hace, el sistema calcula por defecto los porcentajes en partes iguales
    console.log("participationValues:", participationValues)
    if (participationValues == null) {
      // iteramos para que formemos la cadena de valores de participación
      participationValues = [ percentage ]
      for(let i = 1; i < totalUsers; i++){ 
        participationValues.push(percentage)
      }
    }
    else if (totalUsers !== participationValues.split(", ").length) {
      // Si ingresa valores, al menos validemos que ingreso la misma cantidad que usuarios
      setOpen(true)
      setLoading(false);
      setErrMsg(`Error: Invalid output, number of users = number of participation values.`)
      setMsgType("error")
      return ;
    }
    else{
      participationValues = participation_value.split(", ")
    }

    // Validamos que todos los valores o sean porcentajes o sean montos (númericos)
    let n_porcentajes = 0;
    let n_montos = 0;
    for(let i = 0; i < totalUsers; i++) {
      if (participationValues[i] > 0 && participationValues[i] <= 1) {
        n_porcentajes++;
      }
      else {
        n_montos++;
      }
    }

    console.log("n_montos:",n_montos,"n_porcentajes:",n_porcentajes, "totalUsers:",totalUsers)
    if (n_montos !== totalUsers && n_porcentajes !== totalUsers ) {
      setOpen(true)
      setLoading(false);
      setErrMsg(`Error: Invalid output, all participation values must be (%) or an amount (Number).`)
      setMsgType("error")
      return ;
    }

    console.log("participationValues2", participationValues)
    console.log("emails:", emails)
    
    // Ahora iteramos sobre cada usuario y llamamos la vista sobre cada uno
    for (let i = 0; i < totalUsers; i ++){
      // Validemos si el usuario quiere asignarse a si mismo.
      console.log("email_contact:",emails[i], "user_email:",context.user_data.user.email)
      if (emails[i] === context.user_data.user.email) emails[i] = null;

      // se configura el cuerpo de la consulta para crear el evento en la BD.
      const body = {
        "descripcion": activityDescription,
        "email_contacto": emails[i],
        "valor_participacion": Number(participationValues[i]),
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
        let response = await utils.agregarParticipante(config)
        setLoading(false);
        if (response.error){
          setOpen(true)
          setErrMsg(`Error: ${JSON.stringify(response.error_cause)}`)
          setMsgType("error")
          return ;
        }
      }
      catch (e) {
        console.error("exception:", e)
        setLoading(false);
        setOpen(true)
        setErrMsg("Error, por favor contacte a soporte!")
        setMsgType("error")
      }
    }
    // Si se completó todo, hubó éxito.
    setOpen(true)
    setErrMsg("Participant added successfully!")
    setMsgType("success")
    setState({activityDescription:""});
    setState({email_contact:""});
    setState({participation_value:""});
  };


  const handleChange = (event) => {
    event.persist();
    setState({ ...state, [event.target.name]: event.target.value });
    console.log(state)
  };

  const {
    activityDescription,
    email_contact,
    participation_value,
  } = state;

  return (
    <div>
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
              label="activity description"
              onChange={handleChange}
              value={activityDescription || ""}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />

            <TextField
              type="text"
              name="email_contact"
              label="Contact's email"
              onChange={handleChange}
              value={email_contact || ""}
              validators={["required"]}
              errorMessages={["this field is required"]}
              // validators={['required', 'isEmail']}
              // errorMessages={['this field is required', 'email is not valid']}
            />

            <TextField
              type="text"
              name="participation_value"
              label="Participation Value"
              onChange={handleChange}
              value={participation_value || ""}
              // validators={["required"]}
              // errorMessages={["this field is required"]}
            />

          </Grid>

        </Grid>

        <LoadingButton color="primary" variant="contained" type="submit" loading={loading}>
          <Icon>send</Icon>
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add Contact</Span>
        </LoadingButton>
      </ValidatorForm>
    </div>
  );
};

export default SimpleForm;
