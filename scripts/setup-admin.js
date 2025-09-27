#!/usr/bin/env node

/**
 * Script para configurar o sistema administrativo
 * Execute com: node scripts/setup-admin.js
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setupAdmin() {
  try {
    console.log('🚀 Configurando sistema administrativo...')
    
    // Verificar se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })

    if (existingAdmin) {
      console.log('✅ Admin já existe:', existingAdmin.email)
      return
    }

    // Criar usuário admin inicial
    const admin = await prisma.user.create({
      data: {
        email: 'admin@igreja.com',
        name: 'Administrador',
        role: 'ADMIN'
      }
    })

    console.log('✅ Admin criado com sucesso!')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Senha: admin123')
    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!')
    
    // Criar informações básicas da igreja se não existirem
    const existingChurchInfo = await prisma.churchInfo.findFirst()
    
    if (!existingChurchInfo) {
      const churchInfo = await prisma.churchInfo.create({
        data: {
          name: 'Iglesia Evangélica Bautista La Luz',
          location: 'Málaga, Espanha',
          cif: 'R2900286B',
          ministryNumber: '016332',
          email: 'info@iglesiabautistalaluz.es',
          phone: '+34 952 123 456',
          address: 'Avenida Antonio Gaudí, 4, 29004 Málaga, Espanha',
          website: 'https://iglesiabautistalaluz.es'
        }
      })
      
      console.log('✅ Informações da igreja criadas!')
    }

    console.log('\n🎉 Setup concluído!')
    console.log('🌐 Acesse: http://localhost:3000/admin')
    console.log('📋 Credenciais: admin@igreja.com / admin123')
    
  } catch (error) {
    console.error('❌ Erro no setup:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar setup
setupAdmin()
