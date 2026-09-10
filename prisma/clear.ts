import { db } from "../src/lib/db";

async function clearDatabase() {
  console.log("Erasing all database records and dummy data...");

  await db.taskComment.deleteMany();
  await db.taskLabel.deleteMany();
  await db.taskAttachment.deleteMany();
  await db.task.deleteMany();
  await db.projectMember.deleteMany();
  await db.project.deleteMany();
  await db.notification.deleteMany();
  await db.activity.deleteMany();
  await db.invitation.deleteMany();
  await db.payment.deleteMany();
  await db.subscription.deleteMany();
  await db.auditLog.deleteMany();
  await db.workspaceMember.deleteMany();
  await db.workspace.deleteMany();
  await db.user.deleteMany();

  console.log("All data erased successfully! Database is completely empty and ready for fresh setup.");
}

clearDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
