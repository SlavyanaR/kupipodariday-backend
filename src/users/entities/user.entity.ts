import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, IsUrl, Length, MaxLength } from 'class-validator';
import { Offer } from '../../offers/entities/offer.entity';
import { Base } from '../../utils/base-entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlistlists/entities/wishlist.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { GROUP_USER } from '../../utils/constants';

@Entity()
export class User extends Base {
  @Column({ unique: true })
  @IsString()
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

  @Column({ unique: true })
  @Expose({ groups: [GROUP_USER] })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Exclude()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
