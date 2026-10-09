import { Body, Controller, Get, Post, UsePipes, Param, Patch, Delete, BadRequestException, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createConcertSchema, UpdateConcertSchema } from './concerts.schema';
import type { CreateConcertDto, UpdateConcertDto } from './concerts.schema';
import { ParseIntPipe } from '@nestjs/common'; // Handling for invalid Id
import { FileInterceptor } from '@nestjs/platform-express';
import { R2Service } from '../media/r2.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('concerts')
export class ConcertsController {
    constructor(
        private readonly concertsService: ConcertsService,
        private readonly r2Service: R2Service,

    ) { }

    @Get()
    findAll() {
        return this.concertsService.findAll();
    }

    @Get('search')
    search(@Query('artist') artist: string) {
        if (!artist) {
            throw new BadRequestException('Query param "artist" is required');
        }
        return this.concertsService.search(artist);
    }


    @Get('photos')
    displayAllPhotos() {
        return this.concertsService.displayAllPhotos();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.concertsService.findOne(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    create(@Body(new ZodValidationPipe(createConcertSchema)) dto: CreateConcertDto) {
        return this.concertsService.create(dto);
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(UpdateConcertSchema)) dto: UpdateConcertDto,
    ) {
        return this.concertsService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.concertsService.remove(id);
    }

    //// Photos API

    @Post(':id/photos')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadPhoto(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const { key, url } = await this.r2Service.upload(file);
        return this.concertsService.addPhoto(id, key, url);
    }


    @Get('photos/:id')
    getPhotos(@Param('id', ParseIntPipe) id: number) {
        return this.concertsService.getPhotos(id);
    }

    @Delete('photos/:photoId')
    @UseGuards(AuthGuard)
    removePhoto(@Param('photoId', ParseIntPipe) photoId: number) {
        return this.concertsService.removePhoto(photoId);
    }
}