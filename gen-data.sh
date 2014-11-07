#!/bin/sh

echo "[" `grep heap_used -  | cut -d ' ' -f 7- | sed 's/$/\,/' ` "]" | sed 's/, \]/\]/' | jq -a -M .
