import { promises as fs } from "fs";
import path from "path";
import type { Game } from "~/types/game";

const DB_PATH =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), ".next/server/chunks/data/games.json")
    : path.join(process.cwd(), "data", "games.json");

const FALLBACK_GAMES: Game[] = [
  {
    id: "UNCHARTED4",
    category: "ADVENTURE",
    name: [
      {
        language: "EN",
        value: "Uncharted 4: A Thief's End",
      },
      {
        language: "KO",
        value: "언차티드 4: 해적왕과 최후의 보물",
      },
      {
        language: "JA",
        value: "アンチャーテッド 海賊王と最後の秘宝",
      },
    ],
  },
  {
    id: "LOSTARK",
    category: "RPG",
    name: [
      {
        language: "EN",
        value: "Lost Ark",
      },
      {
        language: "KO",
        value: "로스트아크",
      },
      {
        language: "JA",
        value: "ロストアーク",
      },
    ],
  },
  {
    id: "EPICSEVEN",
    category: "RPG",
    name: [
      {
        language: "EN",
        value: "Epic Seven",
      },
      {
        language: "KO",
        value: "에픽세븐",
      },
      {
        language: "JA",
        value: "エピックセブン",
      },
    ],
  },
  {
    id: "CROSSFIRE",
    category: "FPS",
    name: [
      {
        language: "EN",
        value: "Crossfire",
      },
      {
        language: "KO",
        value: "크로스파이어",
      },
      {
        language: "JA",
        value: "クロスファイア",
      },
    ],
  },
  {
    id: "TALESRUNNER",
    category: "RACING",
    name: [
      {
        language: "EN",
        value: "Tales Runner",
      },
      {
        language: "KO",
        value: "테일즈런너",
      },
      {
        language: "JA",
        value: "テイルズランナー",
      },
    ],
  },
  {
    id: "SOULWORKER",
    category: "ADVENTURE",
    name: [
      {
        language: "EN",
        value: "Soulworker",
      },
      {
        language: "KO",
        value: "소울워커",
      },
      {
        language: "JA",
        value: "ソウルワーカー",
      },
    ],
  },
  {
    id: "SKUL",
    category: "ROGUELITE",
    name: [
      {
        language: "EN",
        value: "Skul: The Hero Slayer",
      },
      {
        language: "KO",
        value: "스컬: 더 히어로 슬레이어",
      },
      {
        language: "JA",
        value: "Skul: The Hero Slayer",
      },
    ],
  },
  {
    id: "GUILTYGEARSTRIVE",
    category: "FIGHTING",
    name: [
      {
        language: "EN",
        value: "Guilty Gear -Strive-",
      },
      {
        language: "KO",
        value: "길티기어 -스트라이브-",
      },
      {
        language: "JA",
        value: "ギルティギア −ストライヴ−",
      },
    ],
  },
  {
    id: "LOBOTOMYCORP",
    category: "SIMULATION",
    name: [
      {
        language: "EN",
        value: "Lobotomy Corporation",
      },
      {
        language: "KO",
        value: "로보토미 코퍼레이션",
      },
      {
        language: "JA",
        value: "ロボトミーコーポレーション",
      },
    ],
  },
  {
    id: "DJMAXRESPECTV",
    category: "RHYTHM",
    name: [
      {
        language: "EN",
        value: "DJMAX RESPECT V",
      },
      {
        language: "KO",
        value: "디제이맥스 리스펙트 V",
      },
      {
        language: "JA",
        value: "DJMAX RESPECT V",
      },
    ],
  },
  {
    id: "LIBRARYOFRUINA",
    category: "STRATEGY",
    name: [
      {
        language: "EN",
        value: "Library Of Ruina",
      },
      {
        language: "KO",
        value: "라이브러리 오브 루이나",
      },
      {
        language: "JA",
        value: "ライブラリー・オブ・ルイナ",
      },
    ],
  },
  {
    id: "RIICHICITY",
    category: "STRATEGY",
    name: [
      {
        language: "EN",
        value: "Riichi City",
      },
    ],
  },
];

export class GameDatabase {
  private static async readGames(): Promise<Game[]> {
    try {
      const possiblePaths = [
        path.join(process.cwd(), "data", "games.json"),
        path.join(process.cwd(), ".next/server/chunks/data/games.json"),
        path.join(process.cwd(), "public", "data", "games.json"),
      ];

      for (const filePath of possiblePaths) {
        try {
          const data = await fs.readFile(filePath, "utf-8");
          return JSON.parse(data);
        } catch (error) {
          continue; // Try next path
        }
      }

      console.warn("Could not read games.json, using fallback data");
      return FALLBACK_GAMES;
    } catch (error) {
      console.error("Error reading games database:", error);
      return FALLBACK_GAMES;
    }
  }

  private static async writeGames(games: Game[]): Promise<void> {
    try {
      if (process.env.VERCEL || process.env.NODE_ENV === "production") {
        console.warn("Cannot write to file system in production environment");
        // In production, you would typically use a database like Supabase, MongoDB, etc.
        // For now, we'll just log the operation
        console.log("Would save games:", games.length, "games");
        return;
      }

      await fs.writeFile(DB_PATH, JSON.stringify(games, null, 2), "utf-8");
    } catch (error) {
      console.error("Error writing games database:", error);
      throw new Error("Failed to save games - file system may be read-only");
    }
  }

  static async getAllGames(): Promise<Game[]> {
    return await this.readGames();
  }

  static async getGameById(id: string): Promise<Game | null> {
    const games = await this.readGames();
    return games.find((game) => game.id === id) || null;
  }

  static async createGame(game: Game): Promise<Game> {
    const games = await this.readGames();

    // Check if game with same ID already exists
    if (games.some((g) => g.id === game.id)) {
      throw new Error("Game with this ID already exists");
    }

    games.push(game);
    await this.writeGames(games);
    return game;
  }

  static async updateGame(
    id: string,
    updates: Partial<Game>
  ): Promise<Game | null> {
    const games = await this.readGames();
    const gameIndex = games.findIndex((game) => game.id === id);

    if (gameIndex === -1) {
      return null;
    }

    games[gameIndex] = { ...games[gameIndex], ...updates };
    await this.writeGames(games);
    return games[gameIndex];
  }

  static async deleteGame(id: string): Promise<boolean> {
    const games = await this.readGames();
    const filteredGames = games.filter((game) => game.id !== id);

    if (filteredGames.length === games.length) {
      return false; // Game not found
    }

    await this.writeGames(filteredGames);
    return true;
  }

  static async deleteGames(ids: string[]): Promise<number> {
    const games = await this.readGames();
    const filteredGames = games.filter((game) => !ids.includes(game.id));
    const deletedCount = games.length - filteredGames.length;

    await this.writeGames(filteredGames);
    return deletedCount;
  }

  static async searchGames(filters: {
    search?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{ games: Game[]; total: number }> {
    let games = await this.readGames();

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      games = games.filter(
        (game) =>
          game.id.toLowerCase().includes(searchTerm) ||
          game.name.some((name) =>
            name.value.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Apply category filter
    if (filters.category) {
      games = games.filter((game) => game.category === filters.category);
    }

    const total = games.length;

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const paginatedGames = games.slice(startIndex, startIndex + limit);

    return {
      games: paginatedGames,
      total,
    };
  }
}
