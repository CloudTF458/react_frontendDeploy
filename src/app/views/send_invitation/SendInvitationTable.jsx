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
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import * as utils from 'app/utils/utils';
import { userContext } from "../../contexts/user-context";
import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

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
        const response = await utils.verInvitacionesPendientes(config);
        console.log("response:", response.eventos)
        await setCreatedEvents(response.eventos);
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
      <Table>
        <Thead>
          <Tr>
            <Th align="center">Event</Th>
            <Th align="center">Participant</Th>
            <Th align="center">E-Creator</Th>
            <Th align="center">Accepted</Th>
            <Th align="right">Fetch</Th>
          </Tr>
        </Thead>
        <Tbody>
          {createdEvents
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((events, index) => (
              <Tr>
                <Td align="center">{events.evento}</Td>
                <Td align="center">{events.usuario_participante}</Td>
                <Td align="center">{events.evento_creador}</Td>
                <Td align="center">{events.aceptado}</Td>
                <Td align="right">
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
