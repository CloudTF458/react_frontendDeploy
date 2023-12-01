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
    Avatar,
  } from "@mui/material";
  import { Alert, Snackbar } from "@mui/material";
  import { useState, useEffect, useContext } from "react";
  import * as utils from 'app/utils/utils';
  import { userContext } from "../../contexts/user-context";
  import React from "react";
  import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
  import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
  
  const StyledTable = styled(Table)(() => ({

    whiteSpace: "pre",
    "& thead": {
      "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
    },
    "& tbody": {
      "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
    },
  }));
  
  // const contactList = [
  //   {
  //     nombre: "Pepito Perez",
  //     email: "pepitoperez@gmail.com",
  //     apodo: "Pepito400",
  //     avatar: "cat.png",
  //   },
  // ];
  
  const PaginationContactTable = () => {
    const context = useContext(userContext);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = React.useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [msgType, setMsgType] = useState("error");

    const [contactList, setContactList] = useState([]); // Estado para almacenar los datos de contacto

  useEffect(() => {
    const fetchData = async () => {
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
        const response = await utils.listContacts(config);
        console.log("response:", response.contactos)
        // Actualiza el estado con los datos de contacto recibidos
        setContactList(response.contactos);
      } catch (error) {
        console.error("Error al obtener los contactos:", error);
      }
    };

    fetchData();
  }, [context.user_data, contactList]);

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

    const handleDeleteContact = async (contact) => {
      console.log("Datos del contacto a eliminar:", contact);
      // Se elimina al participante de la activida
      let usuario = context.user_data
      console.log("context:",usuario)
      const body = {
        "correo_usuario": usuario.user.email,
        "correo_contacto": contact.email
      }
      console.log("body:",  body)

      const config = {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      };
      try {
        let response = await utils.eliminarContacto(config)
        if (response.error){
          setOpen(true)
          setErrMsg(`Error: ${JSON.stringify(response.error_cause)}`)
          setMsgType("error")
          return ;
        }
        else {
          setOpen(true)
          setErrMsg("Contact deleted successfully!")
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
  
    return (
      <Box width="100%" overflow="auto">
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={msgType} sx={{ width: "100%" }} variant="filled">
            {errMsg}
          </Alert>
        </Snackbar>

        <Table>
          <Thead>
            <Tr>
              <Th align="center">Name</Th>
              <Th align="center">Email</Th>
              <Th align="center">Username</Th>
              <Th align="center">Avatar</Th>
              <Th align="center">Remove</Th>
            </Tr>
          </Thead>
          <Tbody>
            {contactList
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((contact, index) => (
                <Tr>
                  <Td align="center">{contact.nombre}</Td>
                  <Td align="center">{contact.email}</Td>
                  <Td align="center">{contact.apodo}</Td>
                  <Td align="center">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Avatar src={contact.avatar} />
                    </div>
                  </Td>
                  <Td align="center">
                    <IconButton onClick={() => handleDeleteContact(contact)}>
                      <Icon color="error">close</Icon>
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
  
  export default PaginationContactTable;