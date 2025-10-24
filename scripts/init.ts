import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log("\n🚀 Initializing Agross Backend...\n");

  try {
    // Check if any admins exist
    const adminCount = await prisma.admin.count();

    if (adminCount > 0) {
      console.log(
        "✅ Database already has admin users. Initialization not needed."
      );
      console.log(`   Found ${adminCount} admin(s) in the database.\n`);
      rl.close();
      return;
    }

    console.log("⚠️  No admin users found in the database.");
    console.log("📝 Let's create your first superadmin account.\n");

    // Prompt for username
    const username = await question("Enter username: ");
    if (!username || username.trim() === "") {
      console.error("\n❌ Username cannot be empty!");
      rl.close();
      process.exit(1);
    }

    // Prompt for password
    const password = await question("Enter password: ");
    if (!password || password.trim() === "") {
      console.error("\n❌ Password cannot be empty!");
      rl.close();
      process.exit(1);
    }

    // Confirm password
    const confirmPassword = await question("Confirm password: ");
    if (password !== confirmPassword) {
      console.error("\n❌ Passwords do not match!");
      rl.close();
      process.exit(1);
    }

    console.log("\n🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("💾 Creating superadmin account...");
    const admin = await prisma.admin.create({
      data: {
        name: "Superadmin",
        username: username.trim(),
        password: hashedPassword,
        isSuperadmin: true,
      } as any,
    });

    console.log("\n✅ Superadmin created successfully!");
    console.log(`   Username: ${admin.username}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   ID: ${admin.id}\n`);
    console.log("🎉 You can now login to your application!\n");

    rl.close();
  } catch (error) {
    console.error("\n❌ Error during initialization:", error);
    rl.close();
    process.exit(1);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
