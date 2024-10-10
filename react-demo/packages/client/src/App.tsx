import React, { useState, useEffect } from 'react';
import { useComponentValue } from "@latticexyz/react";
import { getComponentValue } from "@latticexyz/recs";
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
    systemCalls: { increment, setMaxScore },
  } = useMUD();

  const counter = useComponentValue(Counter, playerEntity);
  console.log("playerEntity:", playerEntity);
  console.log("counter:", counter);

  return (
    <>
      <div>
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>
      <button
        type="button"
        style={{ display: "block" }}
        onClick={async (event) => {
          event.preventDefault();
          console.log("new counter value:", await increment());
        }}
      >
        Increment
      </button>
      <button
        type="button"
        style={{ display: "block" }}
        onClick={async (event) => {
          event.preventDefault();
          console.log("setMaxScore value:", await setMaxScore(10));
        }}
      >
        setMaxScore
      </button>
      <Container maxW="container.lg" centerContent>
        <Heading as="h1" size="xl">SNAKE GAME</Heading>
        <MaxScoreCard />
        <ScoreCard />
        <CanvasBoard height={600} width={1000} />
      </Container>
    </>
  );
};
