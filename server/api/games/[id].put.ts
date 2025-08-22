import { defineEventHandler, getRouterParam, readBody, createError } from "h3";
import { GameDatabase } from "../../../utils/database";
import type { GameUpdateRequest } from "~/types/game";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = (await readBody(event)) as GameUpdateRequest;

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Game ID is required",
      });
    }

    // Validate name array if provided
    if (body.name) {
      if (!Array.isArray(body.name) || body.name.length === 0) {
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
    }

    const updatedGame = await GameDatabase.updateGame(id, body);

    if (!updatedGame) {
      throw createError({
        statusCode: 404,
        statusMessage: "Game not found",
      });
    }

    return updatedGame;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update game",
    });
  }
});
