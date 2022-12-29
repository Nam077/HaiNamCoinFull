import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Font } from '../../font/entities/font.entity';

@Entity({ name: 'links', synchronize: true, orderBy: { id: 'ASC' } })
export class Link {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'tinytext', nullable: false })
    url: string;

    @ManyToMany(() => Font, (font) => font.links)
    fonts: Font[];

    @CreateDateColumn({ type: 'timestamp', comment: 'Link created at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', comment: 'Link updated at' })
    updatedAt: Date;
}
