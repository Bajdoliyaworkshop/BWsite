import 'dotenv/config';

const secret = process.env.JWT_SECRET || 'default-secret';
const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

export { secret, expiresIn };