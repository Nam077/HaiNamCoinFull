import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'foods', synchronize: true, orderBy: { id: 'ASC' } })
export class Food {
    @PrimaryGeneratedColumn({ comment: 'Id of the food' })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false, comment: 'Name of the food' })
    name: string;

    @Column({ type: 'longtext', nullable: false, comment: 'Description of the food' })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: false, comment: 'Image of the food' })
    image: string;

    @Column({ type: 'longtext', nullable: false, comment: 'Recipe of the food' })
    recipe: string;

    @CreateDateColumn({ type: 'timestamp', comment: 'Food created at' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', comment: 'Food updated at' })
    updatedAt: Date;
}
