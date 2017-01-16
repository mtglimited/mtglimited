import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchSets } from 'State/SetsRedux';
import { List, ListItem } from 'material-ui/List';

const propTypes = {
  availableSets: PropTypes.array.isRequired,
  fetchSets: PropTypes.func.isRequired,
};

const style = {
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
};

class SetSelector extends Component {
  componentDidMount() {
    this.props.fetchSets();
  }

  render() {
    return (
      <div style={style}>
        <h3>Select a Set</h3>
        {this.props.availableSets.length &&
          <List>
            {this.props.availableSets.map(set => (
              <Link to={`/draft/${set.abbr}`} key={set.abbr}>
                <ListItem>{set.name}</ListItem>
              </Link>
            ))}
          </List>
        }
      </div>
    );
  }
}

SetSelector.propTypes = propTypes;

const mapStateToProps = state => ({
  availableSets: state.sets.availableSets,
});

const mapDispatchToProps = dispatch => ({
  fetchSets: () => dispatch(fetchSets()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SetSelector);
