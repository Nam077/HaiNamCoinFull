import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Font } from '../../font/entities/font.entity';
import { Response } from '../../response/entities/response.entity';

@Entity({ name: 'messages', synchronize: true, orderBy: { id: 'ASC' } })
export class Message {
    @PrimaryGeneratedColumn({ comment: 'Id of the message' })
    id: number;

    @Column({ type: 'longtext', nullable: false, comment: 'Value of the message' })
    value: string;

    @ManyToMany(() => Font, (font) => font.messages)
    fonts: Font[];

    @ManyToMany(() => Response, (response) => response.messages)
    responses: Response[];

    @CreateDateColumn({ type: 'timestamp', comment: 'Message created at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', comment: 'Message updated at' })
    updatedAt: Date;
}
