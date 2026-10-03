import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/db.module'; import { concerts } from '../db/schema';
import { desc, asc, eq, ilike } from 'drizzle-orm';
import { CreateConcertDto } from './concerts.schema';
import type { UpdateConcertDto } from './concerts.schema';
import { concertPhotos } from '../db/schema';
import { R2Service } from '../media/r2.service';

@Injectable()
export class ConcertsService {
    constructor(
        @Inject(DRIZZLE) private db: DrizzleDB,
        private r2Service: R2Service,
    ) { }

    findAll() {
        return this.db
            .select()
            .from(concerts)
            .where(eq(concerts.is_public, true))
            .orderBy(asc(concerts.date));
    }

    async create(dto: CreateConcertDto) {
        try {
            const [row] = await this.db.insert(concerts).values(dto).returning();
            return row;
        } catch (err: any) {
            if (err.cause?.code === '23505') {
                throw new ConflictException(`You've already logged ${dto.artist} on ${dto.date}`);
            }
            throw err;
        }
    }

    async findOne(id: number) {
        const [row] = await this.db.select().from(concerts).where(eq(concerts.id, id));
        if (!row) throw new NotFoundException(`Concert ${id} not found`);
        return row;
    }

    async search(artist: string) {
        return this.db
            .select()
            .from(concerts)
            .where(ilike(concerts.artist, `%${artist}`))
            .orderBy(asc(concerts.date));
    }

    async update(id: number, dto: UpdateConcertDto) {
        const [updated] = await this.db
            .update(concerts)
            .set(dto)
            .where(eq(concerts.id, id))
            .returning();

        if (!updated) throw new NotFoundException(`Concert ${id} not found`);
        return updated;
    }

    async remove(id: number) {
        const [deleted] = await this.db
            .delete(concerts)
            .where(eq(concerts.id, id))
            .returning();

        if (!deleted) throw new NotFoundException(`Concert ${id} not found`);
        return deleted;
    }

    async addPhoto(concert_id: number, key: string, url: string) {
        await this.findOne(concert_id);
        const [photo] = await this.db
            .insert(concertPhotos)
            .values({ concert_id, key, url })
            .returning();
        return photo;
    }

    async getPhotos(concert_id: number) {
        return this.db
            .select()
            .from(concertPhotos)
            .where(eq(concertPhotos.concert_id, concert_id))
            .orderBy(asc(concertPhotos.sort_order));
    }

    async removePhoto(photo_id: number) {
        const [deleted] = await this.db
            .delete(concertPhotos)
            .where(eq(concertPhotos.id, photo_id))
            .returning();
        if (!deleted) throw new NotFoundException(`Photo ${photo_id} not found`);

        await this.r2Service.delete(deleted.key);
        return deleted;
    }

    async displayAllPhotos() {
        return this.db
            .select()
            .from(concertPhotos)
            .where(eq(concertPhotos.is_public, true))
            .orderBy(asc(concertPhotos.concert_id), asc(concertPhotos.sort_order));
    }

}