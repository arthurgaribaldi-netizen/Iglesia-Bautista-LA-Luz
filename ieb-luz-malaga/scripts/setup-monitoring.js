import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Setting up monitoring...');

// Create logs directory
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
  console.log('✅ Created logs directory');
}

// Create .env.local if it doesn't exist
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  const envContent = `# Copy from .env.example and fill in your values
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
NEXT_PUBLIC_GA_ID=
MONITORING_ENABLED=true
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local template');
}

console.log('🎉 Monitoring setup complete!');
console.log('📝 Next steps:');
console.log('1. Fill in your .env.local with actual values');
console.log('2. Run: npm run dev');
console.log('3. Visit /admin/monitoring to see the dashboard');
