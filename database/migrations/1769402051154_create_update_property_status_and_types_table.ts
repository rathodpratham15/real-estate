import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'properties'

  async up() {
    // For PostgreSQL, we need to alter the enum types
    // Since we can't directly modify enum values, we'll use raw SQL
    this.schema.raw(`
      -- Alter property_type enum
      ALTER TABLE properties 
      DROP CONSTRAINT IF EXISTS properties_property_type_check;
      
      ALTER TABLE properties 
      ADD CONSTRAINT properties_property_type_check 
      CHECK (property_type IN ('house', 'shop', 'godown', 'land', 'commercial', 'other'));
      
      -- Alter status enum
      ALTER TABLE properties 
      DROP CONSTRAINT IF EXISTS properties_status_check;
      
      ALTER TABLE properties 
      ADD CONSTRAINT properties_status_check 
      CHECK (status IN ('for_sale', 'rental'));
    `)

    // Add column for custom property type when "other" is selected
    this.schema.alterTable(this.tableName, (table) => {
      table.string('property_type_other').nullable().after('property_type')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('property_type_other')
    })

    // Restore original enum constraints
    this.schema.raw(`
      ALTER TABLE properties 
      DROP CONSTRAINT IF EXISTS properties_property_type_check;
      
      ALTER TABLE properties 
      ADD CONSTRAINT properties_property_type_check 
      CHECK (property_type IN ('house', 'apartment', 'condo', 'townhouse', 'land', 'commercial'));
      
      ALTER TABLE properties 
      DROP CONSTRAINT IF EXISTS properties_status_check;
      
      ALTER TABLE properties 
      ADD CONSTRAINT properties_status_check 
      CHECK (status IN ('for_sale', 'sold', 'pending', 'off_market'));
    `)
  }
}
