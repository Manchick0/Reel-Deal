#!/usr/bin/env bash

NAME="Reel Deal"
VERSION="1.1.0"

rm *.zip
node define-parts.js
echo "{
    \"pack\": {
        \"description\": \"§o*An incredibly floppy bassline*\n§8@Manchick | v§7$VERSION\",
        \"max_format\": [121, 0],
        \"min_format\": [121, 0]
    }
}" > pack.mcmeta
zip "$NAME $VERSION.zip" -r data pack.png pack.mcmeta