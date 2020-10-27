import bcrypt from 'bcrypt';

export default class Password {
  static async toHash(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
  }

  static async compare(
    storedPassword: string,
    suppliedPassword: string,
  ): Promise<boolean> {
    const validPassword = await bcrypt.compare(
      suppliedPassword,
      storedPassword,
    );
    return validPassword;
  }
}
