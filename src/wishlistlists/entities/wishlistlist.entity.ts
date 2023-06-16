import { IsOptional, IsUrl, Length, MaxLength } from 'class-validator';
import { ProfileResponseUserDto } from 'src/users/dto/profile-response-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Base } from 'src/utils/base-entity';
import { PartialWishDto } from 'src/wishes/dto/partial-wish.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity()
export class Wishlistlist extends Base {
  @Column()
  @Length(1, 250)
  name: string;

  @Column({ nullable: true })
  @MaxLength(1500)
  @IsOptional()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: ProfileResponseUserDto;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: PartialWishDto[];
}
