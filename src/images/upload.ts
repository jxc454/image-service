import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload'
import SendData = ManagedUpload.SendData
import config from 'config'

import fs from 'fs'
import S3 from 'aws-sdk/clients/s3'

const AWS_REGION: string = config.get('aws.region')
const BUCKET: string = config.get('aws.bucket')

export async function uploadFile(ctx: any) {
  const files = ctx.request.files.image
  const myFiles = Array.isArray(files)
    ? files
    : typeof files === 'object'
    ? [files]
    : null

  if (myFiles) {
    try {
      const filePromises = myFiles.map((file: any) => {
        const s3 = new S3({
          region: AWS_REGION,
        })
        const { path, name, type } = file
        const body = fs.createReadStream(path)

        const params = {
          Bucket: BUCKET,
          Key: name,
          Body: body,
          ContentType: type,
        }

        return new Promise(function (resolve, reject) {
          s3.upload(params, function (error: Error, data: SendData) {
            if (error) {
              // console.error('S3 upload error', error)
              reject(error)
              return
            }

            resolve(data)
          })
        })
      })

      ctx.body = await Promise.all(filePromises)
    } catch (error) {
      // console.error(error)
      ctx.body = error
    }
  }

  return ctx.body
}
