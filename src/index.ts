import * as core from '@actions/core';
import clearPrefix from './util/clearPrefix';
import getInputs from './util/input';
import { genMac, genToken } from './util/token';
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
      destDir,
      clear,
      zone
    } = getInputs();
    const token = genToken(bucket, accessKey, secretKey);

    if (clear) {
      try {
        await clearPrefix(destDir, bucket, genMac(accessKey, secretKey), zone);
      } catch (e) {
        core.warning('something get wrong when clear destDir');
        core.warning(e);
      }
    }

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
