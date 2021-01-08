import * as core from '@actions/core';
import getInputs from './util/input';
import { genToken } from './util/token';
import { upload } from './util/upload';

const main = async () => {
  try {
    const {
      accessKey,
      secretKey,
      exclude,
      bucket,
      ignoreSourceMap,
      sourceDir,
      destDir
    } = getInputs();
    const token = genToken(bucket, accessKey, secretKey);
    await upload(
      token,
      sourceDir,
      destDir,
      ignoreSourceMap,
      (file, key) => {
        core.info(`success: ${file} => [${bucket}]: ${key}`);
      },
      exclude
    );
    core.info('Done!');
  } catch (e) {
    core.setFailed(e);
  }
};

main();
