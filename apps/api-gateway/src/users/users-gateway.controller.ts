import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { MSG, UserRole } from '@healio/shared-types';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('patients')
export class UsersGatewayController {
  constructor(
    @Inject('PATIENT_SERVICE') private patientClient: ClientProxy,
    private cloudinary: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req: { user: { userId: string } }) {
    return firstValueFrom(
      this.patientClient.send(MSG.PATIENT_GET, { userId: req.user.userId }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateProfile(
    @Request() req: { user: { userId: string } },
    @Body() updates: Record<string, unknown>,
  ) {
    return firstValueFrom(
      this.patientClient.send(MSG.PATIENT_UPDATE, {
        userId: req.user.userId,
        updates,
      }),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  @Post(':patientId/reports')
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }),
  )
  async uploadReport(
    @Param('patientId') patientId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file provided');

    const { url, filename } = await this.cloudinary.uploadBuffer(
      file.buffer,
      file.originalname,
    );

    return firstValueFrom(
      this.patientClient.send(MSG.PATIENT_UPLOAD_REPORT, {
        userId: patientId,
        report: { filename, originalName: file.originalname, url },
      }),
    );
  }
}
