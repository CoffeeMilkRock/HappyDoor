import { defineEventHandler, getQuery, createError } from "h3";
import { GameDatabase } from "~/utils/database";
import type { GameFilters } from "~/types/game";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event) as GameFilters;

    const { games, total } = await GameDatabase.searchGames({
      search: query.search,
      category: query.category,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
    });

    return {
      games,
      total,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Cannot Fetch Games",
    });
  }
});
