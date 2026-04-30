import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class CreateAdminUser extends BaseCommand {
  static commandName = 'create:admin'
  static description = 'Create or update an admin user'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const email = await this.prompt.ask('Email', { default: 'admin@realest.com' })
    const password = await this.prompt.secure('Password', { default: 'admin123' })
    const firstName = await this.prompt.ask('First Name', { default: 'Admin' })
    const lastName = await this.prompt.ask('Last Name', { default: 'User' })

    const hashedPassword = await hash.make(password)

    const user = await User.updateOrCreate(
      { email },
      {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'admin',
        isActive: true,
      }
    )

    this.logger.success(`Admin user ${user.email} created/updated successfully!`)
  }
}
