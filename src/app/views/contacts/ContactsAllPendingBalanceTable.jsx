import {
  Box,
  styled,
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

const PendingBalanceTable = () => {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const context = useContext(userContext);
  const [allContactsPendings, setAllContactsPendings] = useState([]);

  useEffect(() => {
    const configLista = async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: `Token ${context.token}`,
          "Content-type": "application/json",
        },
      };

      try {
        const response = await utils.verSaldosPendientesContactos(config);
        await setAllContactsPendings(response.eventos_actividades);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    configLista();
  }, [context.user_data, context.token, allContactsPendings]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (allContactsPendings == null){
    return <p>No data found!.</p>;
  }
  else if (allContactsPendings.length === 0) {
    return <p>No data found!.</p>;
  }
  return (
    <Box width="100%" overflow="auto">
      <StyledTable responsive>
        <TableHead>
          <TableRow>
            <TableCell align="center">Contact</TableCell>
            <TableCell align="center">Pending<br />Balance</TableCell>
            <TableCell align="center">Activity</TableCell>
            <TableCell align="center">Event</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allContactsPendings
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((evento, index) => (
              <TableRow key={index}>
                <TableCell align="center">{evento.contacto}</TableCell>
                <TableCell align="center">{evento.saldo_pendiente}</TableCell>
                <TableCell align="center">{evento.actividad}</TableCell>
                <TableCell align="center">{evento.evento}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>

      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={allContactsPendings.length}
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
