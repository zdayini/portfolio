import { Inject, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DRIZZLE } from '../db/db.module';
import type { DrizzleDB } from '../db/db.module'; import { concerts } from '../db/schema';
import { desc, asc, eq, ilike } from 'drizzle-orm';
import { CreateConcertDto } from './concerts.schema';
import type { UpdateConcertDto } from './concerts.schema';


@Injectable()
export class ConcertsService {
    constructor(@Inject(DRIZZLE) private db: DrizzleDB) { }

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

}