import { CardStateMessage } from "../pages/MatchDetailsPage";
import Card from "./Card";

interface HandProps {
  cards: CardStateMessage[];
}

function Hand({ cards }: HandProps) {
  return (
    <div className="flex flex-row justify-center min-h-[10rem] gap-2 lg:gap-4">
      {cards.length > 0 ? cards.map((card) => {
        return <Card key={card.id} {...card} />;
      }) : <div className="text-gray-500 text-2xl flex items-center justify-center">No cards</div>}
    </div>
  );
}

export default Hand;
