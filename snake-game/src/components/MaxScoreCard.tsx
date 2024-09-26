import { Heading } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { IGlobalState } from "../store/reducers";

const MaxScoreCard = () => {
    const maxScore = useSelector((state: IGlobalState) => state.maxScore);
    return (
        <Heading as="h2" size="md" mt={5} mb={0}>Max Score: {maxScore}</Heading>
    );
}

export default MaxScoreCard;