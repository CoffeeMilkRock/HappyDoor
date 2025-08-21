import { defineEventHandler, createError, getRouterParam } from "h3";
import { GameDatabase } from "~/utils/database";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Game ID is required",
      });
    }

    const game = await GameDatabase.getGameById(id);

    if (!game) {
      throw createError({
        statusCode: 404,
        statusMessage: "Game not found",
      });
    }

    return game;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Internal Server Error",
    });
  }
});
