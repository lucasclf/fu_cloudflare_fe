import { Button } from "./button";
import "./load-more-button.css";

type LoadMoreButtonProps = {
  remaining: number;
  onClick: () => void;
};

export function LoadMoreButton({ remaining, onClick }: LoadMoreButtonProps) {
  return (
    <div className="load-more">
      <Button type="button" variant="secondary" onClick={onClick}>
        Carregar mais ({remaining} restantes)
      </Button>
    </div>
  );
}
