import { promises as fs } from "fs";
import path from "path";
import type { Game } from "~/types/game";

const DB_PATH = path.join(process.cwd(), "data", "games.json");

export class GameDatabase {
  private static async readGames(): Promise<Game[]> {
    try {
      const data = await fs.readFile(DB_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading games database:", error);
      return [];
    }
  }

  private static async writeGames(games: Game[]): Promise<void> {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(games, null, 2), "utf-8");
    } catch (error) {
      console.error("Error writing games database:", error);
      throw new Error("Failed to save games");
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
