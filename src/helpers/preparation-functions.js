import { formatDate, processGameResult } from './calculations-fucntions';

export const processGames = games => {
  const preparedGames = games.map(({ date, team_one_goals, team_two_goals, id }) => ({
    id,
    date: formatDate(date),
    gameResult: processGameResult(team_one_goals, team_two_goals),
    goalsConceded: team_two_goals,
    goalsScored: team_one_goals,
  }));

  const goalsWithPoints = preparedGames.reduce((result, { goalsScored, goalsConceded }) => {
    let calculatedPoints = 0;
    if (goalsScored > goalsConceded) {
      calculatedPoints += 3;
    } else if (goalsScored === goalsConceded) {
      calculatedPoints += 1;
    }

    return {
      totalScored: result.totalScored + goalsScored,
      totalConceded: result.totalConceded + goalsConceded,
      points: result.points + calculatedPoints,
    };
  }, { totalScored: 0, totalConceded: 0, points: 0 });

  return { preparedGames, goalsWithPoints };
};
