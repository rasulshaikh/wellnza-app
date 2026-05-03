import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  const email = "admin@wellnzanutrition.com";
  const password = "Admin@123456";
  const name = "Admin";

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
