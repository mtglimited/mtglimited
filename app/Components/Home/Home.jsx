import React from 'react';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Headline from 'grommet/components/Headline';
import Hero from 'grommet/components/Hero';
import Image from 'grommet/components/Image';
import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import CurrencyIcon from 'grommet/components/icons/base/Currency';
import TriggerIcon from 'grommet/components/icons/base/Trigger';
import CubesIcon from 'grommet/components/icons/base/Cubes';
import Paragraph from 'grommet/components/Paragraph';

import Tiles from 'grommet/components/Tiles';
import Tile from 'grommet/components/Tile';
import Card from 'grommet/components/Card';

const Home = () => (
  <Article>
    <Hero
      background={<Image
        src="https://storage.googleapis.com/mtglimited-154323.appspot.com/img/lobby.jpg"
        fit="cover"
        full
      />}
      backgroundColorIndex="dark"
    >
      <Box
        direction="row"
        justify="center"
        align="center"
      >
        <Box
          basis="1/2"
          align="center"
          pad="medium"
        >
          <Button
            primary
            label="Go To The Draft Lobby"
            style={{ opacity: 1 }}
            path="/lobby"
          />
        </Box>
        <Box
          basis="1/2"
          align="start"
          pad="medium"
        >
          <Heading margin="none">
            Drafting made easy.
          </Heading>
        </Box>
      </Box>
    </Hero>
    <Section
      pad="large"
      justify="center"
      align="center"
      colorIndex="grey-4"
      direction="row"
    >
      <Tiles fill>
        <Tile basis="1/3">
          <Card
            align="center"
            thumbnail={<CurrencyIcon size="large" />}
            heading={<Heading tag="h2" align="center">Free.</Heading>}
            description={<Paragraph align="center" size="large">Use the cards you already have.</Paragraph>}
          />
        </Tile>
        <Tile basis="1/3">
          <Card
            align="center"
            thumbnail={<TriggerIcon size="large" />}
            heading={<Heading tag="h2" align="center">Interactive.</Heading>}
            description={<Paragraph align="center" size="large">Draft with your friends. Share your results with others.</Paragraph>}
          />
        </Tile>
        <Tile basis="1/3">
          <Card
            align="center"
            thumbnail={<CubesIcon size="large" />}
            heading={<Heading tag="h2" align="center">Data Driven.</Heading>}
            description={<Paragraph align="center" size="large">Use data to improve your drafting ability.</Paragraph>}
          />
        </Tile>
      </Tiles>
    </Section>
    <Section
      pad="large"
      justify="center"
      align="center"
    >
      <Headline margin="none">
        How does it work?
      </Headline>
    </Section>
    <Section
      justify="center"
      align="center"
      colorIndex="grey-4"
    >
      <Hero
        backgroundColorIndex="dark"
      >
        <Box
          direction="row"
          justify="center"
          align="center"
        >
          <Box
            basis="1/2"
            align="center"
            pad="medium"
          >
            <Image
              src="https://storage.googleapis.com/mtglimited-154323.appspot.com/img/draft-room.png"
              fit="cover"
              full
            />
          </Box>
          <Box
            basis="1/2"
            align="start"
            pad="medium"
          >
            <Heading margin="none">
              1. Create a room
            </Heading>
          </Box>
        </Box>
      </Hero>
    </Section>
    <Section
      justify="center"
      align="center"
    >
      <Hero
        backgroundColorIndex="dark"
      >
        <Box
          direction="row"
          justify="center"
          align="center"
        >
          <Box
            basis="1/2"
            align="start"
            pad="medium"
          >
            <Heading margin="none">
              2. Draft your deck
            </Heading>
          </Box>
          <Box
            basis="1/2"
            align="center"
            pad="medium"
          >
            <Image
              src="https://storage.googleapis.com/mtglimited-154323.appspot.com/img/draft-live.png"
              fit="cover"
              full
            />
          </Box>
        </Box>
      </Hero>
    </Section>
    <Section
      pad="large"
      justify="center"
      align="center"
      colorIndex="grey-4"
    >
      <Headline margin="none" align="center">
        3. Build your deck from the cards you already own!
      </Headline>
    </Section>
  </Article>
);

export default Home;
