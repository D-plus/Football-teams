import React, { useCallback, useState, useEffect } from 'react';

import useHttp from '../shared/hooks/http';
import Table from '../shared/components/Table/Table';
import DetailedInfo from '../shared/components/DetailedInfo/DetailedInfo';
import AddScoreDialog from '../shared/components/AddScoreDialog/AddScoreDialog';
import PlayerInfoDialog from '../shared/components/PlayerInfoDialog/PlayerInfoDialog';
import {
  PLAYERS_FILTERS_LIST,
  PLAYERS_LIST_COLUMNS, TEAM_GAMES_COLUMNS,
  TEAM_PAGE_DETAILS_FIELDS_CONFIG
} from '../shared/constants/common';
import { processGames } from '../helpers/preparation-functions';


const TeamPage = props => {
  const { sendRequest } = useHttp();
  const [team, setTeam] = useState({});
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [player, setPlayerState] = useState(false);

  const fetchTeam = useCallback(
    teamId => sendRequest('teams', { id: teamId }),
    [sendRequest]
  );

  const fetchPlayers = useCallback(
    teamId => sendRequest('teams/players', { team_id: teamId }),
    [sendRequest]
  );

  const fetchGames = useCallback(
    teamId => sendRequest('teams/games', { team_one_id: teamId }),
    [sendRequest]
  );

  const fetchInitData = useCallback(async () => {
    const teamId = props.match.params && props.match.params.id;
    if (teamId) {
      const [fetchedTeam, fetchedPlayers, fetchedGames] = await Promise.all(
        [fetchTeam(teamId), fetchPlayers(teamId), fetchGames(teamId)]
      );

      if (fetchedGames && fetchedGames.data) {
        const { preparedGames, goalsWithPoints } = processGames(fetchedGames.data);
        setTeam({ ...fetchedTeam.data[0], ...goalsWithPoints });
        setGames(preparedGames);
      }
      if (fetchedPlayers && fetchedPlayers.data) {
        setPlayers(fetchedPlayers.data);
      }
    }
  }, [fetchTeam, fetchPlayers, fetchGames, props.match.params]);

  useEffect(() => {
    fetchInitData();
  }, [fetchInitData]);

  const handleAddedScore = useCallback((gameScore) => {
    const { preparedGames, goalsWithPoints } = processGames(gameScore.result);
    setTeam((currentTeamData) => (
      {
        ...currentTeamData,
        totalScored: currentTeamData.totalScored + goalsWithPoints.totalScored,
        totalConceded: currentTeamData.totalConceded + goalsWithPoints.totalConceded,
        points: currentTeamData.points + goalsWithPoints.points,
      }
    ));
    setGames(currentGames => ([...currentGames, ...preparedGames]));
  }, []);

  const handleClickOnPlayer = useCallback(player => {
    setPlayerState(player);
  }, []);

  const handleClosePlayerInfoDialog = useCallback(() => {
    setPlayerState(null);
  }, []);

  return (
    <div className='team-page'>
      <header className='team-page__header'>
        <h1>Team: { props.match.params.id }</h1>
      </header>
      <main className='team-page__main'>
        <div className='team-page__team-info'>
          <DetailedInfo
            title='Team details'
            fieldsConfig={ TEAM_PAGE_DETAILS_FIELDS_CONFIG }
            item={ team }
            image={ team.logo_url }
          />
        </div>
        <AddScoreDialog
          teamId={team.id}
          onScoreAdded={handleAddedScore}
        />
        <div className='team-page__tables-wrapper'>
          <Table
            title={'Games played'}
            filterable={ false }
            defaultSortField={ TEAM_GAMES_COLUMNS[1].value }
            items={ games }
            columnsList={ TEAM_GAMES_COLUMNS }
          />
          <Table
            title='Players'
            filterable={ true }
            defaultSortField='name'
            defaultFilterField={ PLAYERS_FILTERS_LIST[1].value }
            items={ players }
            columnsList={ PLAYERS_LIST_COLUMNS }
            filterConfig={ PLAYERS_FILTERS_LIST }
            onRowClick={handleClickOnPlayer}
          />
        </div>
      </main>
      <PlayerInfoDialog
        open={!!player}
        player={player}
        onClose={handleClosePlayerInfoDialog}
      />
    </div>
  )
};

export default TeamPage;
