import { Express } from 'express';

export class FileDto {
  file: Express.Multer.File;
  type: string;
}
