import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FileDto } from './dto/file.dto';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import * as shell from 'shelljs';
import { getFileSize } from 'util/util';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly redis: Cache,
    private readonly configService: ConfigService,
  ) {}

  async handleUpload(param: FileDto) {
    switch (param.type) {
      case 'ipa':
        const ipaFile = this.configService.get('ipaPath') + '/' + param.file.originalname;

        fs.writeFileSync(ipaFile, param.file.buffer);

        const appSize = getFileSize(param.file.size);

        // 解析ipa信息   版本
        shell.exec(`unzip ${ipaFile} -d ${this.configService.get('tmpPath')}/ipa`);
        // info.plist
        const infoPlistStr = shell.exec(`plistutil -i ${this.configService.get('tmpPath')}/ipa/Payload/*.app/Info.plist -f json`);

        console.log('====> ipa Info.plist解析内容: ', infoPlistStr);

        const infoPlist = JSON.parse(infoPlistStr);

        const appName = infoPlist.CFBundleDisplayName;
        const appVersion = infoPlist.CFBundleShortVersionString;
        const appIdentifier = infoPlist.CFBundleIdentifier;

        // todo logo保存到oss
        const logoPath = shell.exec(`ls -S ${this.configService.get('tmpPath')}/ipa/Payload/*.app/${infoPlist.CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconName}*.pnp |head -n 1`);
        console.log('====> ipa logo path: ', logoPath);

        break;
      case 'apk':
        break;
    }

    // 清除tmp临时文件

    shell.rm(this.configService.get('tmpPath') + '/*');

    return null;
  }
}
