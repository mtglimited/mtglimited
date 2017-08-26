import React from 'react';
import Hero from 'grommet/components/Hero';
import Image from 'grommet/components/Image';
import Heading from 'grommet/components/Heading';
import UserIcon from 'grommet/components/icons/base/User';
import StarIcon from 'grommet/components/icons/base/Star';
import TrophyIcon from 'grommet/components/icons/base/Trophy';
import Paragraph from 'grommet/components/Paragraph';

import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Card from 'grommet/components/Card';

const Home = () => (
  <div>
    <Hero
      background={<Image
        src="http://mramerica.freeplay.life/wp-content/uploads/2016/05/Volunteer.jpg"
        fit="cover"
        full
      />}
      backgroundColorIndex="dark"
    />
    <Tiles fill margin="small">
      <Tile basis="1/3">
        <Card
          align="center"
          thumbnail={<UserIcon size="large" />}
          heading={<Heading tag="h2" align="center">Register</Heading>}
          description={<Paragraph align="center" size="large">Sign up is easy with Facebook and Gmail.</Paragraph>}
        />
      </Tile>
      <Tile basis="1/3">
        <Card
          align="center"
          thumbnail={<StarIcon size="large" />}
          heading={<Heading tag="h2" align="center">Volunteer</Heading>}
          description={<Paragraph align="center" size="large">Begin volunteering right away by connecting with local organizers.</Paragraph>}
        />
      </Tile>
      <Tile basis="1/3">
        <Card
          align="center"
          thumbnail={<TrophyIcon size="large" />}
          heading={<Heading tag="h2" align="center">Win</Heading>}
          description={<Paragraph align="center" size="large">Compete to be on top of the leaderboards.</Paragraph>}
        />
      </Tile>
    </Tiles>
  </div>
);

export default Home;
