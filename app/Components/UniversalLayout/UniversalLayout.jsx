import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { browserHistory } from 'react-router';

import App from 'grommet/components/App';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Title from 'grommet/components/Title';
import Image from 'grommet/components/Image';
import Box from 'grommet/components/Box';
import Footer from 'grommet/components/Footer';
import Paragraph from 'grommet/components/Paragraph';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Toast from 'grommet/components/Toast';
import UserIcon from 'grommet/components/icons/base/User';

@firebaseConnect()
@connect(({ firebase: { auth } }) => ({ auth }))
export default class UniversalLayout extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    firebase: PropTypes.shape().isRequired,
    auth: PropTypes.shape(),
  };

  static defaultProps = {
    profile: null,
  };

  state = {
    profilePopoverIsOpen: false,
  };

  signIn = async (provider) => {
    const { firebase } = this.props;

    try {
      await firebase.logout();
      const auth = await firebase.login({
        provider,
        type: 'popup',
      });
      const { uid } = auth.user;
      await firebase.set(`users/${uid}/uid`, uid);
    } catch (error) {
      const email = error.email;
      if (error.code === 'auth/account-exists-with-different-credential') {
        firebase.auth().fetchProvidersForEmail(email).then((providers) => {
          this.setState({
            showLoginWarning: true,
            provider: providers[0],
          });
        });
      }
    }
  }

  signOut = () => {
    this.setState({ profilePopoverIsOpen: false }, this.props.firebase.logout);
  }

  render() {
    const { auth } = this.props;
    const { provider, showLoginWarning } = this.state;

    return (
      <App>
        {showLoginWarning &&
          <Toast status="warning" onClose={() => this.setState({ showLoginWarning: false })}>
            Please log in with your {provider} account and link this account
          </Toast>
        }
        <Article full>
          <Header
            justify="between"
            pad="small"
          >
            <Title onClick={() => browserHistory.push('/')}>
              voluntorious
            </Title>
            <Box flex={false} direction="row">
              { auth.isAnonymous &&
                <Menu
                  responsive
                  dropAlign={{
                    right: 'right',
                    top: 'top',
                  }}
                  icon={
                    <UserIcon />
                  }
                  label="Sign in"
                >

                  <Anchor onClick={() => this.signIn('google')}>
                    Sign in with Google
                  </Anchor>
                  <Anchor onClick={() => this.signIn('facebook')}>
                    Sign in with Facebook
                  </Anchor>
                </Menu>
              }
              { !auth.isAnonymous &&
                <Menu
                  responsive
                  dropAlign={{
                    right: 'right',
                    top: 'top',
                  }}
                  icon={
                    <Image
                      src={auth.photoURL}
                      size="thumb"
                      style={{ borderRadius: 12 }}
                    />
                  }
                >
                  <Box pad="small">
                    <Anchor path="/profile">
                      {auth.displayName}&nbsp;({auth.email})
                    </Anchor>
                    <Anchor href="#" onClick={this.signOut}>
                      Sign Out
                    </Anchor>
                  </Box>
                </Menu>
              }
            </Box>
          </Header>
          <Section primary flex pad="none">
            {this.props.children}
          </Section>
          <Footer
            pad="small"
            justify="between"
            align="end"
            primary
          >
            <Box
              direction="row"
              align="center"
              pad={{ between: 'medium' }}
            >
              <Paragraph margin="none">
                © 2017 voluntorious
              </Paragraph>
            </Box>
          </Footer>
        </Article>
      </App>
    );
  }
}
