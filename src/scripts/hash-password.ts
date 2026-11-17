import { hashPasswordScrypt } from "../lib/auth";

const password = process.argv[2];
if (!password || password.length < 8) {
  console.error("Usage: npm run admin:hash -- <your-strong-password-min-8-chars>");
  process.exit(1);
}

console.log(hashPasswordScrypt(password));

