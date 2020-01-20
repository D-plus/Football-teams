export const processGameResult = (mainTeamGoals, enemyTeamGoals) => {
  let result = 'win';

  if (mainTeamGoals === enemyTeamGoals) {
    result = 'draw';
  } else if (mainTeamGoals < enemyTeamGoals) {
    result = 'loss';
  }

  return result;
};

export const formatDate = date => {
  let today = new Date(date);
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yy = `${today.getFullYear()}`.slice(-2);

  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }

  return `${dd}/${mm}/${yy}`;
};
