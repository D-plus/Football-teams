export const PLAYERS_LIST_COLUMNS = [
  { label: 'name', value: 'name', sortable: true, },
  { label: 'age', value: 'age', sortable: true, sortValuesType: 'number', },
  { label: 'nationality', value: 'nationality', sortable: true, },
  { label: 'position', value: 'position', sortable: false, },
];

export const TEAM_GAMES_COLUMNS = [
  { label: 'date', value: 'date', sortable: false },
  { label: 'result', value: 'gameResult', sortable: true, },
  { label: 'scored', value: 'goalsScored', sortable: true, sortValuesType: 'number' },
  { label: 'tie', value: 'goalsConceded', sortable: true, sortValuesType: 'number' },
];

export const CLUBS_HISTORY_COLUMNS = [
  { label: 'name', value: 'name', sortable: false },
  { label: 'city', value: 'city', sortable: false },
  { label: 'founded', value: 'founded', sortable: false },
  { label: 'budget', value: 'budget', sortable: false },
  { label: 'goals scored', value: 'goals', sortable: false },
  { label: 'apps', value: 'apps', sortable: false },
];

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
};

export const PLAYERS_FILTERS_LIST = [
  { label: 'Team id', value: 'team_id' },
  { label: 'Name', value: 'name' },
  { label: 'Age', value: 'age' },
  { label: 'Nationality', value: 'nationality' },
];

export const TEAM_PAGE_DETAILS_FIELDS_CONFIG = [
  { label: 'name', value: 'name' },
  { label: 'city', value: 'city' },
  { label: 'founded', value: 'founded' },
  { label: 'budget', value: 'budget' },
  { label: 'total points', value: 'points' },
  { label: 'total scored', value: 'totalScored' },
  { label: 'total conceded', value: 'totalConceded' },
  { label: 'team colour', value: 'colour' },
];

export const PLAYER_DETAILS_FIELDS_CONFIG = [
  { label: 'name', value: 'name' },
  { label: 'Age', value: 'age' },
  { label: 'Nationality', value: 'nationality' },
  { label: 'Position', value: 'position' },
];

export const DEFAULT_LOGO = 'http://logofarma.com/wp-content/plugins/ether-builder/media/images/placeholder.png';
