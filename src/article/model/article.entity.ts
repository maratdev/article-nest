import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/model/user.entity';

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 150,
    nullable: false,
  })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ nullable: false })
  publicationDate: Date;

  @ManyToOne(() => UserEntity, (author) => author.articles)
  author: UserEntity;
}
