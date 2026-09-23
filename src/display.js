import chalk from "chalk";
import readline from "readline";

export async function displayResults(pool, appliedFilterLabels, limit = 20) {
  console.log(chalk.bold("\nFilters applied, in order:"));
  appliedFilterLabels.forEach((label, i) =>
    console.log(chalk.gray(`  ${i + 1}. ${label}`))
  );

  if (pool.length === 0) {
    console.log(
      chalk.yellow(
        "\nNo internships survived all of the filters above. Run it again and " +
          "back off one of the filters, or use the 'Undo last filter' option next time.\n"
      )
    );
    return;
  }

  const totalPages = Math.ceil(pool.length / limit);
  let currentPage = 0;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const showPage = () => {
    console.clear();

    // Filters
    console.log(chalk.bold("\nFilters applied, in order:"));
    appliedFilterLabels.forEach((label, i) =>
      console.log(chalk.gray(`  ${i + 1}. ${label}`))
    );

    // Page info
    console.log(
      `\n${chalk.bold(
        `Showing ${currentPage * limit + 1}-${Math.min(
          (currentPage + 1) * limit,
          pool.length
        )} of ${pool.length} result(s)`
      )}`
    );

    console.log(
      chalk.gray(`Page ${currentPage + 1} of ${totalPages}\n`)
    );

    // Results
    const start = currentPage * limit;
    const pageResults = pool.slice(start, start + limit);

    pageResults.forEach((listing, i) => {
      const number = start + i + 1;

      console.log(
        `\n${chalk.bold(`${number}. ${listing.title}`)}`
      );
      console.log(
        `   ${chalk.gray(listing.company)} — ${chalk.gray(listing.location)}`
      );
      console.log(
        `   ${chalk.gray("Term(s) -")} ${chalk.gray(listing.terms)}`
      );
      console.log(
        `   ${chalk.blue(listing.url || "(no link provided)")}`
      );
    });

    console.log(chalk.gray(`\nSource: ${pool[0].source}`));

    // Navigation
    console.log(
      `\n${chalk.cyan("n")} = next page  ` +
      `${chalk.cyan("p")} = previous page  ` +
      `${chalk.cyan("q")} = quit`
    );
  };

  showPage();

  rl.input.setRawMode(true);
  rl.input.resume();

  return new Promise((resolve) => {
    rl.input.on("data", (key) => {
      const input = key.toString().toLowerCase();

      if (input === "n" && currentPage < totalPages - 1) {
        currentPage++;
        showPage();
      } else if (input === "p" && currentPage > 0) {
        currentPage--;
        showPage();
      } else if (input === "q" || input === "\u0003") {
        rl.input.setRawMode(false);
        rl.close();
        console.clear();
        resolve();
      }
    });
  });
}