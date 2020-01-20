import React, { useState, useCallback } from 'react';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import TableListTitle from './TableListTitle/TableListTitle';
import TableItem from './TableItem/TableItem';
import { SORT_DIRECTIONS } from '../../constants/common';
import { sortByString, sortByStringContainsNumber } from '../../../helpers/filter-functions';


const Table = React.memo((
  {
    filterable, columnsList, items, filterConfig, onRowClick,
    defaultSortField, defaultFilterField = '', title
  }
) => {
  const [currentFilterQuery, setCurrentFilterQuery] = useState('');
  const [sortByField, setSortByField] = useState(defaultSortField);
  const [sortDirection, setSortDirection] = useState(SORT_DIRECTIONS.ASC);
  const [sortValuesType, setSortValuesType] = useState('string');
  const [fieldToFilter, setFieldToFilter] = useState(defaultFilterField);

  const handleClickOnItem = useCallback(rowData => {
    if (typeof onRowClick === 'function') {
      onRowClick(rowData);
    }
  }, [onRowClick]);

  const handleFilterInput = useCallback(event => {
    setCurrentFilterQuery(event.target.value);
  }, [setCurrentFilterQuery]);

  const handleSortClick = useCallback(sortData => {
    setSortByField(sortData.field);
    setSortDirection(sortData.direction);
    setSortValuesType(sortData.sortValuesType || 'string');
  }, []);

  const handleFilterSelectChange = useCallback(event => {
    setFieldToFilter(event.target.value);
  }, []);

  const filterItems = useCallback(items => items.filter(item => {
    if (isFinite(item[fieldToFilter])) {
      return `${ item[fieldToFilter] }`.includes(currentFilterQuery)
    }
    return item[fieldToFilter].includes(currentFilterQuery);
  }), [currentFilterQuery, fieldToFilter]);

  const sortItems = useCallback(items => {
    if (sortValuesType === 'string') {
      return sortByString(items, sortDirection, sortByField);
    }
    return sortByStringContainsNumber(items, sortDirection, sortByField);
  }, [sortByField, sortDirection, sortValuesType]);

  const processItemsList = useCallback(items => {
    let preparedItems = [...items];

    if (defaultFilterField) {
      preparedItems = filterItems(preparedItems);
    }

    return sortItems(preparedItems);
  }, [defaultFilterField, filterItems, sortItems]);

  return (
    <div className='table'>
      <div className='table__header'>
        { title && <h2>{ title }:</h2> }
        { filterable && (
          <div className='table__header-filter'>
            <FormControl variant="outlined" component={ 'div' }>
              <InputLabel>
                Filter by field
              </InputLabel>
              <Select
                value={ fieldToFilter }
                onChange={ handleFilterSelectChange }
                labelWidth={ 100 }
              >
                { filterConfig.map(configItem => (
                  <MenuItem
                    key={ configItem.value }
                    value={ configItem.value }
                    component={ 'div' }
                    button={ false }
                  >
                    { configItem.label }
                  </MenuItem>
                )) }
              </Select>
            </FormControl>
            <FormControl
              className='table__form-control-filter-input'
              component={ 'div' }
            >
              <TextField
                className='table__filter-input'
                label="Type to filter"
                variant="outlined"
                value={ currentFilterQuery }
                onChange={ handleFilterInput }
              />
            </FormControl>
          </div>
        ) }

        <div className='table__header-titles'>
          { columnsList.map(columnField => (
            <TableListTitle
              key={ columnField.value }
              item={ columnField }
              active={ columnField.value === sortByField }
              sortDirection={ sortDirection }
              onSortClick={ handleSortClick }
            />
          )) }
        </div>
      </div>

      <div className='table__main'>
        { !items.length && (
          <div className='table__no-content-message'>
            No content yet...
          </div>
        ) }
        { processItemsList(items).map(entity => (
          <TableItem
            key={ entity.id || entity.name }
            className='table__item'
            item={ entity }
            columnsList={ columnsList }
            onClick={handleClickOnItem}
          />
        )) }
      </div>
    </div>
  );
});

export default Table;
