import React, { useCallback } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortAmountDown, faSortAmountDownAlt } from '@fortawesome/free-solid-svg-icons'

import { SORT_DIRECTIONS } from '../../../constants/common';


const TableListTitle = React.memo(({ item, onSortClick, active, sortDirection }) => {
  const handleSortClick = useCallback((event) => {
    event.stopPropagation();

    const nextSortData = {
      field: item.value,
      direction: SORT_DIRECTIONS.ASC,
      sortValuesType: item.sortValuesType,
    };
    if (!active) {
      return onSortClick(nextSortData);
    }
    nextSortData.direction = sortDirection === SORT_DIRECTIONS.ASC ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC;
    onSortClick(nextSortData);
  }, [onSortClick, active, sortDirection, item.sortValuesType, item.value]);

  const sortIcon = () => {
    if (!active) {
      return faSort;
    } else if (sortDirection === SORT_DIRECTIONS.ASC) {
      return faSortAmountDownAlt;
    }

    return faSortAmountDown;
  };

  return (
    <div
      className={ classNames('table-title', { 'table-title_sortable': item.sortable }) }
      onClick={ handleSortClick }
    >
      <span className="table-title__label">{ item.label }</span>
      { item.sortable && (
        <span className={ classNames('table-title_sorting', { 'table-title_sorting__active': active }) }>
          <FontAwesomeIcon icon={ sortIcon() }/>
        </span>
      ) }
    </div>
  );
});

export default TableListTitle;
