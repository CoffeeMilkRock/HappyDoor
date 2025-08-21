export interface GameName {
  language: "KO" | "EN" | "JA";
  value: string;
}
export interface Game {
  id: string;
  category:
    | "ACTION"
    | "ADVENTURE"
    | "RPG"
    | "STRATEGY"
    | "PUZZLE"
    | "SPORTS"
    | "RACING"
    | "FIGHTING";
  name: GameName[];
}
