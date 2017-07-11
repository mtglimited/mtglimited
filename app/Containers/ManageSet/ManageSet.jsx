import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';

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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1>{set.get('name')}</h1>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {set.get('cards').map(card => card && (
            <img
              alt={card.get('imageName')}
              style={{ width: 223 }}
              src={`${baseUrl}/${code}/${card.get('imageName')}.jpeg`}
              key={card.imageName}
            />
          ))}
        </div>
      </div>
    );
  }
}
