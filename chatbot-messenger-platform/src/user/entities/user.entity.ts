import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'users', synchronize: true, orderBy: { id: 'ASC' } })
export class User {
    @PrimaryGeneratedColumn({ comment: 'User id' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, comment: 'User name' })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: false, comment: 'User email' })
    email: string;

    @Column({ type: 'longtext', nullable: false, comment: 'User password' })
    password: string;

    @CreateDateColumn({ type: 'timestamp', comment: 'User created at' })
    createdAt: Date;

    @CreateDateColumn({ type: 'timestamp', comment: 'User updated at' })
    updatedAt: Date;
}
