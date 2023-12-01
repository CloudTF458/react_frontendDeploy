import AuthGuard from 'app/auth/AuthGuard';
import chartsRoute from 'app/views/charts/ChartsRoute';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';
import contactsRoutes from './views/contacts/ContactsRoutes';
import userRoutes from './views/users/UserRoutes';
import EventRoutes from './views/events/EventsRoutes';
import ActivitiesRoutes from './views/activities/ActivitiesRoutes';
import ModifyEventsRoutes from './views/modify_events/ModifyEventsRoutes';
import LinkContactsRoutes from './views/link_contacts/LinkContactsRoutes';
import SendInvitationRoutes from './views/send_invitation/SendInvitationRoutes';
import AcceptActivitiesRoutes from "./views/accept_activities/AcceptActivitiesRoutes";
import ActivitiesAllEventsRoutes from "./views/activities_all_events/ActivitiesAllEventsRoutes"

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [...dashboardRoutes, ...chartsRoute, ...materialRoutes, 
               ...contactsRoutes, ...userRoutes, ...EventRoutes,
               ...ModifyEventsRoutes, ...LinkContactsRoutes, ...AcceptActivitiesRoutes,
               ...ActivitiesAllEventsRoutes, ...ActivitiesRoutes, ...SendInvitationRoutes],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to="session/signin" /> },
  { path: '/dashboard', element: <Navigate to="default" /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
