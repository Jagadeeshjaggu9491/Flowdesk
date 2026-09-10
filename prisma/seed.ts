import { seedDatabase } from "../src/lib/seed";

async function main() {
  console.log("Seeding FlowDesk database...");
  const result = await seedDatabase();
  console.log(result.message);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
