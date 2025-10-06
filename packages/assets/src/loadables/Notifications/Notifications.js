import React from 'react';

const Loadable = React.lazy(() => import('../../pages/Notifications/Notifications'));

export default Loadable;
