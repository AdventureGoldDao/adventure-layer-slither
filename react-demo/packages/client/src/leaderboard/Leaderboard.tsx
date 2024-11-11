import React from "react";
import "./Leaderboard.css";
import {useMUD} from "../MUDContext";
import {useComponentValue} from "@latticexyz/react";

/**
 * Displays the current lobby's leaderboard, in the top right.
 * @param leadboard a map of each user in the lobby to their score
 * @returns a HTML element rendering the leaderboard
 */
export default function Leaderboard(): JSX.Element {
  const {
    components: { Users },
    network: { playerEntity },
  } = useMUD();
  const user = useComponentValue(Users, playerEntity);

  return (
    <div className="leaderboard">
      <table>
        <tr>
          <th className="leaderboard-title" colSpan={2}>
            Leaderboard
          </th>
        </tr>
        <tr>
          <td className="username-entry">{user?.username ?? ""}</td>
          <td className="score-entry">{user?.score ?? 0}</td>
        </tr>
      </table>
    </div>
  );
}
