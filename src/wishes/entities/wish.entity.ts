import { IsNumber, IsPositive, IsUrl, Length } from 'class-validator';
import { Column, Entity, OneToMany, ManyToOne, ManyToMany } from 'typeorm';

import { Base } from '../../utils/base-entity';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlistlists/entities/wishlist.entity';

@Entity()
export class Wish extends Base {

  @Column()
  @Length(1, 200)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsPositive()
  price: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  raised: number;

  @Column({ default: 0 })
  @IsPositive()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist[];
}
