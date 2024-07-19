const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const AWS = require('aws-sdk');
const wasabiEndpoint = new AWS.Endpoint('s3.us-central-1.wasabisys.com');

const accessKeyId = process.env.WASABI_ACCESS_KEY
const secretAccessKey = process.env.WASABI_SECRET_KEY

const s3 = new S3Client({
    endpoint: wasabiEndpoint,
    region: 'us-central-1',
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});

class Wasabi {

    static async putObject(fileName, data) {
        const input = { // PutObjectRequest
            // ACL: "private" || "public-read" || "public-read-write" || "authenticated-read" || "aws-exec-read" || "bucket-owner-read" || "bucket-owner-full-control",
            Body: data, // see \@smithy/types -> StreamingBlobPayloadInputTypes
            // Body: "MULTIPLE_TYPES_ACCEPTED", // see \@smithy/types -> StreamingBlobPayloadInputTypes
            Bucket: "umbrella.api", // required
            // CacheControl: "STRING_VALUE",
            // ContentDisposition: "STRING_VALUE",
            // ContentEncoding: "STRING_VALUE",
            // ContentLanguage: "STRING_VALUE",
            // ContentLength: Number("long"),
            // ContentMD5: "STRING_VALUE",
            // ContentType: "STRING_VALUE",
            // ChecksumAlgorithm: "CRC32" || "CRC32C" || "SHA1" || "SHA256",
            // ChecksumCRC32: "STRING_VALUE",
            // ChecksumCRC32C: "STRING_VALUE",
            // ChecksumSHA1: "STRING_VALUE",
            // ChecksumSHA256: "STRING_VALUE",
            // Expires: new Date("TIMESTAMP"),
            // GrantFullControl: "STRING_VALUE",
            // GrantRead: "STRING_VALUE",
            // GrantReadACP: "STRING_VALUE",
            // GrantWriteACP: "STRING_VALUE",
            Key: fileName, // required
            // Metadata: { // Metadata
            //     "<keys>": "STRING_VALUE",
            // },
            // ServerSideEncryption: "AES256" || "aws:kms" || "aws:kms:dsse",
            // StorageClass: "STANDARD" || "REDUCED_REDUNDANCY" || "STANDARD_IA" || "ONEZONE_IA" || "INTELLIGENT_TIERING" || "GLACIER" || "DEEP_ARCHIVE" || "OUTPOSTS" || "GLACIER_IR" || "SNOW" || "EXPRESS_ONEZONE",
            // WebsiteRedirectLocation: "STRING_VALUE",
            // SSECustomerAlgorithm: "STRING_VALUE",
            // SSECustomerKey: "STRING_VALUE",
            // SSECustomerKeyMD5: "STRING_VALUE",
            // SSEKMSKeyId: "STRING_VALUE",
            // SSEKMSEncryptionContext: "STRING_VALUE",
            // BucketKeyEnabled: true || false,
            // RequestPayer: "requester",
            // Tagging: "STRING_VALUE",
            // ObjectLockMode: "GOVERNANCE" || "COMPLIANCE",
            // ObjectLockRetainUntilDate: new Date("TIMESTAMP"),
            // ObjectLockLegalHoldStatus: "ON" || "OFF",
            // ExpectedBucketOwner: "STRING_VALUE",
        };
        const command = new PutObjectCommand(input);
        const response = await s3.send(command);
        console.log(response)
        return response
    }

}

module.exports = Wasabi