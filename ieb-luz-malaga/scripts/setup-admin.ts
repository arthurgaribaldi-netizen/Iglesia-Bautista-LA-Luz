import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    const email = 'admin@ieblaluz.es';
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 12);

    const adminUser = await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash: hashedPassword,
      },
      create: {
        email,
        name: 'Administrador IEB La Luz',
        passwordHash: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Usuário administrador configurado com sucesso!');
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`🔑 Senha: ${password}`);
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!');

  } catch (error) {
    console.error('❌ Erro ao configurar usuário administrador:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar setup se chamado diretamente
if (require.main === module) {
  setupAdmin()
    .then(() => {
      process.exit(0);
    })
    .catch((_error) => {
      process.exit(1);
    });
}

export { setupAdmin };
