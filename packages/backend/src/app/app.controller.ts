import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { FileDto } from './dto/file.dto';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/upload')
  async upload(@Body() param: FileDto) {
    return this.appService.handleUpload(param);
  }
}
