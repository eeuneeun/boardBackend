import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderMenu } from 'src/order-menu/entities/order-menu.entity';
import { CartMenu } from 'src/cart-menu/entities/cart-menu.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  name: string;

  @Column()
  desc: string;

  @Column()
  imgUrl: string;

  @Column('int')
  price: number;

  @OneToMany(() => OrderMenu, (orderMenu) => orderMenu.menu)
  orderMenus: OrderMenu[];

  @OneToMany(() => CartMenu, (cartMenu) => cartMenu.menu)
  cartMenus: CartMenu[];

  @Column()
  create_at: Date;
}
