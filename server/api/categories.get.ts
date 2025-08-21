import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  return [
    { label: "Adventure", value: "ADVENTURE" },
    { label: "RPG", value: "RPG" },
    { label: "Shooter", value: "SHOOTER" },
    { label: "Strategy", value: "STRATEGY" },
    { label: "Sports", value: "SPORTS" },
    { label: "Racing", value: "RACING" },
    { label: "Puzzle", value: "PUZZLE" },
    { label: "Action", value: "ACTION" },
  ];
});
