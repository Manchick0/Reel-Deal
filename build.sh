#!/usr/bin/env bash
NAME=$(circumscribe evaluate name)
VERSION=$(circumscribe evaluate version)

rm -f *.zip
if circumscribe; then
    cd build && zip ../"$NAME $VERSION.zip" -r data pack.mcmeta pack.png && cd ..
fi