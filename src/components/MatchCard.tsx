import { MatchMessage } from "../pages/MatchBrowserPage";
import { useNavigate } from "react-router-dom";
function MatchCard({ match }: { match: MatchMessage }) {
  const navigate = useNavigate();
  return (
    <div
      className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
      onClick={() => {
        navigate(`/match/${match.id}`);
      }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="text-2xl font-bold text-white">
          Match {match.id.slice(0, 8)}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-blue-400">{match.player1Id}</div>
          <div className="text-gray-400">vs</div>
          <div className="text-blue-400">{match.player2Id}</div>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;
