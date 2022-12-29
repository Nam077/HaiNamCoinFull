import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Font } from '../../font/entities/font.entity';
import { Response } from '../../response/entities/response.entity';

@Entity({ name: 'keys', synchronize: true, orderBy: { id: 'ASC' } })
export class Key {
    @PrimaryGeneratedColumn({ comment: 'Id of the key' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, comment: 'Name of the key' })
    name: string;

    @Column({ type: 'longtext', nullable: false, comment: 'Value of the key' })
    value: string;

    @ManyToOne(() => Font, (font) => font.keys, { nullable: true, onDelete: 'CASCADE', cascade: true })
    @JoinColumn({ name: 'idFont' })
    font: Font;

    @ManyToOne(() => Response, (response) => response.keys, { nullable: true, onDelete: 'CASCADE', cascade: true })
    @JoinColumn({ name: 'idResponse' })
    response: Response;

    @CreateDateColumn({ type: 'timestamp', comment: 'Key created at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', comment: 'Key updated at' })
    updatedAt: Date;
}
