import { defineEventHandler, readBody, createError } from "h3";
import { GameDatabase } from "~/utils/database";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body.ids || !Array.isArray(body.ids)) {
      throw createError({
        statusCode: 400,
        statusMessage: "ids array is required",
      });
    }
    const deletedCount = await GameDatabase.deleteGames(body.ids);

    return {
      success: true,
      deletedCount,
      message: `${deletedCount} games deleted successfully`,
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to delete games",
    });
  }
});
