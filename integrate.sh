#!/bin/bash

# Integration script to copy real estate website files to main codebase
# Run this from the real-estate-website directory

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="$SOURCE_DIR/../swapt-next"

echo "Integrating real estate website into main codebase..."
echo "Source: $SOURCE_DIR"
echo "Target: $TARGET_DIR"

# Copy models
echo "Copying models..."
cp -r "$SOURCE_DIR/app/models/"* "$TARGET_DIR/app/models/"

# Copy controllers
echo "Copying controllers..."
cp -r "$SOURCE_DIR/app/controllers/"* "$TARGET_DIR/app/controllers/"

# Copy migrations
echo "Copying migrations..."
cp -r "$SOURCE_DIR/database/migrations/"* "$TARGET_DIR/database/migrations/"

# Copy inertia pages
echo "Copying Inertia pages..."
mkdir -p "$TARGET_DIR/inertia/pages/real-estate"
cp -r "$SOURCE_DIR/inertia/pages/real-estate/"* "$TARGET_DIR/inertia/pages/real-estate/"

# Copy inertia components
echo "Copying Inertia components..."
mkdir -p "$TARGET_DIR/inertia/components/real-estate"
cp -r "$SOURCE_DIR/inertia/components/real-estate/"* "$TARGET_DIR/inertia/components/real-estate/"

# Copy types
echo "Copying types..."
cp "$SOURCE_DIR/inertia/lib/real-estate-types.ts" "$TARGET_DIR/inertia/lib/"

# Copy routes
echo "Copying routes..."
cp "$SOURCE_DIR/start/routes/real_estate.ts" "$TARGET_DIR/start/routes/"

# Add route import if not already present
if ! grep -q "import '#start/routes/real_estate'" "$TARGET_DIR/start/routes.ts"; then
    echo "Adding route import..."
    echo "import '#start/routes/real_estate'" >> "$TARGET_DIR/start/routes.ts"
fi

echo "Integration complete!"
echo ""
echo "Next steps:"
echo "1. Run migrations: cd swapt-next && node ace migration:run"
echo "2. Start the dev server: cd swapt-next && pnpm dev"
echo "3. Visit: http://localhost:3333/real-estate"
