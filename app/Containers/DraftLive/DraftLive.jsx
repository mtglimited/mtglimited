import React from 'react';
import FlatButton from 'material-ui/FlatButton';

export default class DraftLive extends React.Component {
  static propTypes = {

  };

  render() {
    return (
      <div>
        <h1>Draft Live</h1>
        <FlatButton
          label="Generate a booster pack"
          primary
          onTouchTap={this.generateBooster}
        />
      </div>
    );
  }
}
