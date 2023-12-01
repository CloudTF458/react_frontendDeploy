import {
  Box,
  styled,
  Icon,
  IconButton,
  // Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Avatar,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import * as utils from 'app/utils/utils';
import { userContext } from "../../contexts/user-context";
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

const PendingBalanceTable = ({ setSelectedEvent }) => {
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
        const response = await utils.verEventosActividadesParticipante(config);
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

  const handleEditEvent = (event) => {
    setSelectedEvent(event)
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
            <Th align="center">E-type</Th>
            <Th align="center">Picture</Th>
            <Th align="center">Creator</Th>
            <Th align="center">Fetch</Th>
          </Tr>
        </Thead>
        <Tbody>
          {createdEvents
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((events, index) => (
              <Tr>
                <Td align="center">{events.evento}</Td>
                <Td align="center">{events.evento_tipo}</Td>
                <Td align="center">
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar src={events.evento_foto} />
                  </div>
                </Td>
                <Td align="center">{events.evento_creador}</Td>
                <Td align="center">
                  <IconButton onClick={() => handleEditEvent(events)}>
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
