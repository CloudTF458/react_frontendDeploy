import { Stack, Typography } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Breadcrumb, SimpleCard } from "app/components";
import { useState } from "react";
import ModifyActivitiesForm from "./ModifyActivitiesForm";
import ModifyActivitiesTable from "./ModifyActivitiesTable";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const CrearActividad = () => {
  const [selectedActivity, setSelectedActivity] = useState(null)

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Activity", path: "/modify/activities" }, { name: "Modify" }]} />
      </Box>

      <Stack spacing={3}>
        <SimpleCard title="Modify Activities Form">
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'left'}}>
            NOTE: if you don't want to modify activity's description or another field, just copy 
            and past the same value in the corresponding field. Please don't type blank spaces.
          </Typography>
          <ModifyActivitiesForm selectedActivity={selectedActivity} />
        </SimpleCard>

        <SimpleCard title="My created activities">
          <ModifyActivitiesTable setSelectedActivity={setSelectedActivity} />
        </SimpleCard>
      </Stack>
    </Container>
  );
};

export default CrearActividad;