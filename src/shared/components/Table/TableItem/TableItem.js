import React, { useCallback } from 'react';


const TableItem = React.memo(({ columnsList, item, onClick }) => {
  const handleListItemClick = useCallback(event => {
    event.stopPropagation();

    if (typeof onClick === 'function') {
      onClick(item);
    }
  }, [onClick, item]);

  return (
    <div
      className='table-item'
      onClick={ handleListItemClick }
    >
      { columnsList.map(columnField => (
        <span
          key={ columnField.value }
          className='table-item__data'
        >
          { item[columnField.value] }
        </span>
      )) }
    </div>
  );
});

export default TableItem;
