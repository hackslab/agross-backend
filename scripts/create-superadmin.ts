import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const username = 'superadmin';
  const password = 'admin123';
  const name = 'Super Admin';

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.admin.create({
      data: {
        name: name,
        username: username,
        password: hashedPassword,
        isSuperadmin: true,
      },
    });

    console.log('✅ Superadmin created successfully!');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Admin ID:', admin.id);
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('⚠️  Username already exists. Trying to update...');
      
      const existingAdmin = await prisma.admin.findUnique({
        where: { username: username },
      });

      if (existingAdmin) {
        const updatedAdmin = await prisma.admin.update({
          where: { username: username },
          data: {
            password: hashedPassword,
            isSuperadmin: true,
          },
        });
        console.log('✅ Existing admin updated to superadmin!');
        console.log('Username:', username);
        console.log('Password:', password);
        console.log('Admin ID:', updatedAdmin.id);
      }
    } else {
      console.error('❌ Error creating admin:', error);
      throw error;
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
