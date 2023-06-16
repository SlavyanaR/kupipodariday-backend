import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Base } from 'src/utils/base-entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlistlist } from 'src/wishlistlists/entities/wishlistlist.entity';
import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { GROUP_USER } from '../../utils/constants';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User extends Base {
  @Column()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsOptional()
  @IsUrl()
  avatar: string;

  @Column()
  @Expose({ groups: [GROUP_USER] })
  @IsEmail()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlistlist, (list) => list.owner)
  wishlists: Wishlistlist[];
}
