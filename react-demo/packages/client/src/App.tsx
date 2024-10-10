import React, { useState, useEffect } from 'react';
import { useComponentValue } from "@latticexyz/react";
import { Container, Heading, Button } from "@chakra-ui/react";
/** @jsxImportSource @emotion/react */
import { useMUD } from "./MUDContext";
import CanvasBoard from "./components/CanvasBoard";
import ScoreCard from "./components/ScoreCard";
import MaxScoreCard from "./components/MaxScoreCard";

export const App = () => {
  const {
    network : { playerEntity },
    components: { Counter },
    systemCalls: { reStartGame },
  } = useMUD();

  const counter = useComponentValue(Counter, playerEntity);
  if (counter === undefined) {
      reStartGame();
  }
  return (
    <>
      <Container maxW="container.lg" centerContent>
        <Heading as="h1" size="xl">SNAKE GAME</Heading>
          <Heading as="h2" size="md" mt={5} mb={0}>Max Score: {counter?.maxScore ?? "0"}</Heading>
          <Heading as="h2" size="md" mt={5} mb={5}>Current Score: {counter?.curScore ?? "0"}</Heading>
        <CanvasBoard height={600} width={1000} />
      </Container>
    </>
  );
};
