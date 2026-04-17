import { closeDatabase, initializeDatabase } from "../db";
import { runLeadReminderJob } from "./reminders";

async function main() {
  await initializeDatabase();

  const result = await runLeadReminderJob();
  console.info(
    `[lead-reminder-job] completed: dueToday=${result.totalDueToday}, overdue=${result.totalOverdue}, processed=${result.processed}, failed=${result.failed}`,
  );
}

main()
  .catch((error) => {
    console.error("[lead-reminder-job] failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabase();
  });
