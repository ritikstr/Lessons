import dotenv from 'dotenv';

dotenv.config();

console.log('Environment Variables Check:');
console.log('GEMINI_KEY:', process.env.GEMINI_KEY ? 'Loaded ✓' : 'Missing ✗');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'Loaded ✓' : 'Missing ✗');
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? 'Loaded ✓' : 'Missing ✗');
console.log('PORT:', process.env.PORT || '3001 (default)');