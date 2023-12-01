import {
  Box,
  styled,
  Icon,
  IconButton,
  // Table,
  TableBody,
  // Th,
  TableHead,
  TablePagination,
  TableRow,
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
      <Table>
        <Thead>
          <Tr>
            <Th align="center">Activity</Th>
            <Th align="center">Event</Th>
            <Th align="center">Pending</Th>
            <Th align="center">Total</Th>
            <Th align="center">Accepted</Th>
            <Th align="right">Fetch</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pendingBalanceList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((balance, index) => (
              <Tr>
                <Td align="center">{balance.actividad}</Td>
                <Td align="center">{balance.evento}</Td>
                <Td align="center">${balance.saldo_pendiente}</Td>
                <Td align="center">${balance.saldo_total}</Td>
                <Td align="center">{balance.aceptado}</Td>
                <Td align="right">
                  <IconButton onClick={() => handleFetch(balance)}>
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
