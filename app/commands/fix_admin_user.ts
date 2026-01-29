import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class FixAdminUser extends BaseCommand {
  static commandName = 'fix:admin'
  static description = 'Fix admin user password and verify authentication'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const email = 'admin@realest.com'
    const password = 'admin123'

    this.logger.info(`Checking for user: ${email}`)
    let user = await User.findBy('email', email)

    if (!user) {
      this.logger.error('User not found! Creating user...')
      const hashedPassword = await hash.make(password)
      user = await User.create({
        email,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
      })
      this.logger.success(`User created: ${user.email}`)
    } else {
      this.logger.info(`User found: ${user.email}`)
      this.logger.info(`User role: ${user.role}`)
      this.logger.info(`User active: ${user.isActive}`)
      this.logger.info(`Password hash exists: ${!!user.password}`)
      this.logger.info(`Password hash length: ${user.password?.length || 0}`)

      // Test password verification
      this.logger.info('\nTesting password verification...')
      try {
        const verified = await User.verifyCredentials(email, password)
        this.logger.success('Password verification successful!')
        this.logger.info(`Verified user: ${verified.email}`)
      } catch (error: any) {
        this.logger.error(`Password verification failed: ${error.message}`)

        // Try manual verification
        this.logger.info('\nTrying manual password verification...')
        const isValid = await hash.verify(user.password, password)
        this.logger.info(`Manual verification result: ${isValid}`)

        if (!isValid) {
          this.logger.warning('\nPassword hash mismatch. Updating password...')
          const newHash = await hash.make(password)
          user.password = newHash
          await user.save()
          this.logger.success('Password updated!')

          // Test again
          const verified2 = await User.verifyCredentials(email, password)
          this.logger.success('Password verification successful after update!')
        } else {
          this.logger.error('Password hash is valid but verifyCredentials still fails. This might be a configuration issue.')
        }
      }
    }
  }
}
