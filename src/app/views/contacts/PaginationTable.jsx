import {
  Box,
  styled,
  Icon,
  IconButton,
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
      <Table>
        <Thead>
          <Tr>
            <Th align="center">Pending</Th>
            <Th align="center">Participant</Th>
            <Th align="center">Activity</Th>
            <Th align="center">A-Creator</Th>
            <Th align="center">Event</Th>
            <Th align="center">Accepted</Th>
            <Th align="center">Fetch Data</Th>
          </Tr>
        </Thead>
        <Tbody>
          {contactList
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((contact, index) => (
              <Tr>
                <Td align="center">${contact.saldo_pendiente}</Td>
                <Td align="center">{contact.nombre_usuario}</Td>
                <Td align="center">{contact.actividad}</Td>
                <Td align="center">{contact.actividad_usuario_propietario}</Td>
                <Td align="center">{contact.evento}</Td>
                <Td align="center">{contact.aceptado}</Td>
                <Td align="center">
                  <IconButton onClick={() => handleEditContact(contact)}>
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
