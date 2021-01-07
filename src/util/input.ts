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

export const accessKey = core.getInput(InputKey.ACCESS_KEY);
export const secretKey = core.getInput(InputKey.SECRET_KEY);
export const bucket = core.getInput(InputKey.BUCKET);
export const sourceDir = core.getInput(InputKey.SOURCE_DIR);

const ismFlagStr = core.getInput(InputKey.IGNORE_SOURCE_MAP);
export const ignoreSourceMap = ismFlagStr ? ismFlagStr === 'true' : true;
export const exclude = (JSON.parse(
  core.getInput(InputKey.EXCLUDE) || '[]'
) as string[]).map((val: string) => new RegExp(val));
