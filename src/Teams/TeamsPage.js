import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import useHttp from '../shared/hooks/http';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  card: { width: 275 },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: { fontSize: 14 },
  pos: { marginBottom: 12 },
});

const TeamsPage = React.memo(() => {
  const { sendRequest } = useHttp();
  const classes = useStyles();
  const [teamsList, setTeamsList] = useState([]);

  const fetchTeams = useCallback(async () => {
    const response = await sendRequest('teams');
    if (response && response.data) {
      setTeamsList(response.data);
    }
  }, [sendRequest]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return (
    <div className='teams-page'>
      <header className='teams-page__header'>
        <h1>Teams</h1>
      </header>
      <main className='teams-page__main'>
        { teamsList.length ?
          teamsList.map(team => (
            <Card
              style={ { 'color': team.colour } }
              key={ team.id }
              className={ classNames(['teams-page__card', classes.card]) }
            >
              <CardContent>
                <Avatar
                  src={ team.logo_url }
                  variant='square'
                  component='div'
                />
                <Typography
                  variant='h5'
                  component='h2'
                >
                  { team.name }
                </Typography>
                <Typography
                  className={ classes.pos }
                  component='span'
                  color="textSecondary"
                >
                  { team.founded }
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">
                  <Link to={ `/team/${ team.id }` }>Learn more</Link>
                </Button>
              </CardActions>
            </Card>
          ))
          :
          'No teams yet'
        }
      </main>
    </div>
  );
});

export default TeamsPage;
