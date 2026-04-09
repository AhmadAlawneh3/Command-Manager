#!/usr/bin/env node
// Validate every command JSON file under commands/ against schema/command.schema.json.
// Usage: node validate-commands.js
//
// Checks performed:
//   1. JSON parses
//   2. Conforms to schema/command.schema.json
//   3. id matches filename (sans .json)
//   4. id is unique across the whole repo
//   5. The directory the file lives in matches a category/subcategory in _categories.json

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

const ROOT = __dirname;
const COMMANDS_DIR = path.join(ROOT, 'commands');
const SCHEMA_PATH = path.join(ROOT, 'schema', 'command.schema.json');
const CATEGORIES_PATH = path.join(COMMANDS_DIR, '_categories.json');

const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, 'utf8'));
const categories = JSON.parse(fs.readFileSync(CATEGORIES_PATH, 'utf8'));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const errors = [];
const seenIds = new Map(); // id -> first file path

function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, '/');
}

function walk(dir, category, subcategory) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_')) continue;
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (category === null) {
        if (!categories[entry.name]) {
          errors.push(`${rel(full)}: unknown category "${entry.name}" (not in commands/_categories.json)`);
        }
        walk(full, entry.name, null);
      } else if (subcategory === null) {
        const subs = categories[category] && categories[category].subcategories;
        if (!subs || !subs[entry.name]) {
          errors.push(`${rel(full)}: unknown subcategory "${entry.name}" under category "${category}"`);
        }
        walk(full, category, entry.name);
      } else {
        errors.push(`${rel(full)}: command files must live at commands/<category>/<subcategory>/<id>.json (no deeper nesting)`);
      }
      continue;
    }

    if (!entry.name.endsWith('.json')) continue;

    let data;
    try {
      data = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (e) {
      errors.push(`${rel(full)}: invalid JSON — ${e.message}`);
      continue;
    }

    const ok = validate(data);
    if (!ok) {
      for (const err of validate.errors) {
        errors.push(`${rel(full)}: ${err.instancePath || '/'} ${err.message}`);
      }
      continue;
    }

    if (category === null || subcategory === null) {
      errors.push(`${rel(full)}: must live under commands/<category>/<subcategory>/`);
      continue;
    }

    const expectedId = entry.name.replace(/\.json$/, '');
    if (data.id !== expectedId) {
      errors.push(`${rel(full)}: id "${data.id}" does not match filename "${expectedId}.json"`);
    }

    if (seenIds.has(data.id)) {
      errors.push(`${rel(full)}: duplicate id "${data.id}" (also in ${rel(seenIds.get(data.id))})`);
    } else {
      seenIds.set(data.id, full);
    }
  }
}

walk(COMMANDS_DIR, null, null);

if (errors.length > 0) {
  console.error(`\n${errors.length} validation error(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('');
  process.exit(1);
}

console.log(`OK — ${seenIds.size} commands validated.`);
