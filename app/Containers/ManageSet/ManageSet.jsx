import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';

import Image from 'grommet/components/Image';
import Box from 'grommet/components/Box';
import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';

@firebaseConnect(({ params }) => [`/sets/${params.code}`])
@connect(({ firebase }, { params }) => ({
  set: firebase.data.sets && fromJS(firebase.data.sets[params.code]),
}))
export default class ManageSet extends React.Component {
  static propTypes = {
    set: PropTypes.shape(),
  };

  render() {
    const { set } = this.props;
    const baseUrl = 'https://storage.googleapis.com/mtglimited-154323.appspot.com/cards';
    if (!set) {
      return null;
    }
    const code = set.get('code');

    return (
      <Box>
        <h1>{set.get('name')}</h1>

        <Tiles
          fill
          flush={false}
        >
          {set.get('cards').map(card => card && (
            <Tile>
              <Image
                caption={card.get('imageName')}
                size="small"
                src={`${baseUrl}/${code}/${card.get('imageName')}.jpeg`}
                key={card.imageName}
              />
            </Tile>
          ))}
        </Tiles>
      </Box>
    );
  }
}
