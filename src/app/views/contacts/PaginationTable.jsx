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
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));

const PaginationTable = ({ setSelectedContact }) => {
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const context = useContext(userContext);

  const [contactList, setContactList] = useState([]); // Estado para almacenar los datos de contacto

  useEffect(() => {
    const configLista = async () => {
      // Se obtienen los datos de los contactos
      const usuario = context.user_data;
      console.log("AuthContext:", usuario)
      const body = {
        // "email": usuario.user_details.user.email,
        "email": usuario.user.email,
      };

      const config = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };

      try {
        const response = await utils.listContactsEvent(config);
        console.log("response:", response.contactos)
        // Actualiza el estado con los datos de contacto recibidos
        setContactList(response.contactos);
      } catch (error) {
        console.error("Error al obtener los contactos:", error);
      }
    };

    configLista();
  }, [context.user_data, contactList]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact)
  }

  if (contactList == null){
    return <p>No data found in contact's list!.</p>;
  }
  else if (contactList.length === 0) {
    return <p>No data found in contact's list!.</p>;
  }
  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left">Pending Balance</TableCell>
            <TableCell align="center">Participant's username</TableCell>
            <TableCell align="center">Activity</TableCell>
            <TableCell align="center">Activity's Owner</TableCell>
            <TableCell align="center">Event</TableCell>
            <TableCell align="center">Accepted</TableCell>
            <TableCell align="right">Fetch Data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contactList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((contact, index) => (
              <TableRow key={index}>
                <TableCell align="left">${contact.saldo_pendiente}</TableCell>
                <TableCell align="center">{contact.nombre_usuario}</TableCell>
                <TableCell align="center">{contact.actividad}</TableCell>
                <TableCell align="center">{contact.actividad_usuario_propietario}</TableCell>
                <TableCell align="center">{contact.evento}</TableCell>
                <TableCell align="center">{contact.aceptado}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEditContact(contact)}>
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
        count={contactList.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />
    </Box>
  );
};

export default PaginationTable;
