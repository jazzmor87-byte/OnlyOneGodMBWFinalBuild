#!/usr/bin/env node
'use strict';

const result = Object.freeze({
  result: 'GREEN',
  ownerState: 'DISABLED',
  dependencyWritePerformed: false,
});

if (require.main === module) {
  console.log('LEGACY_DEPENDENCY_PATCH_OWNER=DISABLED');
  console.log('DEPENDENCY_WRITE_PERFORMED=False');
}

module.exports = result;
