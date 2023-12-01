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
  const [allActivitiesEvents, setAllActivitiesEvents] = useState([]);

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
        const response = await utils.verEventosActividadesParticipante(config);
        // console.log("response:", response.eventos_actividades)
        // Obtenemos los eventos sin repetir

        // Utilizamos un conjunto para realizar un seguimiento de los nombres únicos
        const eventos_sin_repetir = new Set();
        let lista_eventos_sin_repetir = []

        for(let i = 0; i < response.actividades_en_que_participa.length; i++) {

          if (!eventos_sin_repetir.has(response.actividades_en_que_participa[i].evento)) { 
            eventos_sin_repetir.add(response.actividades_en_que_participa[i].evento)
            lista_eventos_sin_repetir.push(response.actividades_en_que_participa[i].evento)
          }

        }

        // Obtenemos a partir de los eventos todas sus actividades
        console.log("eventos_sin_repetir:",lista_eventos_sin_repetir)
        let lista_todas_actividades_eventos = []

        for(let i = 0; i < lista_eventos_sin_repetir.length; i++) {
          const body2 = {
            "nombre": lista_eventos_sin_repetir[i]
          }

          const config2 = {
            method: "POST",
            headers: {
              Authorization: `Token ${context.token}`,
              "Content-type": "application/json",
            },
            body: JSON.stringify(body2),
          };

          const response2 = await utils.verTodasActividadesUnEvento(config2);
          console.log("response2:", response2.actividades)

          for(let i = 0; i < response2.actividades.length; i++) {
            lista_todas_actividades_eventos.push(response2.actividades[i])
          }

        }

        await setAllActivitiesEvents(lista_todas_actividades_eventos);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    configLista();
  }, [context.user_data, context.token, allActivitiesEvents]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (allActivitiesEvents == null){
    return <p>No data found!.</p>;
  }
  else if (allActivitiesEvents.length === 0) {
    return <p>No data found!.</p>;
  }
  return (
    <Box width="100%" overflow="auto">
      <Table>
          <Thead>
            <Tr>
              <Th align="center">Activity</Th>
              <Th align="center">A-Creator</Th>
              <Th align="center">Event</Th>
              <Th align="center">E-Creator</Th>
              <Th align="center">E-type</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allActivitiesEvents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((evento, index) => (
                <Tr>
                  <Td align="center">{evento.actividad_descripcion}</Td>
                  <Td align="center">{evento.actividad_usuario_propietario}</Td>
                  <Td align="center">{evento.evento}</Td>
                  <Td align="center">{evento.evento_creador}</Td>
                  <Td align="center">{evento.evento_tipo}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>

      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={allActivitiesEvents.length}
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
