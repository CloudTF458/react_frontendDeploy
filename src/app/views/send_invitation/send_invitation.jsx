import { Stack, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Breadcrumb, SimpleCard } from "app/components";
import { useState } from "react";
import SendInvitationForm from "./send_invitation_form";
import SendInvitationTable from "./SendInvitationTable";

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
        <Breadcrumb routeSegments={[{ name: "Event", path: "/send/invitation" }, { name: "Send invitations" }]} />
      </Box>

      <Stack spacing={3}>
        <SimpleCard title="Send Invitations Form">
          <SendInvitationForm selectedData={selectedData} />
        </SimpleCard>
        <SimpleCard title="Sent invitations">
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left'}}>
            You can see here all your sent invitations.
          </Typography>
          <SendInvitationTable setSelectedData={setSelectedData} />
        </SimpleCard>
      </Stack>
    </Container>
  );
};

export default AppForm;
