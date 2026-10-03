import { Body, Controller, Get, Post, UsePipes, Param, Patch, Delete, BadRequestException, Query } from '@nestjs/common';
import { ConcertsService } from './concerts.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createConcertSchema, UpdateConcertSchema } from './concerts.schema';
import type { CreateConcertDto, UpdateConcertDto } from './concerts.schema';
import { ParseIntPipe } from '@nestjs/common'; // Handling for invalid Id

@Controller('concerts')
export class ConcertsController {
    constructor(private readonly concertsService: ConcertsService) { }

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


    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.concertsService.findOne(id);
    }

    @Post()
    create(@Body(new ZodValidationPipe(createConcertSchema)) dto: CreateConcertDto) {
        return this.concertsService.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(UpdateConcertSchema)) dto: UpdateConcertDto,
    ) {
        return this.concertsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.concertsService.remove(id);
    }

}