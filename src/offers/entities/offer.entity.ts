import { User } from 'src/users/entities/user.entity';
import { Base } from 'src/utils/base-entity';
import { ColumnTransformer } from 'src/utils/column-transformer';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsBoolean, IsPositive } from 'class-validator';

@Entity()
export class Offer extends Base {
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: new ColumnTransformer(),
  })
  @IsPositive()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  user: User;
}
