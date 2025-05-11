#!/bin/bash

# Set the absolute path to the Tute folder
TUTE_DIR="/home/apurv/Desktop/Apurve-Backend/Tute"

# Check if the Tute folder exists
if [ ! -d "$TUTE_DIR" ]; then
    echo "❌ The folder '$TUTE_DIR' does not exist."
    exit 1
fi

echo "🚨 Deleting all subfolders inside: $TUTE_DIR"
echo "⚠️ This requires sudo to remove root-owned folders."

# Use sudo to delete all subfolders inside Tute
sudo find "$TUTE_DIR" -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} +

echo "✅ Done. All subfolders deleted from '$TUTE_DIR'."
