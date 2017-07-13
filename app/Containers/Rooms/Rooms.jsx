import React from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { firebaseConnect } from 'react-redux-firebase';
import { browserHistory } from 'react-router';

import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';

@firebaseConnect([
  {
    path: '/rooms',
    queryParams: [
      'orderByChild=isLive',
      'equalTo=false',
    ],
  },
])
@connect(({ firebase: { data: { rooms } } }) => ({ rooms }))
export default class Rooms extends React.Component {
  static propTypes = {
    rooms: PropTypes.object,
    showMyRooms: PropTypes.bool.isRequired,
    owner: PropTypes.string,
  };

  render() {
    const { owner, showMyRooms } = this.props;
    let rooms = fromJS(this.props.rooms || {});
    if (showMyRooms) {
      rooms = rooms.filter(room => room.get('owner') === owner);
    }

    return (
      <List>
        {rooms.count() === 0 &&
          <p>There are no current open drafts. Create a new one!</p>
        }
        {rooms.map((room, key) => (
          <ListItem
            key={key} // eslint-disable-line
            onClick={() => browserHistory.push(`/rooms/${key}`)}
          >
            <i
              className={`ss ss-${room.get('set').toLowerCase()}`}
              style={{ marginRight: 15 }}
            />
            {room.get('name')}
          </ListItem>
        )).valueSeq()}
      </List>
    );
  }
}
