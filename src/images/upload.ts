import { ManagedUpload } from "aws-sdk/lib/s3/managed_upload";
import SendData = ManagedUpload.SendData;
import config from "config";

import fs from "fs";
import S3 from "aws-sdk/clients/s3";

const AWS_REGION: string = config.get("aws.region");
const BUCKET: string = config.get("aws.bucket");

export async function uploadFile(ctx: any) {
  const files = ctx.request.files.myFile; // myFile is the attribute/input name in your frontend app "Form-Data"
  const myFiles = Array.isArray(files)
    ? files
    : typeof files === "object"
    ? [files]
    : null; // to handle single file and multiple files

  if (myFiles) {
    try {
      const filePromises = myFiles.map((file) => {
        const s3 = new S3({
          region: AWS_REGION,
        });
        const { path, name, type } = file;
        const body = fs.createReadStream(path);

        const params = {
          Bucket: BUCKET,
          Key: name,
          Body: body,
          ContentType: type,
        };

        return new Promise(function (resolve, reject) {
          s3.upload(params, function (error: Error, data: SendData) {
            if (error) {
              reject(error);
              return;
            }
            console.log(data);
            resolve(data);
            return;
          });
        });
      });

      ctx.body = await Promise.all(filePromises);
    } catch (error) {
      console.error(error);
      ctx.body = error;
    }
  }
}
