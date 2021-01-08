import * as core from '@actions/core';

enum InputKey {
  ACCESS_KEY = 'access_key',
  SECRET_KEY = 'secret_key',
  BUCKET = 'bucket',
  SOURCE_DIR = 'source_dir',
  DEST_DIR = 'dest_dir',
  IGNORE_SOURCE_MAP = 'ignore_source_map',
  EXCLUDE = 'exclude'
}

const getInputs = () => {
  const accessKey = core.getInput(InputKey.ACCESS_KEY);
  const secretKey = core.getInput(InputKey.SECRET_KEY);
  const bucket = core.getInput(InputKey.BUCKET);
  const sourceDir = core.getInput(InputKey.SOURCE_DIR);
  const destDir = core.getInput(InputKey.DEST_DIR);

  const ignoreSourceMap = core.getInput(InputKey.IGNORE_SOURCE_MAP) === 'true';
  let exclude: RegExp[] = [];
  try {
    exclude = (JSON.parse(core.getInput(InputKey.EXCLUDE)) as string[]).map(
      (val: string) => new RegExp(val)
    );
  } catch (e) {
    // do nothing
  }

  return {
    accessKey,
    secretKey,
    bucket,
    sourceDir,
    destDir,
    ignoreSourceMap,
    exclude
  };
};

export default getInputs;
