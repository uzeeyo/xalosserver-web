import { CardStateMessage, Race } from "../pages/MatchDetailsPage";

function getRaceColor(race: Race) {
  switch (race) {
    case Race.Alien:
      return "bg-green-950";
    case Race.Human:
      return "bg-purple-950";
    case Race.Robot:
      return "bg-amber-950";
    default:
      return "bg-gray-600";
  }
}

function Card(props: CardStateMessage) {
  return (
    <div className={`${getRaceColor(props.race)} rounded-lg px-2 lg:px-4 w-44 flex flex-col justify-between`}>
      <div className="text-center text-xl overflow-ellipsis">{props.name}</div>
      <div className="mb-2">
        {props.processorCost && (
          <div className="text-cyan-500 text-xl font-bold">
            {props.processorCost}
          </div>
        )}
        {props.memoryCost && (
          <div className="text-amber-400 text-xl font-bold">
            {props.memoryCost}
          </div>
        )}

        <div className="flex flex-row justify-between">
          {props.attack && (
            <div className="text-red-600 text-xl font-bold">{props.attack}</div>
          )}
          {props.health && (
            <div className="text-green-600 text-xl font-bold">
              {props.health}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
