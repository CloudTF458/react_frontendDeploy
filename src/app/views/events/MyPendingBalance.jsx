import { Box, styled, Stack } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import { useState } from "react";
import PendingBalanceTable from "./PendingBalanceTable";
import PendingBalanceForm from "./PendingBalanceForm";


const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const MyPendingBalance = () => {
  const [selectedBalance, setSelectedBalance] = useState(null)

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Events", path: "/my-pending/balance" }, { name: "Balance" }]} />
      </Box>
    <Stack spacing={3}>
      <SimpleCard title="Payment form">
        <PendingBalanceForm selectedBalance={selectedBalance} />
      </SimpleCard>

      <SimpleCard title="Pending balance">
        <PendingBalanceTable setSelectedBalance={setSelectedBalance} />
      </SimpleCard>
    </Stack>
    </Container>
  );
};

export default MyPendingBalance;
