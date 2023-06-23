import { User } from '../../users/entities/user.entity';
import { Base } from '../../utils/base-entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsBoolean, IsPositive } from 'class-validator';

@Entity()
export class Offer extends Base {
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish; 

  @Column('decimal', { precision: 10, scale: 2 })
  @IsPositive()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;
}
