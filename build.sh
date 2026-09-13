#!/usr/bin/env bash

NAME="Real Deal"
VERSION="1.0.0"

node define-parts.js
zip "$NAME $VERSION.zip" -r data pack.png pack.mcmeta