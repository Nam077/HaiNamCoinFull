import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Font } from '../../font/entities/font.entity';
import { Response } from '../../response/entities/response.entity';

@Entity({ name: 'images', synchronize: true, orderBy: { id: 'ASC' } })
export class Image {
    @PrimaryGeneratedColumn({ comment: 'Id of the image' })
    id: number;

    @Column({ type: 'longtext', nullable: false, comment: 'Url of the image' })
    url: string;

    @ManyToMany(() => Font, (font) => font.images)
    fonts: Font[];

    @ManyToMany(() => Response, (response) => response.images)
    responses: Response[];

    @CreateDateColumn({ type: 'timestamp', comment: 'Image created at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', comment: 'Image updated at' })
    updatedAt: Date;
}
