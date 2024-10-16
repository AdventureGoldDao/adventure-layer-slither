import React from 'react';
import { Container, Heading, Button, Kbd } from "@chakra-ui/react";
import CanvasBoard from "./components/CanvasBoard";
import ScoreCard from "./components/ScoreCard";
import MaxScoreCard from "./components/MaxScoreCard";

export const App = () => {

  return (
    <>
      <Container maxW="container.lg" centerContent>
        <Heading as="h1" size="xl">SNAKE GAME</Heading>
        <MaxScoreCard />
        <ScoreCard />
        <CanvasBoard height={600} width={1000} />
      </Container>
    </>
  );
};
