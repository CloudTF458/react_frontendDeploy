import {
  Box,
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
      <Table>
          <Thead>
            <Tr>
              <Th align="center">Contact</Th>
              <Th align="center">Pending</Th>
              <Th align="center">Activity</Th>
              <Th align="center">Event</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allContactsPendings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((evento, index) => (
                <Tr>
                  <Td align="center">{evento.contacto}</Td>
                  <Td align="center">{evento.saldo_pendiente}</Td>
                  <Td align="center">{evento.actividad}</Td>
                  <Td align="center">{evento.evento}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>

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
