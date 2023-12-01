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

const PendingBalanceTable = ({ setSelectedBalance }) => {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const context = useContext(userContext);
  const [pendingBalanceList, setPendingBalanceList] = useState([]);

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
        const response = await utils.verSaldosPendientes(config);
        console.log("response:", response.eventos_actividades)
        await setPendingBalanceList(response.eventos_actividades);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    configLista();
  }, [context.user_data, context.token, pendingBalanceList]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFetch = (data) => {
    setSelectedBalance(data)
  }

  if (pendingBalanceList == null){
    return <p>No data found!.</p>;
  }
  else if (pendingBalanceList.length === 0) {
    return <p>No data found!.</p>;
  }
  return (
    <Box width="100%" overflow="auto">
      <StyledTable responsive>
        <TableHead>
          <TableRow>
            <TableCell align="center">Activity</TableCell>
            <TableCell align="center">Event</TableCell>
            <TableCell align="center">Pending<br />balance</TableCell>
            <TableCell align="center">Total<br />balance</TableCell>
            <TableCell align="center">Accepted</TableCell>
            <TableCell align="right">Fetch Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingBalanceList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((balance, index) => (
              <TableRow key={index}>
                <TableCell align="center">{balance.actividad}</TableCell>
                <TableCell align="center">{balance.evento}</TableCell>
                <TableCell align="center">${balance.saldo_pendiente}</TableCell>
                <TableCell align="center">${balance.saldo_total}</TableCell>
                <TableCell align="center">{balance.aceptado}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleFetch(balance)}>
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
        count={pendingBalanceList.length}
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
