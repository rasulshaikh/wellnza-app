import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = "Admin";

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD environment variables must be set");
    console.error("Example: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret npx tsx scripts/create-admin.ts");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const existing = await db.user.findUnique({ where: { email } });

  if (existing) {
    console.log(`Updating existing user ${email} to admin...`);
    await db.user.update({
      where: { email },
      data: { role: "ADMIN", password: hashedPassword, name },
    });
  } else {
    console.log(`Creating admin user ${email}...`);
    await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "ADMIN",
        emailSent: true,
      },
    });
  }

  console.log(`Admin user ready: ${email} / ${password}`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
