import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { firebaseConnect, populatedDataToJS } from 'react-redux-firebase';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

const mapStateToProps = ({ firebase }, { params }) => ({
  set: fromJS(populatedDataToJS(firebase, `sets/${params.code}`)),
});

@firebaseConnect(({ params }) => [`/sets/${params.code}`])
@connect(mapStateToProps)
export default class ManageSet extends React.Component {
  static propTypes = {
    set: PropTypes.shape(),
    firebase: PropTypes.shape(),
    params: PropTypes.shape(),
  };

  hashSet = () => {
    const { firebase, set, params } = this.props;
    firebase.remove(`/sets/${params.code}/hashedCards`);
    set.get('cards')
      .map(card => firebase.push(`/sets/${params.code}/hashedCards`, {
        ...card.toJS(),
      }));
  }

  render() {
    const { set, params } = this.props;
    const { code } = params;
    const baseUrl = 'https://storage.googleapis.com/mtglimited-154323.appspot.com/cards';
    if (!set) {
      return null;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1>{set.get('name')}</h1>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {set.get('hashedCards').map(card => (
            <img
              alt={card.get('imageName')}
              style={{ width: 223 }}
              src={`${baseUrl}/${code}/${card.get('imageName')}.jpeg`}
              key={card.imageName}
            />
          ))}
        </div>
        <RaisedButton label="Hash Set" primary onTouchTap={this.hashSet} />
      </div>
    );
  }
}
