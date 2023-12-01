import {
  Box,
  Card,
  styled,
  // Table,
  TableBody,
  TableCell,
  Fab,
  Icon,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import { useState, useEffect, useContext } from "react";
import * as utils from 'app/utils/utils';
import { userContext } from "../../../contexts/user-context";
import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const StarOutline = styled(Fab)(() => ({
  marginLeft: 0,
  boxShadow: 'none',
  color: '#ff9e00 !important',
  backgroundColor: '#fefd95 !important',
  cursor: 'default',
}));

const StyledTable = styled(Table)(({ theme }) => ({
  
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0 } },
  },
}));

const CardHeader = styled(Box)(() => ({
  display: 'flex',
  paddingLeft: '24px',
  paddingRight: '24px',
  marginBottom: '12px',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const Title = styled('span')(() => ({
  fontSize: '1rem',
  fontWeight: '500',
  textTransform: 'capitalize',
}));

const TopSellingTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const context = useContext(userContext);
  const [pendingBalanceList, setPendingBalanceList] = useState([]); 

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
 
  useEffect(() => {
    async function fetchData() {
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
        console.log("response:", response)
        if (!response.error) {
          await setPendingBalanceList(response.eventos_actividades);
        }
        else {
          console.error("Error:", response.error);    
          await setPendingBalanceList([{actividad: 'Not Found!', evento: 'Not Found!', saldo_pendiente: '0'}])
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    fetchData()
  }, [context.token, context.user_data]);

  return (
    <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
      <CardHeader>
        <Title>Pending Balance</Title>
        <StarOutline size="small">
          <Icon>warning</Icon>
        </StarOutline>
        <StarOutline size="small" sx={{ backgroundColor: 'rgba(9, 182, 109, 0.15) !important' }}>
          <Icon sx={{ color: '#08ad6c' }}>monetization_on</Icon>
        </StarOutline>
      </CardHeader>

      <Box overflow="auto">
        <Table>
          <Thead>
            <Tr>
              <Th align="center">Activity</Th>
              <Th align="center">Event</Th>
              <Th align="center">Pending</Th>
              <Th align="center">Total</Th>
              <Th align="center">Accepted</Th>
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
    </Card>
  );
};

export default TopSellingTable;
