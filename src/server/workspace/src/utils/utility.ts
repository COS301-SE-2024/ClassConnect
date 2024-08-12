import crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export class Utility {
  static generateUsername(role: string, email: string): string {
    const rolePrefix = this.getRolePrefix(role);
    const emailHash = this.hashEmail(email).slice(0, 7);
    const year = new Date().getFullYear().toString().slice(-2);

    return `${rolePrefix}${year}${emailHash}`;
  }

  static getRolePrefix(role: string): string {
    switch (role) {
      case 'admin':
        return 'a';
      case 'lecturer':
        return 'e';
      case 'student':
        return 's';
      default:
        throw new Error('Invalid role');
    }
  }

  static hashEmail(email: string): string {
    const emailHash = crypto.createHash('sha256').update(email).digest('hex');
    const numericHash = emailHash.replace(/\D/g, '');

    return numericHash;
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }
}
