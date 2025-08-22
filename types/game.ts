export interface GameName {
  language: "KO" | "EN" | "JA";
  value: string;
}
export interface Game {
  id: string;
  category:
    | "ACTION"
    | "ADVENTURE"
    | "FIGHTING"
    | "FPS"
    | "PUZZLE"
    | "RHYTHM"
    | "RPG"
    | "RACING"
    | "ROGUELITE"
    | "SIMULATION"
    | "STRATEGY"
    | "SPORTS";
  name: GameName[];
}
export interface GameCreateRequest {
  id: string;
  category: Game["category"];
  name: GameName[];
}

export interface GameUpdateRequest {
  category?: Game["category"];
  name?: GameName[];
}

export interface GameListResponse {
  games: Game[];
  total: number;
  page: number;
  limit: number;
}

export interface GameFilters {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}
