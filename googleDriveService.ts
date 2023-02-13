import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { google } = require('googleapis');

/**
 * Browse the link below to see the complete object returned for folder/file creation and search
 *
 * @link https://developers.google.com/drive/api/v3/reference/files#resource
 */
type PartialDriveFile = {
  id: string;
  name: string;
};

type SearchResultResponse = {
  kind: 'drive#fileList';
  nextPageToken: string;
  incompleteSearch: boolean;
  files: PartialDriveFile[];
};

export class GoogleDriveService {
  private driveClient;
  private driveClientV2;

  public constructor(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
    this.driveClient = this.createDriveClient(clientId, clientSecret, redirectUri, refreshToken);
    this.driveClientV2 = this.createDriveClientV2(clientId, clientSecret, redirectUri, refreshToken);
  }

  createDriveClient(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    client.setCredentials({ refresh_token: refreshToken });
    // console.log('client client client');

    // console.log(client);

    return google.drive({
      version: 'v3',
      auth: client,
    });
  }

  createDriveClientV2(clientId: string, clientSecret: string, redirectUri: string, refreshToken: string) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    client.setCredentials({ refresh_token: refreshToken });
    return google.drive({
      version: 'v2',
      auth: client,
    });
  }

  createFolder(folderName: string): Promise<PartialDriveFile> {
    return this.driveClient.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id, name',
    });
  }

  searchFolder(folderName: string): Promise<PartialDriveFile | null> {
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: 'files(id, name)',
        },
        (err, res: { data: SearchResultResponse }) => {
          if (err) {
            return reject(err);
          }

          return resolve(res.data.files ? res.data.files[0] : null);
        },
      );
    });
  }

  saveFile(fileName: string, filePath: string, fileMimeType: string, folderId?: string) {
    return this.driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: fs.createReadStream(filePath),
      },
      fields: 'id, name, exportLinks, webViewLink',
    });
  }

  createDocsEditor(_fileMetadata: any, _media: any) {
    return this.driveClientV2.files.insert({
      resource: _fileMetadata,
      media: _media,
      fields: 'id',
      convert: true,
    });
  }

  assignPermission(_fileId: string) {
    return this.driveClient.permissions.create({
      resource: { type: 'anyone', role: 'writer' },
      fileId: _fileId,
      fields: 'id',
    });
  }

  exportFile(_fileId: string, _mimeType = 'application/pdf'): Promise<any> {
    return this.driveClient.files.export(
      {
        fileId: _fileId,
        mimeType: _mimeType,
      },
      //{ responseType: 'stream' },
    );
  }

  createNewFile(_media: any, _fileMetadata: any) {
    return this.driveClient.files.create({
      resource: _fileMetadata,
      media: _media,
      fields: 'id',
    });
  }

  getFile(_fileId) {
    return this.driveClient.files.get({
      fileId: _fileId,
      fields: 'id, modifiedTime, webContentLink, mimeType, exportLinks, webViewLink',
    });
  }

  getFileBlob(_fileId) {
    return this.driveClient.files.get({
      fileId: _fileId,
      alt: 'media',
    });
  }

  exportPdf(_fileId: string, _mimeType = 'application/pdf'): Promise<any> {
    return this.driveClient.files.export({
      fileId: _fileId,
      mimeType: _mimeType,
    });
  }
}
