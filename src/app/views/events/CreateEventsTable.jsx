import {
  Box,
  styled,
  Table,
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

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0 } },
  },
}));

const PendingBalanceTable = () => {
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

  if (createdEvents == null){
    return <p>No data found!.</p>;
  }
  else if (createdEvents.length === 0) {
    return <p>No data found!.</p>;
  }
  return (
    <Box width="100%" overflow="auto">
      <StyledTable responsive>
        <TableHead>
          <TableRow>
            <TableCell align="center">Event</TableCell>
            <TableCell align="center">Event<br />type</TableCell>
            <TableCell align="center">Picture</TableCell>
            <TableCell align="center">Creator</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {createdEvents
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((events, index) => (
              <TableRow key={index}>
                <TableCell align="center">{events.evento}</TableCell>
                <TableCell align="center">{events.evento_tipo}</TableCell>
                <TableCell align="center">
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar src={events.evento_foto} />
                  </div>
                </TableCell>
                <TableCell align="center">{events.evento_creador}</TableCell>
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
