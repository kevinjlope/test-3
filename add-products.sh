#!/bin/bash

# Configuration
BASE_URL="http://localhost:5173"
ENDPOINT="/products/new"

echo "🚀 Starting to add products via CURL..."

add_product() {
  local NAME=$1
  local PRICE=$2
  local STOCK=$3
  local CATEGORY=$4
  local UNIT=$5
  local DESC=$6
  local IMG_URL=$7
  local ALT=$8

  echo "------------------------------------------"
  echo "📦 Adding: $NAME"

  # Construct the JSON payload that the 'data' field expects
  PAYLOAD=$(cat <<EOF
{
  "name": "$NAME",
  "price": $PRICE,
  "stockQuantity": $STOCK,
  "category": "$CATEGORY",
  "unitOfSale": "$UNIT",
  "description": "$DESC",
  "images": [
    {
      "url": "$IMG_URL",
      "altText": "$ALT"
    }
  ]
}
EOF
)

  # Send the POST request as multipart/form-data with the 'data' field
  # We use -L to follow redirects (React Router actions usually redirect to /)
  RESPONSE=$(curl -s -L -X POST "$BASE_URL$ENDPOINT" \
    -F "data=$PAYLOAD" \
    -w "%{http_code}")

  if [[ "$RESPONSE" == *"200"* ]]; then
    echo "✅ Success: $NAME added."
  else
    echo "❌ Error adding $NAME (HTTP Code: $RESPONSE)"
  fi
}

# --- PRODUCT DATA ---

add_product \
  "Midnight Calla Lilies" \
  "65.00" \
  "40" \
  "mixed" \
  "bunch" \
  "Exotic and mysterious calla lilies with deep purple petals that appear almost black. Truly a statement piece." \
  "https://images.pexels.com/photos/67867/calla-lily-flower-white-lilies-67867.jpeg?auto=compress&cs=tinysrgb&w=800" \
  "Sleek dark calla lilies in a vase"

add_product \
  "Pastel Peonies" \
  "89.99" \
  "25" \
  "mixed" \
  "bunch" \
  "Voluminous and fragrant peonies in a variety of soft pink and cream shades. These are premium, seasonal blooms." \
  "https://images.pexels.com/photos/65330/pexels-photo-65330.jpeg?auto=compress&cs=tinysrgb&w=800" \
  "Lush light pink peony flower"

add_product \
  "Wild Field Daisies" \
  "12.50" \
  "300" \
  "mixed" \
  "stem" \
  "Simple, charming daisies that bring a touch of the countryside to any arrangement. High durability and long life." \
  "https://images.pexels.com/photos/59439/daisy-flower-meadow-nature-59439.jpeg?auto=compress&cs=tinysrgb&w=800" \
  "Simple white daisy with yellow center"

echo "------------------------------------------"
echo "🏁 Finished adding products."
