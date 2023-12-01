import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const NotFound = Loadable(lazy(()=> import('./NotFound')));
const SendInvitation = Loadable(lazy(()=> import('./send_invitation.jsx')));

const eventRoutes = [
    { path: '/send/invitation', element: <SendInvitation /> },
    { path: '/events/404', element: <NotFound /> },
];
    
export default eventRoutes;