// Gera o valor de ADMIN_PASSWORD_HASH a partir de uma senha.
// Uso: npm run admin:hash -- "minha senha forte"
import bcrypt from 'bcryptjs';

const senha = process.argv[2];
if (!senha || senha.length < 10) {
  console.error('Informe uma senha com pelo menos 10 caracteres:\n  npm run admin:hash -- "minha senha forte"');
  process.exit(1);
}

// Guardamos o hash em base64 porque o bcrypt usa "$", que o .env interpretaria como variável.
const hash = bcrypt.hashSync(senha, 12);
console.log(Buffer.from(hash, 'utf8').toString('base64'));
