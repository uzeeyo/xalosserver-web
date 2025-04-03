import { useEffect, useRef, useState } from "react";
import MatchCard from "../components/MatchCard";

export interface MatchMessage {
  id: string;
  player1Id: string;
  player2Id: string;
}

interface InitialMatchMessage {
  matches: MatchMessage[];
}

export interface WebMessage {
  type: string;
  message: any;
  matchId?: string;
}

function MatchBrowserPage() {
  const [matches, setMatches] = useState<MatchMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:9000/match-browser");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data: WebMessage = JSON.parse(event.data);
        if (data.type === "activeMatches") {
          setMatches((data.message as InitialMatchMessage).matches);
        } else if (data.type === "matchAdded") {
          setMatches((prevMatches) => [
            ...prevMatches,
            data.message as MatchMessage,
          ]);
        } else if (data.type === "matchRemoved") {
          setMatches((prevMatches) =>
            prevMatches.filter((match) => match.id !== data.matchId)
          );
        }
        setError(null);
      } catch (err) {
        setError("Error parsing WebSocket message");
      }
    };

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      setError("WebSocket connection error");
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-white mb-8">Active Matches</h1>
          <div className="flex items-center space-x-2 bg-gray-700 py-2 px-4 rounded-full">
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>

        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {matches.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-400">
              No active matches. Waiting for updates...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchBrowserPage;
