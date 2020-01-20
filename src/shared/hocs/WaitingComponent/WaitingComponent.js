import React, { Suspense } from 'react';

const WaitingComponent = Component => {
  return props => (
    <Suspense fallback={'Loading'}>
      <Component {...props} />
    </Suspense>
  );
};

export default WaitingComponent;
