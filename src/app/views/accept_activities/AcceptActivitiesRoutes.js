import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const NotFound = Loadable(lazy(()=> import('./NotFound')));
const AcceptInvitation = Loadable(lazy(()=> import('./acceptActivities')));

const eventRoutes = [
    { path: '/accept/invitation', element: <AcceptInvitation /> },
    { path: '/events/404', element: <NotFound /> },
];
    
export default eventRoutes;