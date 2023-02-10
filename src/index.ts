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

  // Todo upload file to drive
  // await googleDriveService
  //   .saveFile(
  //     `SpaceX-${Math.floor(Math.random() * 1000)}`,
  //     finalPath,
  //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //     folder.id,
  //   )
  //   .then((res) => {
  //     console.log('sssssssssssssss------------------------------------------------------------');
  //     console.log(res);
  //     console.log('ssssssssssssss------------------------------------------------------------');
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  // End todo upload file

  // Todo export file
  const resExport = await googleDriveService.exportFile('1PxFTFlH2tcKxoKoVm3uzxTbxPSTFUuo-');

  console.log('File --------------');
  console.log(resExport);

  console.info('File uploaded successfully!');

  // Delete the file on the server
  //fs.unlinkSync(finalPath);
})();
