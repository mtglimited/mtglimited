import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import SetActions from 'State/SetsRedux';
import CircularProgress from 'material-ui/CircularProgress';

const propTypes = {
  setList: PropTypes.array.isRequired,
  fetching: PropTypes.bool.isRequired,
  getSetsRequest: PropTypes.func.isRequired,
};

class SetSelector extends Component {
  componentDidMount() {
    this.props.getSetsRequest();
  }

  render() {
    return (
      <div>
        <h3>Select a Set</h3>
        {this.props.fetching &&
          <CircularProgress size={80} thickness={5} />
        }
        {this.props.setList.length &&
          <ul>
            {this.props.setList.map(set => (
              <li><Link to={`/draft/${set}`}>{set}</Link></li>
            ))}
          </ul>
        }
      </div>
    );
  }
}

SetSelector.propTypes = propTypes;

const mapStateToProps = state => ({
  setList: state.sets.list,
  fetching: state.users.fetching,
});

const mapDispatchToProps = dispatch => ({
  getSetsRequest: () => dispatch(SetActions.getSetsRequest()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SetSelector);
