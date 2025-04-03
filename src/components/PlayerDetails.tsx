import { PlayerState } from "../pages/MatchDetailsPage";

function PlayerDetails(player: PlayerState) {
  return (
    <div
      className={`bg-gray-900 w-1/2 mx-4 py-6 rounded-lg px-8 outline-4 ${
        player.isTurnPlayer ? "outline-white outline-double" : ""
      }`}
    >
      <h1 className="text-3xl font-bold text-center mb-4">
        Player: {player.playerId}
      </h1>
      <div className="flex flex-row text-green-400 font-bold text-xl justify-between">
        <div>Health: </div>
        <text>
          {player.health}
        </text>
      </div>
      <div className="flex flex-row text-cyan-400 font-bold text-xl justify-between">
        <div>Processor: </div>
        <div>
          {player.processor}/{player.maxProcessor}
        </div>
      </div>
      <div className="flex flex-row text-amber-400 font-bold text-xl justify-between">
        <div>Energy: </div>
        <div>
          {player.memory}/{player.maxMemory}
        </div>
      </div>
      <div className="flex flex-row text-blue-400 font-bold text-xl justify-between">
        <div>Shields: </div>
        <div>{player.shields}</div>
      </div>
    </div>
  );
}

export default PlayerDetails;
