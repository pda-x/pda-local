import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import { AppConfig } from 'src/interface/AppConfig';
import { AppInfo } from 'src/interface/AppInfo';
import { R } from 'src/util/res';
import * as _ from 'lodash';
import { getFileSize } from 'src/util/util';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly redis: Cache,
    private readonly log: Logger,
  ) {}

  async handleUpload(file: Express.Multer.File) {
    const originalName = file.originalname;

    if (path.extname(originalName) !== '.ipa') {
    }

    const fileName = crypto.randomUUID().replaceAll('-', ''); // 重命名文件
    const config: AppConfig = await this.redis.get('pda:config');

    const ipaFile = config.ipaPath + '/' + fileName + '.ipa';

    fs.writeFileSync(ipaFile, file.buffer);

    const appSize: string = getFileSize(file.size);

    // 解析ipa信息
    shell.exec(`unzip ${ipaFile} -d ${config.tmpPath}/ipa`);

    // info.plist
    const infoPlistStr = shell.exec(`plistutil -i ${config.tmpPath}/ipa/Payload/*.app/Info.plist -f json`);

    this.log.log('====> ipa Info.plist解析内容: ' + infoPlistStr);

    const infoPlist = JSON.parse(infoPlistStr);

    const appName: string = infoPlist.CFBundleDisplayName;
    const appVersion: string = infoPlist.CFBundleShortVersionString;
    const appIdentifier: string = infoPlist.CFBundleIdentifier;

    // todo logo保存到 本地 or oss
    const logoPath = shell.exec(`ls -S ${config.tmpPath}/ipa/Payload/*.app/${infoPlist.CFBundleIcons.CFBundlePrimaryIcon.CFBundleIconName}*.png |head -n 1`).replace('\n', '');
    this.log.log('====> ipa logo path: ' + logoPath);

    const appInfo: AppInfo = {
      fileName,
      appName,
      appSize,
      appVersion,
      appIdentifier,
      logo: logoPath,
    };

    await this.redis.set(`pda:ipa:${fileName}`, appInfo);

    // 清除tmp临时文件

    shell.exec(`rm -rf ${config.tmpPath}/*`);

    return R.success({
      fileName,
      ...appInfo,
    });
  }

  async list() {
    const apps: Array<string> = await this.redis.store.keys('pda:ipa:*');

    const task = async (item: string) => {
      return await this.redis.get(item);
    };

    const res = await Promise.all(_.map(apps, task));

    console.log(res);

    return R.success(res);
  }
}
