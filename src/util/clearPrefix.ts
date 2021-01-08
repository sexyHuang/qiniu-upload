import qiniu from 'qiniu';

const SUCCESS_CODE = 200;
const MAX = 1000;
type ResponseInfo = {
  statusCode: number;
};

type FileInfo = {
  key: string;
  hash: string;
  fsize: number;
  mimeType: string;
  type: string;
  endUser: string;
  putTime: string;
};
export const listPrefix = (
  prefix: string,
  bucket: string,
  bucketManager: qiniu.rs.BucketManager,
  limit = 10,
  marker?: any
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    bucketManager.listPrefix(
      bucket,
      {
        prefix,
        limit,
        marker
      },
      async (
        err,
        res: { marker: any; items: FileInfo[]; commonPrefixes: string },
        resInfo: ResponseInfo
      ) => {
        if (err || resInfo.statusCode !== SUCCESS_CODE) {
          reject(err);
          return;
        }
        const nextMarker = res.marker;
        const list = res.items.map(item => item.key);
        let nextList: string[] = [];
        if (nextMarker)
          nextList = await listPrefix(
            prefix,
            bucket,
            bucketManager,
            limit,
            nextMarker
          );
        resolve([...list, ...nextList]);
      }
    );
  });
};

export const batch = (
  operations: string[],
  bucketManager: qiniu.rs.BucketManager
): Promise<any[]> => {
  if (!operations.length) return Promise.resolve([]);
  const [curr, next] = [operations.slice(0, MAX), operations.slice(MAX)];
  return new Promise<any[]>((resolve, reject) => {
    bucketManager.batch(curr, async (err, response, resInfo: ResponseInfo) => {
      if (err || resInfo.statusCode !== SUCCESS_CODE) {
        reject(err);
        return;
      }
      resolve([response, ...(await batch(next, bucketManager))]);
    });
  });
};

const clearPrefix = async (
  prefix: string,
  bucket: string,
  mac: qiniu.auth.digest.Mac,
  zone: qiniu.conf.Zone = qiniu.zone.Zone_z2
) => {
  const config = new qiniu.conf.Config({
    zone
  });

  const bucketManager = new qiniu.rs.BucketManager(mac, config);
  const list = await listPrefix(prefix, bucket, bucketManager, 50);
  const deleteOperations = list.map(key => qiniu.rs.deleteOp(bucket, key));
  const res = await batch(deleteOperations, bucketManager);
  return res;
};

export default clearPrefix;
