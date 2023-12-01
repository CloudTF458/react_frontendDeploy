import {
  Box,
  Icon,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Snackbar,
  Alert
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import * as utils from 'app/utils/utils';
import { userContext } from "../../contexts/user-context";
import React from "react";

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0 } },
  },
}));

const PendingBalanceTable = ({ setSelectedData }) => {
  const context = useContext(userContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [createdEvents, setCreatedEvents] = useState([])

  const [open, setOpen] = React.useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [msgType, setMsgType] = useState("error");

  useEffect(() => {
    const fetchData = async () => {
      // Se obtienen los eventos creados por el usuario.
      const usuario = context.user_data;
      console.log("AuthContext:", usuario)

      const config = {
        method: "GET",
        headers: {
          Authorization: `Token ${context.token}`,
          "Content-type": "application/json",
        },
      };

      try {
        const response = await utils.verTodasLosParticipantesDeEventos(config);
        console.log("response:", response.eventos_creados)
        await setCreatedEvents(response.eventos_creados);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [context.user_data, context.token, createdEvents]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteParticipant = async (event) => {
    console.log("Datos del participante a desvincular:", event);
    // Se elimina al participante
    let usuario = context.user_data
    console.log("context:",usuario)
    const body = {
      "descripcion": event.actividad,
      "correo_contacto": event.email_participante
    }
    console.log("body:",  body)

    const config = {
      method: "POST",
      headers: {
        Authorization: `Token ${context.token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    };
    try {
      let response = await utils.eliminarParticipante(config)
      if (response.error){
        setOpen(true)
        setErrMsg(`Error: ${JSON.stringify(response.error_cause)}`)
        setMsgType("error")
        return ;
      }
      else {
        setOpen(true)
        setErrMsg("Participant deleted successfully!")
        setMsgType("success")
      }
      console.log("response:", response)
    }
    catch (e) {
      console.error("exception:", e)
      setOpen(true)
      setErrMsg("Error, por favor contacte a soporte!")
      setMsgType("error")
    }
  };

  function handleClose(_, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  const handleFetch = (data) => {
    setSelectedData(data)
  }

  if (createdEvents == null){
    return <p>No data found!.</p>;
  }
  else if (createdEvents.length === 0) {
    return <p>No data found!.</p>;
  }
  return (
    <Box width="100%" overflow="auto">
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={msgType} sx={{ width: "100%" }} variant="filled">
            {errMsg}
          </Alert>
      </Snackbar>
      <StyledTable responsive>
        <TableHead>
          <TableRow>
            <TableCell align="center">Activity</TableCell>
            <TableCell align="center">Event</TableCell>
            <TableCell align="center">Participantion<br />value</TableCell>
            <TableCell align="center">Participant's<br />Username</TableCell>
            <TableCell align="center">Event's<br />Creator</TableCell>
            <TableCell align="center">Accepted</TableCell>
            <TableCell align="center">Remove</TableCell>
            <TableCell align="right">Fetch Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {createdEvents
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((events, index) => (
              <TableRow key={index}>
                <TableCell align="center">{events.actividad}</TableCell>
                <TableCell align="center">{events.evento}</TableCell>
                <TableCell align="center">{events.valor_participacion}</TableCell>
                <TableCell align="center">{events.usuario_participante}</TableCell>
                <TableCell align="center">{events.evento_creador}</TableCell>
                <TableCell align="center">{events.aceptado}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleDeleteParticipant(events)}>
                    <Icon color="error">close</Icon>
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleFetch(events)}>
                    <Icon color="info">edit</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>

      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={createdEvents.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />
    </Box>
  );
};

export default PendingBalanceTable;
