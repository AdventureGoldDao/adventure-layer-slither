import { Heading } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { IGlobalState } from "../store/reducers";


const MaxScoreCard = () => {
    const maxscore = useSelector((state: IGlobalState) => state.maxScore);
    return (
        <Heading as="h2" size="md" mt={5} mb={0}>Max Score: {maxscore}</Heading>
    );
}

export default MaxScoreCard;