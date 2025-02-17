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
import { Alert, Snackbar } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import * as utils from 'app/utils/utils';
import React from "react";
import { userContext } from "../../contexts/user-context"
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

  const StyledTable = styled(Table)(() => ({
    whiteSpace: "pre",
    "& thead": {
      "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
    },
    "& tbody": {
      "& tr": { "& td": { paddingLeft: 0, textTransform: "normal"}},
    },
  }));

  
  const PaginationActivitiesTable = ({ setSelectedActivity }) => {
    const context = useContext(userContext);
    const [activitiesList, setActivitiesList] = useState([]);
  
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = React.useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [msgType, setMsgType] = useState("error");

    useEffect(() => {
        const configLista = async () => {
          // Se obtienen los datos de los contactos
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
            const response = await utils.verTodasLasActividadesDeEventos(config);
            console.log("response:", response)
            // Actualiza el estado con los datos de contacto recibidos
            setActivitiesList(response.eventos_creados);
          } catch (error) {
            console.error("Error al obtener las actividades:", error);
          }
        };
    
        configLista();
      }, [context.user_data, activitiesList, context.token]);

    function handleClose(_, reason) {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    }
  
    const handleChangePage = (_, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const handleDeleteActivity = async (activity) => {
      console.log("Datos de la a eliminar:", activity);
      // Se elimina al contacto
      let usuario = context.user_data
      console.log("context:",usuario)
      const body = {
        "descripcion": activity.actividad,
      }
      console.log("body:",  body)

      const config = {
        method: "POST",
        headers: {
          Authorization: `Token ${context.token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };
      try {
        let response = await utils.eliminarActividad(config)
        if (response.error){
          setOpen(true)
          setErrMsg(`Error: ${JSON.stringify(response.error_cause)}`)
          setMsgType("error")
          return ;
        }
        else {
          setOpen(true)
          setErrMsg("Activity deleted successfully!")
          setMsgType("success")
        }
        console.log("response:", response)
      }
      catch (e) {
        console.error("exception:", e)
        setOpen(true)
        setErrMsg("Error, por favor contacte a soporte!")
        setMsgType("error")
      }
    };

    const handleFetch = (data) => {
      setSelectedActivity(data)
    }
  
    return (
      <Box width="100%" overflow-x="auto">
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={msgType} sx={{ width: "100%" }} variant="filled">
            {errMsg}
          </Alert>
        </Snackbar>

        <Table>
          <Thead>
            <Tr>
              <Th align="center">Description</Th>
              <Th align="center">Valor</Th>
              <Th align="center">Name</Th>
              <Th align="center">Type</Th>
              <Th align="center">Remove</Th>
              <Th align="center">Fetch</Th>
            </Tr>
          </Thead>
          <Tbody>
            {activitiesList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((activity, index) => (
                <Tr>
                  <Td align="center">{activity.actividad}</Td>
                  <Td align="center">{activity.actividad_valor}</Td>
                  <Td align="center">{activity.evento}</Td>
                  <Td align="center">{activity.actividad_usuario_propietario}</Td>
                  <Td align="center">
                    <IconButton onClick={() => handleDeleteActivity(activity)}>
                      <Icon color="error">close</Icon>
                    </IconButton>
                  </Td>
                  <Td align="center">
                    <IconButton onClick={() => handleFetch(activity)}>
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
          count={activitiesList.length}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{ "aria-label": "Next Page" }}
          backIconButtonProps={{ "aria-label": "Previous Page" }}
        />
      </Box>
    );
  };
  
  export default PaginationActivitiesTable;