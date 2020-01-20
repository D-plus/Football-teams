import React from 'react';

const StatisticInfo = React.memo(({ info }) => {
  return (
    <div className='statistic-info'>
      <h3>Total results:</h3>
      <span>points: { info.points }</span>
      <span>scored: { info.totalScored }</span>
      <span>conceded: { info.totalConceded }</span>
    </div>
  );
});

export default StatisticInfo;
