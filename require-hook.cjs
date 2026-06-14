// Normalizes module path casing on Windows so that the Node.js module cache
// uses a single canonical key for paths like "Nairescents.com" vs "nairescents.com".
const Module = require('module');
const fs = require('fs');
const path = require('path');

const projectRoot = fs.realpathSync(path.resolve(__dirname));
// Lowercase key for case-insensitive prefix matching
const projectRootLower = projectRoot.toLowerCase();

const _resolveFilename = Module._resolveFilename;
Module._resolveFilename = function patchedResolve(request, parent, isMain, options) {
  const resolved = _resolveFilename.call(this, request, parent, isMain, options);
  if (typeof resolved !== 'string') return resolved;
  if (resolved.toLowerCase().startsWith(projectRootLower)) {
    return projectRoot + resolved.slice(projectRoot.length);
  }
  return resolved;
};
