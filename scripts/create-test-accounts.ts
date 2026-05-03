import { db } from "../lib/db";
import bcrypt from "bcryptjs";

async function createTestAccounts() {
  const testPassword = await bcrypt.hash("Test@123456", 12);
  const adminPassword = await bcrypt.hash("Admin@123456", 12);

  // Create test customer
  const existingTest = await db.user.findUnique({
    where: { email: "test@well.co" },
  });

  if (!existingTest) {
    await db.user.create({
      data: {
        email: "test@well.co",
        name: "Test User",
        password: testPassword,
        role: "CUSTOMER",
        emailVerified: new Date(),
      },
    });
    console.log("Created test customer: test@well.co / Test@123456");
  } else {
    console.log("Test customer already exists");
  }

  // Create admin user
  const existingAdmin = await db.user.findUnique({
    where: { email: "admin@well.co" },
  });

  if (!existingAdmin) {
    await db.user.create({
      data: {
        email: "admin@well.co",
        name: "Admin User",
        password: adminPassword,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });
    console.log("Created admin: admin@well.co / Admin@123456");
  } else {
    console.log("Admin already exists");
  }

  console.log("\nTest accounts ready!");
  console.log("Customer: https://well-nz-nutrition.vercel.app/login");
  console.log("Admin: https://well-nz-nutrition.vercel.app/admin");
}

createTestAccounts()
  .catch(console.error)
  .finally(() => db.$disconnect());
