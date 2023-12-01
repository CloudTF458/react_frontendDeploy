import {
  Box,
  Icon,
  IconButton,
  styled,
  // Table,
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
import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const ResponsiveTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  overflowX: "auto",
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

      <Table>
        <Thead>
          <Tr>
            <Th>Activity</Th>
            <Th>Event</Th>
            <Th>Participation</Th>
            <Th>Participant</Th>
            <Th>E-Creator</Th>
            <Th>Accepted</Th>
            {/* <Th>Remove</Th> */}
            <Th>Fetch Data</Th>
          </Tr>
        </Thead>
        <Tbody>
          {createdEvents
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((events, index) => (
              <Tr>
                <Td align="center">{events.actividad}</Td>
                <Td align="center">{events.evento}</Td>
                <Td align="center">{events.valor_participacion}</Td>
                <Td align="center">{events.usuario_participante}</Td>
                <Td align="center">{events.evento_creador}</Td>
                <Td align="center">{events.aceptado}</Td>
                {/* <Td align="center">
                  <IconButton onClick={() => handleDeleteParticipant(events)}>
                    <Icon color="error">close</Icon>
                  </IconButton>
                </Td> */}
                <Td align="center">
                  <IconButton onClick={() => handleFetch(events)}>
                    <Icon color="info">edit</Icon>
                  </IconButton>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>

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
