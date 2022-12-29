import {
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
import { Message } from '../../message/entities/message.entity';
import { Key } from '../../key/entities/key.entity';
import { Image } from '../../image/entities/image.entity';

@Entity({ name: 'responses', synchronize: true, orderBy: { id: 'ASC' } })
export class Response {
    @PrimaryGeneratedColumn({ comment: 'Id of the response' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, comment: 'Name of the response' })
    name: string;

    @ManyToMany(() => Message, (message) => message.responses)
    @JoinTable({
        name: 'responses_messages',
        joinColumn: { name: 'idResponse', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'idMessage', referencedColumnName: 'id' },
    })
    messages: Message[];

    @OneToMany(() => Key, (key) => key.response)
    keys: Key[];

    @ManyToMany(() => Image, (image) => image.responses)
    @JoinTable({
        name: 'responses_images',
        joinColumn: { name: 'idResponse', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'idImage', referencedColumnName: 'id' },
    })
    images: Image[];

    @CreateDateColumn({ type: 'timestamp', comment: 'Response created at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', comment: 'Response updated at' })
    updatedAt: Date;
}
