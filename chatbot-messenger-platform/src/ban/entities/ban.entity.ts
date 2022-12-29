import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'bans', synchronize: true, orderBy: { id: 'ASC' } })
export class Ban {
    //id, name, reason, date, senderPsid
    @PrimaryGeneratedColumn({ comment: 'Id of the ban' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, comment: 'Name of the ban' })
    name: string;

    @Column({ type: 'mediumtext', nullable: false, comment: 'Reason of the ban' })
    reason: string;

    @Column({ type: 'varchar', length: 255, nullable: false, comment: 'SenderPsid of the ban' })
    senderPsid: string;

    @CreateDateColumn({ type: 'timestamp', nullable: false, comment: 'Date of the ban' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: false, comment: 'Date of the ban' })
    updatedAt: Date;
}
