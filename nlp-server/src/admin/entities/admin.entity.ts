import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'admins', synchronize: true, orderBy: { id: 'ASC' } })
export class Admin {
    @PrimaryGeneratedColumn({ comment: 'Id of the admin' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Name of the admin' })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true, comment: 'SenderPsid of the admin' })
    senderPsid: string;

    @CreateDateColumn({ type: 'timestamp', comment: 'Admin created at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', comment: 'Admin updated at' })
    updatedAt: Date;
}
