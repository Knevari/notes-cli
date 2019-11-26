const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const commander = require('commander');
const { execSync } = require('child_process');

const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf-8'));

const NOTES_DIR = './notes';

if (!fs.existsSync(NOTES_DIR)) {
  fs.mkdirSync(NOTES_DIR);
}

function updateEditorPreference(yamlConfig, newEditor) {
  yamlConfig.editor = newEditor;
  fs.writeFileSync(
    './config.yml',
    yaml.safeDump(yamlConfig),
    'utf-8'
  );
  process.exit(0);
}

function updateCategory(category) {
  const categorypath = path.join(NOTES_DIR, category);

  if (!fs.existsSync(categorypath)) {
    fs.mkdirSync(categorypath);
  }
}

function createNote(category, name, cli) {
  const filepath = path.join(
    NOTES_DIR,
    category,
    name + '.txt'
  );

  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, '');
  }

  execSync(`${editorCli} ${filepath}`);
}

const program = new commander.Command();

program
  .option('-e, --editor <editor>', 'text editor to open note with')
  .option('-n, --name <name>', 'note\'s name')
  .option('-c --category <category>', 'category to be saved');

program.parse(process.argv);

const editor = program.editor;
let editorCli = config.editor;

if (editor && typeof program.name === 'function') updateEditorPreference(config, editor);
if (editor) editorCli = config.editorClis[editor];
if (program.category) updateCategory(program.category);
if (program.name) createNote(program.category || '', program.name, editorCli);
