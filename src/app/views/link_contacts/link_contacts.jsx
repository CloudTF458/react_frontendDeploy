import { Stack, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Breadcrumb, SimpleCard } from "app/components";
import { useState } from "react";
import LinkContactsForm from "./link_contacts_form";
import LinkContactsTable from "./LinkContactsTable";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AppForm = () => {
  const [selectedData, setSelectedData] = useState(null)

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Event", path: "/link/contacts" }, { name: "add_remove_contacts" }]} />
      </Box>

      <Stack spacing={3}>
        <SimpleCard title="Add or Remove Contacts Form">
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left'}}>
            NOTE: Please type a valid input, valid imputs follow this syntax, i.e.:
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left'}}>
            - Activity description: activity1
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left'}}>
            - Contact's email: a@a.com, a2@a.com, a3@a.com
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left'}}>
            - Participation values: 0.1, 0.4, 0.5 || 124, 5125, 5215
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left'}}>
            Also, Please don't type blank spaces.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left'}}>
            NOTE2: If you don't specify the Participation values, system will automatically set up 
            equal percentage to all participants.
          </Typography>
          <LinkContactsForm selectedData={selectedData} />
        </SimpleCard>
        <SimpleCard title="Created Events">
          <LinkContactsTable setSelectedData={setSelectedData} />
        </SimpleCard>
      </Stack>
    </Container>
  );
};

export default AppForm;
