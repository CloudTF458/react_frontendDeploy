import { Box, styled, Typography } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import { useState } from "react";
import PaginationTable from "./PaginationTable";
import SaldoContactsForm from "./SaldoContactsForm";


const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const SaldoContacts = () => {
  const [selectedContact, setSelectedContact] = useState(null)

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Contacts", path: "/contacts/balance" }, { name: "Balance" }]} />
      </Box>
      <SimpleCard title="Form to help contacts!">
        <SaldoContactsForm selectedContact={selectedContact} />
      </SimpleCard>
      <SimpleCard title="Contact's balance">
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left'}}>
          How much your contacts owe you?
        </Typography>
        <PaginationTable setSelectedContact={setSelectedContact} />
      </SimpleCard>
    </Container>
  );
};

export default SaldoContacts;
