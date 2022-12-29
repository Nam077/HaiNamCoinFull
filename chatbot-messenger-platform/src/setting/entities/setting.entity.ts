import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'settings', synchronize: true, orderBy: { id: 'ASC' } })
export class Setting {
    @PrimaryGeneratedColumn({ comment: 'Id of the setting' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Name of the setting' })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Value of the setting' })
    value: string;

    @CreateDateColumn({ type: 'timestamp', comment: 'Setting created at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', comment: 'Setting updated at' })
    updatedAt: Date;
}
