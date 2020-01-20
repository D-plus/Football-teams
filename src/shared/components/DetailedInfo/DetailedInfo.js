import React from 'react';

import NumberFormat from 'react-number-format';
import { DEFAULT_LOGO } from '../../constants/common';

const DetailedInfo = React.memo(({ item, title, fieldsConfig, image }) => {
  const renderFieldValue = value => {
    let labelResult = (<span className="detailed-info__definition">{ item[value] || '-' }</span>);
    if (value === 'budget') {
      labelResult = <NumberFormat
        value={ item[value] }
        displayType={ 'text' }
        thousandSeparator={ true }
        decimalSeparator={ '.' }
        prefix={ '£' }
        renderText={ value => <span className="detailed-info__definition">{ value }</span> }
      />
    } else if (value === 'colour' && item[value]) {
      labelResult = (<div className="detailed-info__definition-color" style={ { backgroundColor: item[value] } }/>);
    }
    return labelResult;
  };

  return (
    <div className="detailed-info">
      <div className='detailed-info__logo-wrapper'>
        <img
          alt='Logo'
          className='detailed-info__logo'
          src={ image || DEFAULT_LOGO }
        />
      </div>
      <div className='detailed-info__description'>
        <h2 className="detailed-info__head-title">{ title }:</h2>
        { fieldsConfig.map(field =>
          <div
            key={ field.value }
            className="detailed-info__field"
          >
            <span className="detailed-info__title">{ field.label }: </span>
            { renderFieldValue(field.value) }
          </div>
        ) }
      </div>
    </div>
  );
});

export default DetailedInfo;
