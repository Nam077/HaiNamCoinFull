import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'list_fonts', synchronize: true, orderBy: { id: 'ASC' } })
export class ListFont {
    @PrimaryGeneratedColumn({ comment: 'Id of the list font' })
    id: number;

    @Column({ type: 'longtext', nullable: true, comment: 'Name of the list font' })
    value: string;
}
