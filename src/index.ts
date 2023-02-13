import dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

import { GoogleDriveService } from '../googleDriveService';

dotenv.config();

const driveClientId = process.env.GOOGLE_DRIVE_CLIENT_ID || '';
const driveClientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
const driveRedirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI || '';
const driveRefreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '';

(async () => {
  const googleDriveService = new GoogleDriveService(driveClientId, driveClientSecret, driveRedirectUri, driveRefreshToken);

  const finalPath = path.resolve(__dirname, '../public/so_yeu_li_lich.docx');
  const folderName = 'Picture';

  if (!fs.existsSync(finalPath)) {
    throw new Error('File not found!');
  }

  let folder = await googleDriveService.searchFolder(folderName).catch((error) => {
    console.error(error);
    return null;
  });

  if (!folder) {
    folder = await googleDriveService.createFolder(folderName);
  }

  //.saveFile('SpaceX', finalPath, 'image/jpg', folder.id)
  //application/vnd.openxmlformats-officedocument.wordprocessingml.document

  // Todo upload file to drive
  const resultSaveFile = await googleDriveService.saveFile(
    `SpaceX-${Math.floor(Math.random() * 1000)}`,
    finalPath,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    folder.id,
  );
  //Create file use version v2
  // const fileMetadata = {
  //   title: `SpaceX-${Math.floor(Math.random() * 1000)}`,
  // };
  // const media = {
  //   mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //   body: fs.createReadStream(path.resolve(__dirname, '../public/so_yeu_li_lich.docx')),
  // };
  // const resultSaveFile = await googleDriveService.createDocsEditor(fileMetadata, media);

  console.log('resultSaveFile', resultSaveFile);

  const resultAssignPermission = await googleDriveService.assignPermission(resultSaveFile.data.id);

  console.log('resultAssignPermission resultAssignPermission', resultAssignPermission);
  //End create file use version v2
  // End todo upload file

  //Todo export file

  // const fileMetadata = {
  //   name: 'test 1111',
  // };
  // const media = {
  //   mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //   body: fs.createReadStream(path.resolve(__dirname, '../public/so_yeu_li_lich.docx')),
  // };

  // await googleDriveService.createNewFile(media, fileMetadata);

  // const resExport = await googleDriveService.exportFile('1e7t6tubI9BD_myGMA1qrTRKvtRwV4EzNd1cTNyGNGik');

  // console.log('File --------------');
  // console.log(resExport);

  // // Todo get file
  // googleDriveService.getFile('1e7t6tubI9BD_myGMA1qrTRKvtRwV4EzNd1cTNyGNGik').then((x: any) => {
  //   console.log('-----------------------Result----------------------------');
  //   console.log(x);
  // });

  console.info('File uploaded successfully!');

  // Delete the file on the server
  //fs.unlinkSync(finalPath);
})();
