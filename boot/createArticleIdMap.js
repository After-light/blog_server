const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config({ path: '.env' });
const { ARTICLES_PATH, ARTICLES_ID_MAP_PATH } = process.env;

const ARTICLES_ABSOLUTE_PATH = path.resolve(__dirname, '../', ARTICLES_PATH);
const ARTICLES_ID_MAP_ABSOLUTE_PATH = path.resolve(__dirname, '../', ARTICLES_ID_MAP_PATH);

const createMap = (files, initMap = {}) => {
  return files.reduce((prev, curr) => curr.name && (prev[curr.name] = uuidv4()) && prev, initMap);
};

const addNewsToMap = (files, mapString) => {
  const oldMap = JSON.parse(mapString);

  const notExistsFiles = files.filter((e) => !Object.keys(oldMap).includes(e.name));
  if (!notExistsFiles.length) {
    return;
  }

  return createMap(notExistsFiles, oldMap);
};

const buildArticleIdMap = () => {
  let files;
  try {
    files = fs.readdirSync(ARTICLES_ABSOLUTE_PATH, { withFileTypes: true });
  } catch (err) {}

  if (!files) {
    return;
  }

  let mapString;
  try {
    mapString = fs.readFileSync(ARTICLES_ID_MAP_ABSOLUTE_PATH, { encoding: 'utf8' });
  } catch (err) {}

  return !mapString ? createMap(files) : addNewsToMap(files, mapString);
};

const writeMapToFile = (fileContent) => {
  if (!fileContent) {
    console.log('\x1b[32m%s\x1b[0m', 'no files have been deleted or added.');
    return;
  }

  fs.writeFile(ARTICLES_ID_MAP_ABSOLUTE_PATH, JSON.stringify(fileContent), (error) => {
    if (error) {
      console.error('\x1b[31m%s\x1b[0m', error);
    } else {
      console.log('\x1b[32m%s\x1b[0m', 'File written successfully!');
    }
  });
};

writeMapToFile(buildArticleIdMap());
