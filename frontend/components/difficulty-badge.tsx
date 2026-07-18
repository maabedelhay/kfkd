import { Badge } from "@/components/ui/badge";
import { Difficulty } from "@/types/kata";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const labelMap: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <Badge variant={difficulty}>
      {labelMap[difficulty]}
    </Badge>
  );
}
