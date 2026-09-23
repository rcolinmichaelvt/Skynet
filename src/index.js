#!/usr/bin/env node
// src/index.js
//
// Skynet -- Internship Finder CLI
//
// Flow: fetch listings, then repeatedly pick ONE filter to apply to the
// current pool. After each filter you're shown the new (smaller) pool and
// asked to pick another filter from what's left, undo the last one, or --
// once at least one filter has been applied -- stop and see results.
// At least one filter is required before you're allowed to stop.

import inquirer from "inquirer";
import chalk from "chalk";
import { fetchInternships as fetchSimplify } from "./sources/simplify.js";
import {
  applyMajorFilter,
  applyCompanyTypeFilter,
  applyLocationFilter,
  applyPlusMinusFilter,
} from "./filters.js";
import { displayResults } from "./display.js";

const FILTER_LABELS = {
  major: "Major / field of study",
  keywords: "Keywords (include and exclude)",
  companyType: "Company type / industry",
  location: "Location",
};

async function promptFilterChoice(appliedCount, poolSize) {
  const choices = Object.entries(FILTER_LABELS).map(([value, name]) => ({ name, value }));

  if (appliedCount > 0) {
    choices.push(new inquirer.Separator());
    choices.push({ name: `Done -- show ${poolSize} result(s)`, value: "done" });
    choices.push({ name: "Undo last filter", value: "undo" });
  }

  const message =
    appliedCount === 0
      ? "Pick a filter to start narrowing down (at least one is required):"
      : `Current pool: ${poolSize} internship(s). Add another filter, undo, or finish:`;

  const { choice } = await inquirer.prompt([{ type: "list", name: "choice", message, choices }]);
  return choice;
}

async function collectFilterInput(choice) {
  if (choice === "major") {
    const { value } = await inquirer.prompt([
      { type: "input", name: "value", message: "Major/field keywords (comma-separated, matches ANY):" },
    ]);
    return { value };
  }
  if (choice === "companyType") {
    const { value } = await inquirer.prompt([
      { type: "input", name: "value", message: "Company type/industry keywords (comma-separated, matches ANY):" },
    ]);
    return { value };
  }
  if (choice === "location") {
    const { value } = await inquirer.prompt([
      { type: "input", name: "value", message: "Location keywords (comma-separated, matches ANY):" },
    ]);
    return { value };
  }
  if (choice === "keywords") {
    const { plus, minus } = await inquirer.prompt([
      { type: "input", name: "plus", message: "Include keywords (+), comma-separated (blank = no restriction):" },
      { type: "input", name: "minus", message: "Exclude keywords (-), comma-separated (blank = none excluded):" },
    ]);
    return { plus, minus };
  }
  return null;
}

function runFilter(choice, pool, input) {
  if (choice === "major") return applyMajorFilter(pool, input.value);
  if (choice === "companyType") return applyCompanyTypeFilter(pool, input.value);
  if (choice === "location") return applyLocationFilter(pool, input.value);
  if (choice === "keywords") return applyPlusMinusFilter(pool, input.plus, input.minus);
  return pool;
}

function describeFilter(choice, input) {
  if (choice === "major") return `Major: ${input.value}`;
  if (choice === "companyType") return `Company type: ${input.value}`;
  if (choice === "location") return `Location: ${input.value}`;
  if (choice === "keywords") return `Keywords: +[${input.plus || "-"}] -[${input.minus || "-"}]`;
  return choice;
}

function isBlankInput(choice, input) {
  if (choice === "keywords") return !input.plus?.trim() && !input.minus?.trim();
  return !input.value?.trim();
}

async function main() {
  console.log(`
  ███████╗██╗  ██╗██╗   ██╗███╗   ██╗███████╗████████╗
  ██╔════╝██║ ██╔╝╚██╗ ██╔╝████╗  ██║██╔════╝╚══██╔══╝
  ███████╗█████╔╝  ╚████╔╝ ██╔██╗ ██║█████╗     ██║   
  ╚════██║██╔═██╗   ╚██╔╝  ██║╚██╗██║██╔══╝     ██║   
  ███████║██║  ██╗   ██║   ██║ ╚████║███████╗   ██║   
  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═══╝╚══════╝   ╚═╝   
  `);
  console.log(chalk.gray("Fetching internships..."));

  let fullPool;
  try {
    fullPool = await fetchSimplify();
  } catch (err) {
    console.error(chalk.red(`\nCouldn't fetch listings: ${err.message}\n`));
    return;
  }
  console.log(chalk.gray(`Loaded ${fullPool.length} active listings.\n`));

  let pool = fullPool;
  const appliedLabels = [];
  const history = [fullPool]; // stack of pools, one per applied filter, for undo

  while (true) {
    const choice = await promptFilterChoice(appliedLabels.length, pool.length);

    if (choice === "done") break;

    if (choice === "undo") {
      if (appliedLabels.length > 0) {
        appliedLabels.pop();
        history.pop();
        pool = history[history.length - 1];
        console.log(chalk.yellow(`Removed last filter. Pool is back to ${pool.length} result(s).\n`));
      }
      continue;
    }

    const input = await collectFilterInput(choice);
    if (isBlankInput(choice, input)) {
      console.log(chalk.gray("Nothing entered -- that filter wasn't applied.\n"));
      continue;
    }

    const nextPool = runFilter(choice, pool, input);

    if (nextPool.length === 0) {
      console.log(
        chalk.red(
          "That filter would leave 0 results, so it wasn't applied. Try different keywords, " +
            "or add a different filter instead.\n"
        )
      );
      continue;
    }

    pool = nextPool;
    appliedLabels.push(describeFilter(choice, input));
    history.push(pool);
    console.log(chalk.green(`Applied: ${appliedLabels[appliedLabels.length - 1]} -> ${pool.length} result(s) remain.\n`));
  }

  displayResults(pool, appliedLabels, 20);
}

main();