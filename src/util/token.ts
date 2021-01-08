import qiniu from 'qiniu';

export const genMac = (ak: string, sk: string) => {
  return new qiniu.auth.digest.Mac(ak, sk);
};

export function genToken(bucket: string, ak: string, sk: string): string {
  const mac = genMac(ak, sk);

  const putPolicy = new qiniu.rs.PutPolicy({
    scope: bucket
  });
  const token = putPolicy.uploadToken(mac);
  return token;
}
