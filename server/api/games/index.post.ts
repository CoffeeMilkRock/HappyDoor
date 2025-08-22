import { defineEventHandler, readBody, createError } from "h3";
import { GameDatabase } from "~/utils/database";
import type { GameCreateRequest } from "../../../types/game";

export default defineEventHandler(async (event) => {
  try {
    const body = (await readBody(event)) as GameCreateRequest;

    if (!body.id || !body.category || !body.name || !Array.isArray(body.name)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Game name, category, and release date are required",
      });
    }
    if (body.name.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Name must be a non-empty array",
      });
    }
    for (const nameEntry of body.name) {
      if (!nameEntry.language || !nameEntry.value) {
        throw createError({
          statusCode: 400,
          statusMessage: "Each name entry must have language and value",
        });
      }
      if (!["EN", "KO", "JA"].includes(nameEntry.language)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Language must be EN, KO, or JA",
        });
      }
    }
    const game = await GameDatabase.createGame(body);
    return game;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create game",
    });
  }
});
