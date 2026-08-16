#!/usr/bin/env node
// Convert an input string to a URL-safe kebab-case slug.
// Usage: node slugify.js "Some Title Here!"
'use strict';
const input = process.argv[2];
if (!input) {
  console.error('usage: slugify.js "<text>"');
  process.exit(1);
}

// Strip Unicode combining marks (0x0300-0x036f) left behind by NFKD
// normalization, e.g. turns an accented e into a plain e.
const stripped = Array.from(input.normalize('NFKD'))
  .filter((ch) => {
    const c = ch.codePointAt(0);
    return c < 0x300 || c > 0x36f;
  })
  .join('');

const slug = stripped
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

console.log(slug);
