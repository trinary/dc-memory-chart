#!/bin/sh

echo "[" `grep heap_used -  | cut -d ' ' -f 3- | sed 's/$/\,/' ` "]" | sed 's/, \]/\]/' | jq -a -M .
