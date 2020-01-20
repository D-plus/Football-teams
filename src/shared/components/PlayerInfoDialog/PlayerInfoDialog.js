import React, { useState, useCallback, useEffect } from 'react';
import useHttp from '../../hooks/http';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DetailedInfo from '../DetailedInfo/DetailedInfo';
import { CLUBS_HISTORY_COLUMNS, PLAYER_DETAILS_FIELDS_CONFIG } from '../../constants/common';
import Table from '../Table/Table';


const PlayerInfoDialog = React.memo(({ player, open, onClose }) => {
  const { sendRequest } = useHttp();
  const [playerClubsHistory, setPlayerClubsHistory] = useState([]);

  const fetchPlayingClubHistory = useCallback(async playerClubHistory => {
    const uniqueClubIdsList = [];
    playerClubHistory.forEach(club => {
      if (!uniqueClubIdsList.includes(club.team_id)) {
        uniqueClubIdsList.push(club.team_id);
      }
    });

    const fetchedClubsHistory = await Promise.all(
      uniqueClubIdsList.map(clubId => sendRequest('teams', { id: clubId }))
    );
    const processedClubsHistory = fetchedClubsHistory
      .filter(response => response.success)
      .map(clubHistory => {
        const clubHistoryInitialData = playerClubHistory.find(club => club.team_id === clubHistory.data[0].id);
        return {
          ...clubHistory.data[0],
          ...clubHistoryInitialData,
        };
      });

    setPlayerClubsHistory(processedClubsHistory);
  }, [sendRequest]);

  useEffect(() => {
    if (open && Array.isArray(player.history) && player.history.length) {
      fetchPlayingClubHistory(player.history);
    } else {
      setPlayerClubsHistory([]);
    }
  }, [open, player, fetchPlayingClubHistory]);

  return (
    <div className='player-info-dialog-wrapper'>
      <Dialog
        className='player-info-dialog'
        open={ open }
        onClose={ onClose }
        aria-labelledby='form-dialog'
        fullScreen
      >
        <DialogTitle>Player information</DialogTitle>
        <DialogContent>
          { player && (
            <div className='player-info-dialog__main'>
              <DetailedInfo
                title='Player details'
                fieldsConfig={ PLAYER_DETAILS_FIELDS_CONFIG }
                item={ player }
                image={ player.flag_url }
              />

              <Table
                title={'Clubs history'}
                filterable={ false }
                defaultSortField={ CLUBS_HISTORY_COLUMNS[1].value }
                items={ playerClubsHistory }
                columnsList={ CLUBS_HISTORY_COLUMNS }
              />
            </div>
          ) }
        </DialogContent>
        <DialogActions>
          <Button
            onClick={ onClose }
            color='primary'
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

export default PlayerInfoDialog;
