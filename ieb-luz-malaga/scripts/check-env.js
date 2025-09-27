#!/usr/bin/env node

/**
 * Script para verificar variáveis de ambiente
 * Valida se todas as variáveis necessárias estão configuradas
 */

const fs = require('fs');
const path = require('path');

console.log('🌍 Verificando variáveis de ambiente...\n');

// Variáveis obrigatórias por ambiente
const requiredEnvVars = {
  development: [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'JWT_SECRET',
  ],
  production: [
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'JWT_SECRET',
  ],
};

// Variáveis opcionais mas recomendadas
const optionalEnvVars = [
  'YOUTUBE_API_KEY',
  'SENTRY_DSN',
  'SENTRY_ORG',
  'SENTRY_PROJECT',
  'VERCEL_ANALYTICS_ID',
];

// Função para ler arquivo .env
function readEnvFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return {};
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const envVars = {};
    
    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...valueParts] = line.split('=');
        envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      }
    });
    
    return envVars;
  } catch (error) {
    console.error(`❌ Erro ao ler arquivo ${filePath}:`, error.message);
    return {};
  }
}

// Função para verificar se variável está definida
function isDefined(value) {
  return value !== undefined && value !== null && value !== '';
}

// Função para verificar variáveis obrigatórias
function checkRequiredVars(envVars, environment) {
  console.log(`🔍 Verificando variáveis obrigatórias para ${environment}...`);
  
  const required = requiredEnvVars[environment] || [];
  const missing = [];
  const present = [];
  
  required.forEach(varName => {
    if (isDefined(envVars[varName]) || isDefined(process.env[varName])) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  });
  
  if (missing.length > 0) {
    console.log('❌ Variáveis obrigatórias ausentes:');
    missing.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    return false;
  }
  
  console.log(`✅ Todas as ${present.length} variáveis obrigatórias estão configuradas`);
  return true;
}

// Função para verificar variáveis opcionais
function checkOptionalVars(envVars) {
  console.log('\n🔍 Verificando variáveis opcionais...');
  
  const missing = [];
  const present = [];
  
  optionalEnvVars.forEach(varName => {
    if (isDefined(envVars[varName]) || isDefined(process.env[varName])) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  });
  
  if (present.length > 0) {
    console.log('✅ Variáveis opcionais configuradas:');
    present.forEach(varName => {
      console.log(`   ✓ ${varName}`);
    });
  }
  
  if (missing.length > 0) {
    console.log('⚠️  Variáveis opcionais ausentes (recomendadas):');
    missing.forEach(varName => {
      console.log(`   - ${varName}`);
    });
  }
  
  return true;
}

// Função para verificar formato das variáveis
function validateVarFormats(envVars) {
  console.log('\n🔍 Validando formatos das variáveis...');
  
  const validations = [
    {
      name: 'NEXT_PUBLIC_SUPABASE_URL',
      pattern: /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/,
      message: 'Deve ser uma URL válida do Supabase',
    },
    {
      name: 'NEXTAUTH_URL',
      pattern: /^https?:\/\/[a-zA-Z0-9.-]+/,
      message: 'Deve ser uma URL válida',
    },
    {
      name: 'DATABASE_URL',
      pattern: /^postgresql:\/\/.+/,
      message: 'Deve ser uma URL PostgreSQL válida',
    },
  ];
  
  let allValid = true;
  
  validations.forEach(validation => {
    const value = envVars[validation.name] || process.env[validation.name];
    if (value && !validation.pattern.test(value)) {
      console.log(`❌ ${validation.name}: ${validation.message}`);
      console.log(`   Valor atual: ${value}`);
      allValid = false;
    }
  });
  
  if (allValid) {
    console.log('✅ Todos os formatos estão corretos');
  }
  
  return allValid;
}

// Função para verificar arquivos sensíveis no repositório
function checkSensitiveFiles() {
  console.log('\n🔍 Verificando arquivos sensíveis no repositório...');
  
  const sensitiveFiles = [
    '.env',
    '.env.local',
    '.env.production',
    '.env.staging',
    'config.json',
    'secrets.json',
  ];
  
  const foundFiles = [];
  
  sensitiveFiles.forEach(fileName => {
    if (fs.existsSync(path.join(__dirname, '..', fileName))) {
      foundFiles.push(fileName);
    }
  });
  
  if (foundFiles.length > 0) {
    console.log('⚠️  Arquivos sensíveis encontrados no repositório:');
    foundFiles.forEach(fileName => {
      console.log(`   - ${fileName}`);
    });
    console.log('\n📝 Recomendação: Remova estes arquivos do repositório e use secrets do GitHub.');
    return false;
  }
  
  console.log('✅ Nenhum arquivo sensível encontrado no repositório');
  return true;
}

// Função para gerar relatório
function generateReport(envVars, environment) {
  console.log('\n📊 Relatório de Variáveis de Ambiente');
  console.log('='.repeat(50));
  console.log(`Ambiente: ${environment}`);
  console.log(`Data: ${new Date().toISOString()}`);
  console.log('='.repeat(50));
  
  const allVars = [...requiredEnvVars[environment] || [], ...optionalEnvVars];
  const definedVars = allVars.filter(varName => 
    isDefined(envVars[varName]) || isDefined(process.env[varName]),
  );
  
  console.log(`\nTotal de variáveis: ${allVars.length}`);
  console.log(`Variáveis configuradas: ${definedVars.length}`);
  console.log(`Cobertura: ${Math.round((definedVars.length / allVars.length) * 100)}%`);
  
  if (definedVars.length > 0) {
    console.log('\n✅ Variáveis configuradas:');
    definedVars.forEach(varName => {
      const value = envVars[varName] || process.env[varName];
      const displayValue = varName.includes('SECRET') || varName.includes('KEY') 
        ? `***${value.slice(-4)}` 
        : value;
      console.log(`   ${varName}=${displayValue}`);
    });
  }
}

// Função principal
async function main() {
  const environment = process.env.NODE_ENV || 'development';
  
  // Ler variáveis de ambiente
  const envVars = readEnvFile(path.join(__dirname, '..', '.env.local'));
  
  console.log(`🌍 Verificando ambiente: ${environment}\n`);
  
  // Verificações
  const checks = [
    () => checkRequiredVars(envVars, environment),
    () => checkOptionalVars(envVars),
    () => validateVarFormats(envVars),
    () => checkSensitiveFiles(),
  ];
  
  let allPassed = true;
  for (const check of checks) {
    if (!check()) {
      allPassed = false;
    }
  }
  
  // Gerar relatório
  generateReport(envVars, environment);
  
  console.log(`\n${'='.repeat(50)}`);
  
  if (allPassed) {
    console.log('🎉 Todas as verificações passaram!');
    process.exit(0);
  } else {
    console.log('⚠️  Algumas verificações falharam. Corrija os problemas antes de prosseguir.');
    process.exit(1);
  }
}

// Executar script
main().catch(console.error);
