import {
  Box,
  styled,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import * as utils from 'app/utils/utils';
import { userContext } from "../../contexts/user-context";

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0 } },
  },
}));

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
      <StyledTable responsive>
        <TableHead>
          <TableRow>
            <TableCell align="center">Event</TableCell>
            <TableCell align="center">Participant</TableCell>
            <TableCell align="center">Creator</TableCell>
            <TableCell align="center">Pending<br />balance</TableCell>
            <TableCell align="center">Total<br />balance</TableCell>
            <TableCell align="center">Accepted</TableCell>
            <TableCell align="right">Fetch Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {eventList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((event, index) => (
              <TableRow key={index}>
                <TableCell align="center">{event.evento}</TableCell>
                <TableCell align="center">{event.usuario_participante}</TableCell>
                <TableCell align="center">{event.evento_creador}</TableCell>
                <TableCell align="center">{event.aceptado}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleFetch(event)}>
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
