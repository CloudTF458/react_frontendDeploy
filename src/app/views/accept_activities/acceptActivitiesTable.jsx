import {
  Box,
  Icon,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import * as utils from 'app/utils/utils';
import { userContext } from "../../contexts/user-context";
import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const PendingBalanceTable = ({ setSelectedActivity }) => {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const context = useContext(userContext);
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    const configLista = async () => {
      // Se obtienen los saldos pendientes del usuario
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
        const response = await utils.verTusInvitacionesPendientes(config);
        console.error("response:", response.eventos)
        await setEventList(response.eventos);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    configLista();
  }, [context.user_data, context.token, eventList]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFetch = (data) => {
    setSelectedActivity(data)
  }

  if (eventList == null){
    return <p>No data found!.</p>;
  }
  else if (eventList.length === 0) {
    return <p>No data found!.</p>;
  }
  return (
    <Box width="100%" overflow="auto">
      <Table>
        <Thead>
          <Tr>
            <Th align="center">Event</Th>
            <Th align="center">Participant</Th>
            <Th align="center">E-Creator</Th>
            <Th align="center">Accepted</Th>
            <Th align="center">Fetch</Th>
          </Tr>
        </Thead>
        <Tbody>
          {eventList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((event, index) => (
              <Tr>
                <Td align="center">{event.evento}</Td>
                <Td align="center">{event.usuario_participante}</Td>
                <Td align="center">{event.evento_creador}</Td>
                <Td align="center">{event.evento_creador}</Td>
                <Td align="center">{event.aceptado}</Td>
                <Td align="center">
                  <IconButton onClick={() => handleFetch(event)}>
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
        count={eventList.length}
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
