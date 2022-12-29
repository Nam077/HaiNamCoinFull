import {
    AfterInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Key } from '../../key/entities/key.entity';
import { Message } from '../../message/entities/message.entity';
import { Link } from '../../link/entities/link.entity';
import { Image } from '../../image/entities/image.entity';
import { Tag } from '../../tag/entities/tag.entity';

@Entity({ name: 'fonts', synchronize: true, orderBy: { id: 'ASC' } })
export class Font {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    urlPost: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    slug: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    description: string;

    @OneToMany(() => Key, (key) => key.font, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idFont', referencedColumnName: 'id' })
    keys: Key[];

    @ManyToMany(() => Message, (message) => message.fonts, { onDelete: 'CASCADE', cascade: true })
    @JoinTable({
        name: 'font_messages',
        joinColumn: { name: 'idFont', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'idMessage', referencedColumnName: 'id' },
    })
    messages: Message[];

    @ManyToMany(() => Link, (link) => link.fonts, { onDelete: 'CASCADE', cascade: true })
    @JoinTable({
        name: 'font_links',
        joinColumn: { name: 'idFont', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'idLink', referencedColumnName: 'id' },
    })
    links: Link[];

    @ManyToMany(() => Image, (image) => image.fonts, { onDelete: 'CASCADE', cascade: true })
    @JoinTable({
        name: 'font_images',
        joinColumn: { name: 'idFont', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'idImage', referencedColumnName: 'id' },
    })
    images: Image[];

    @ManyToMany(() => Tag, (tag) => tag.fonts, { onDelete: 'CASCADE', cascade: true })
    @JoinTable({
        name: 'font_tags',
        joinColumn: { name: 'idFont', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'idTag', referencedColumnName: 'id' },
    })
    tags: Tag[];

    @CreateDateColumn({ type: 'timestamp', comment: 'Font created at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', comment: 'Font updated at' })
    updatedAt: Date;
}
