const parseInteger = stringContainsNumber => {
  return parseInt(stringContainsNumber, 10);
};

export const sortByString = (list, direction, field) => {
  return list.sort((a, b) => {
    if (a[field] === b[field]) {
      return 0;
    } else if (direction === 'asc') {
      return a[field] > b[field] ? 1 : -1;
    }

    return a[field] < b[field] ? 1 : -1;
  });
};

export const sortByStringContainsNumber = (list, direction, field) => {
  return list.sort((a, b) => {
    if (parseInteger(a) === parseInteger(b)) {
      return 0;
    } else if (direction === 'asc') {
      return parseInteger(a[field]) > parseInteger(b[field]) ? 1 : -1;
    }

    return parseInteger(a[field]) < parseInteger(b[field]) ? 1 : -1;
  });
};
