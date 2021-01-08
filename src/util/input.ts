import * as core from '@actions/core';
import qiniu from 'qiniu';
enum InputKey {
  ACCESS_KEY = 'access_key',
  SECRET_KEY = 'secret_key',
  BUCKET = 'bucket',
  SOURCE_DIR = 'source_dir',
  DEST_DIR = 'dest_dir',
  IGNORE_SOURCE_MAP = 'ignore_source_map',
  EXCLUDE = 'exclude',
  CLEAR = 'clear',
  ZONE = 'zone'
}

const zoneMap = new Map([
  ['huadong', qiniu.zone.Zone_z0],
  ['huabei', qiniu.zone.Zone_z1],
  ['huanan', qiniu.zone.Zone_z2],
  ['na', qiniu.zone.Zone_na0],
  ['asia', qiniu.zone.Zone_as0]
]);

const getInputs = () => {
  const accessKey = core.getInput(InputKey.ACCESS_KEY);
  const secretKey = core.getInput(InputKey.SECRET_KEY);
  const bucket = core.getInput(InputKey.BUCKET);
  const sourceDir = core.getInput(InputKey.SOURCE_DIR);
  const destDir = core.getInput(InputKey.DEST_DIR);
  const zoneStr = core.getInput(InputKey.ZONE);

  const ignoreSourceMap = core.getInput(InputKey.IGNORE_SOURCE_MAP) === 'true';
  const clear = core.getInput(InputKey.CLEAR) === 'true';
  let exclude: RegExp[] = [];
  try {
    exclude = (JSON.parse(core.getInput(InputKey.EXCLUDE)) as string[]).map(
      (val: string) => new RegExp(val)
    );
  } catch (e) {
    // do nothing
  }
  const zone = zoneMap.has(zoneStr)
    ? zoneMap.get(zoneStr)!
    : zoneMap.get('huanan')!;
  return {
    accessKey,
    secretKey,
    bucket,
    sourceDir,
    destDir,
    ignoreSourceMap,
    exclude,
    clear,
    zone
  };
};

export default getInputs;
