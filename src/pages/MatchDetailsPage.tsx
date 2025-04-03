import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlayerDetails from "../components/PlayerDetails";
import Card from "../components/Card";
import Zone from "../components/Zone";
import Hand from "../components/Hand";
import { WebMessage } from "./MatchBrowserPage";

export interface PlayerState {
  playerId: string;
  health: number;
  maxHealth: number;
  shields: number;
  maxShields: number;
  processor: number;
  maxProcessor: number;
  memory: number;
  maxMemory: number;
  isTurnPlayer: boolean;
}

export interface BoardState {
  playerId: string;
  zones: ZoneStateMessage[];
}

export interface HandState {
  playerId: string;
  cards: CardStateMessage[];
}

interface MatchStateMessage {
  id: string;
  players: PlayerStateMessage[];
  turnPlayer: string;
}

interface DrawMessage {
  playerId: string;
  cards: CardStateMessage[];
}

export enum Race {
  None,
  Human,
  Robot,
  Alien,
}

export interface PlayerStateMessage {
  key: number;
  playerId: string;
  core?: CoreStatsMessage;
  deckSize: number;
  hand: CardStateMessage[];
  board: BoardState;
  isTurnPlayer: boolean;
  health: number;
  maxHealth: number;
  shields: number;
  maxShields: number;
  processor: number;
  maxProcessor: number;
  memory: number;
  maxMemory: number;
}

interface ZoneStateMessage {
  id: number;
  card?: CardStateMessage;
}

interface PlayCardMessage {
  card: CardStateMessage;
  zoneId?: number;
  ownerId: string;
}

export interface CardStateMessage {
  id: number;
  name: string;
  type: number;
  attack: number;
  health: number;
  processorCost: number;
  memoryCost: number;
  ownerId: string;
  race: Race;
}

export interface CoreStatsMessage {
  playerId: string;
  health: number;
  maxHealth: number;
  shields: number;
  processor: number;
  maxProcessor: number;
  memory: number;
  maxMemory: number;
}

function MatchDetailsPage() {
  const { id } = useParams();
  const [isConnected, setIsConnected] = useState(false);
  const [playerStats, setPlayerStats] = useState<PlayerState[]>([
    {
      playerId: "Loading...",
      health: 0,
      maxHealth: 0,
      shields: 0,
      maxShields: 0,
      processor: 0,
      maxProcessor: 0,
      memory: 0,
      maxMemory: 0,
      isTurnPlayer: false,
    },
    {
      playerId: "Loading...",
      health: 0,
      maxHealth: 0,
      shields: 0,
      maxShields: 0,
      processor: 0,
      maxProcessor: 0,
      memory: 0,
      maxMemory: 0,
      isTurnPlayer: false,
    },
  ]);

  const [boardStates, setBoardStates] = useState<BoardState[]>([
    {
      playerId: "Loading...",
      zones: [
        { id: 0, card: undefined },
        { id: 1, card: undefined },
        { id: 2, card: undefined },
      ],
    },
    {
      playerId: "Loading...",
      zones: [
        { id: 0, card: undefined },
        { id: 1, card: undefined },
        { id: 2, card: undefined },
      ],
    },
  ]);

  const [handStates, setHandStates] = useState<HandState[]>([
    {
      playerId: "Loading...",
      cards: [],
    },
    {
      playerId: "Loading...",
      cards: [],
    },
  ]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:9000/match/${id}`);
    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const webMessage: WebMessage = JSON.parse(event.data);
        switch (webMessage.type) {
          case "matchState":
            const matchState: MatchStateMessage = webMessage.message;

            const playerStats: PlayerState[] = matchState.players.map(
              (player) => ({
                playerId: player.playerId,
                health: player.health,
                maxHealth: player.maxHealth,
                shields: player.shields,
                maxShields: player.maxShields,
                processor: player.processor,
                maxProcessor: player.maxProcessor,
                memory: player.memory,
                maxMemory: player.maxMemory,
                isTurnPlayer: matchState.turnPlayer === player.playerId,
              })
            );
            setPlayerStats(playerStats);

            const updatedBoardStates = matchState.players.map((player) => ({
              playerId: player.playerId,
              zones: player.board.zones,
            }));
            setBoardStates(updatedBoardStates);

            const updatedHandStates = matchState.players.map((player) => ({
              playerId: player.playerId,
              cards: player.hand,
            }));
            setHandStates(updatedHandStates);

            break;

          case "coreStats":
            const coreStats: CoreStatsMessage = webMessage.message;

            setPlayerStats((currentStats) => {
              return currentStats.map((playerStat) => {
                if (playerStat.playerId === coreStats.playerId) {
                  return {
                    ...playerStat,
                    health: coreStats.health,
                    maxHealth: coreStats.maxHealth,
                    shields: coreStats.shields,
                    processor: coreStats.processor,
                    maxProcessor: coreStats.maxProcessor,
                    memory: coreStats.memory,
                    maxMemory: coreStats.maxMemory,
                  };
                }
                return playerStat;
              });
            });
            break;

          case "draw":
            const drawMessage: DrawMessage = webMessage.message;
            setHandStates((currentHandStates) => {
              return currentHandStates.map((handState) => {
                if (handState.playerId === drawMessage.playerId) {
                  return {
                    ...handState,
                    cards: [...handState.cards, ...drawMessage.cards],
                  };
                }
                return handState;
              });
            });
            break;

          case "turnChange":
            setPlayerStats((currentStats) => {
              return currentStats.map((playerStat) => {
                return {
                  ...playerStat,
                  isTurnPlayer: !playerStat.isTurnPlayer,
                };
              });
            });
            break;

          case "placeCard":
            const playCardMessage: PlayCardMessage = webMessage.message;
            setHandStates((currentHandStates) => {
              return currentHandStates.map((handState) => {
                if (handState.playerId === playCardMessage.ownerId) {
                  return {
                    ...handState,
                    cards: handState.cards.filter(
                      (card) => card.id !== playCardMessage.card.id
                    ),
                  };
                }
                return handState;
              });
            });
            
            setBoardStates((currentBoardStates) => {
              return currentBoardStates.map((boardState) => {
                if (
                  boardState.playerId === playCardMessage.ownerId &&
                  playCardMessage.zoneId !== undefined
                ) {
                  const updatedZones = [...boardState.zones];
                  const zone = updatedZones.find((zone) => zone.id === playCardMessage.zoneId)
                  if (zone) {
                    zone.card = playCardMessage.card;
                  }

                  return {
                    ...boardState,
                    zones: updatedZones,
                  };
                }
                return boardState;
              });
            });
            break;

          case "cardRemoved":
            const removeCardMessage: CardStateMessage = webMessage.message;
            setBoardStates((currentBoardStates) => {
              return currentBoardStates.map((boardState) => {
                if (boardState.playerId === removeCardMessage.ownerId) {
                  const updatedZones = boardState.zones.map((zone) => {
                    if (zone.card != undefined && zone.card.id === removeCardMessage.id) {
                      return { ...zone, card: undefined };
                    }
                    return zone;
                  });

                  return {
                    ...boardState,
                    zones: updatedZones,
                  };
                }
                return boardState;
              });
            });
            break;
        }
      } catch (error) {
        console.error("Error parsing message", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-950 p-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-white mb-8">Match {id}</h1>
          <div className="flex items-center space-x-2 bg-gray-700 py-2 px-4 rounded-full">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>

        {/* Players */}
        <div className="flex flex-row">
          {playerStats.map((playerStat, index) => (
            <PlayerDetails key={index} {...playerStat} />
          ))}
        </div>

        {/* Board */}
        <div className="bg-gray-900 mx-4 py-6 rounded-lg px-4 mt-8">
          <Hand cards={handStates[0].cards} />

          {/* Field */}
          <div className="flex flex-row justify-center mt-8 gap-4">
            {boardStates[0].zones.map((zone) => (
              <Zone key={zone.id}>{zone.card && <Card {...zone.card} />}</Zone>
            ))}
          </div>
          <div className="flex flex-row justify-center mt-4 gap-4 mb-8">
            {boardStates[1].zones.map((zone) => (
              <Zone key={zone.id}>{zone.card && <Card {...zone.card} />}</Zone>
            ))}
          </div>

          <Hand cards={handStates[1].cards} />
        </div>
      </div>
    </div>
  );
}

export default MatchDetailsPage;
