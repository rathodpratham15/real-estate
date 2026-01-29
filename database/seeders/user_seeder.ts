import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    // Create default admin user
    const email = 'dad@gmail.com'
    const password = '30121965@D'
    
    let user = await User.findBy('email', email)
    const hashedPassword = await hash.make(password)
    
    if (user) {
      // Update existing user - use direct query to bypass model hooks that might re-hash
      console.log('Updating existing user...')
      await db.from('users')
        .where('id', user.id)
        .update({
          password: hashedPassword,
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          is_active: true,
          updated_at: new Date(),
        })
      
      // Reload user
      await user.refresh()
      console.log(`Admin user ${user.email} updated successfully!`)
    } else {
      // Create new user - use raw query to bypass model hooks
      console.log('Creating new user...')
      const result = await db.rawQuery(
        `INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
         RETURNING id`,
        [email, hashedPassword, 'Admin', 'User', 'admin', true, new Date(), new Date()]
      )
      
      const userId = result.rows[0].id
      user = await User.findOrFail(userId)
      console.log(`Admin user ${user.email} created successfully!`)
    }
    
    // Verify the password works
    try {
      const verified = await User.verifyCredentials(email, password)
      console.log('✅ Password verification successful!')
    } catch (error: any) {
      console.error('❌ Password verification failed:', error.message)
    }
  }
}
