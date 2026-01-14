import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seed (Usuários e Catálogo)...');

  try {
    await prisma.catalogo.deleteMany(); 
    await prisma.user.deleteMany();
  } catch (error) {
    console.log('Nota: Tabelas provavelmente vazias ou erro ao limpar. Seguindo...');
  }

  const passwordHash = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Mestre Barbeiro',
      email: 'admin@barber.com',
      password: passwordHash,
      phone: '11999999999',
      role: 'ADMIN', 
    },
  });
  console.log(`👤 Admin criado: ${admin.email} (Senha: 123456)`);

  await prisma.user.create({
    data: {
      name: 'Cliente João',
      email: 'joao@cliente.com',
      password: passwordHash,
      phone: '11888888888',
      role: 'USER',
    },
  });

  // 5. Criar Serviços do Catálogo (White-label: O barbeiro configura isso)
  const servicos = [
    { name: 'Corte Social', price: 35.0, duration: 30, description: 'Tesoura e máquina.' },
    { name: 'Barba Terapia', price: 40.0, duration: 40, description: 'Toalha quente e massagem.' },
    { name: 'Pezinho', price: 10.0, duration: 10, description: 'Acabamento simples.' },
  ];

  for (const servico of servicos) {
    await prisma.catalogo.create({ data: servico });
  }
  console.log(`✂️ ${servicos.length} itens adicionados ao catálogo.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });