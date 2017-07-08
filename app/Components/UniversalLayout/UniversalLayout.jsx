import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import App from 'grommet/components/App';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Section from 'grommet/components/Section';
import Title from 'grommet/components/Title';
import Image from 'grommet/components/Image';
import Box from 'grommet/components/Box';
import Button from 'grommet/components/Button';
import Footer from 'grommet/components/Footer';
import Paragraph from 'grommet/components/Paragraph';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';

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

  signIn = async () => {
    const { firebase } = this.props;
    const auth = await firebase.login({
      provider: 'google',
      type: 'popup',
    });
    const { uid } = auth.user;
    await firebase.set(`users/${uid}/uid`, uid);
  }

  signOut = () => {
    this.setState({ profilePopoverIsOpen: false }, this.props.firebase.logout);
  }

  render() {
    const { auth } = this.props;

    return (
      <App>
        <Article full>
          <Header
            justify="between"
            pad="small"
          >
            <Title path="/">
              MTG LIMITED
            </Title>
            <Menu direction="row">
              <Anchor path="/">
                Home
              </Anchor>
              <Anchor path="/sets">
                Sets
              </Anchor>
            </Menu>
            <Box flex justify="end" direction="row">
              { auth.isEmpty &&
                <Button
                  label="Sign In"
                  onClick={this.signIn}
                  href="#"
                  primary
                />
              }
              { !auth.isEmpty &&
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
                    {auth.email}
                  </Box>
                  <Anchor href="#" onClick={this.signOut}>
                    Sign Out
                  </Anchor>
                </Menu>
              }
            </Box>
          </Header>
          <Section primary flex>
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
                © 2017 MTGLIMITED
              </Paragraph>
            </Box>
          </Footer>
        </Article>
      </App>
    );
  }
}
