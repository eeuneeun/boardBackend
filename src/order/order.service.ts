import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Menu } from 'src/menu/entities/menu.entity';
import { OrderMenu } from 'src/order-menu/entities/order-menu.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Menu)
    private menuRepo: Repository<Menu>,
    @InjectRepository(OrderMenu)
    private orderMenuRepo: Repository<OrderMenu>,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order | null> {
    const order = this.orderRepo.create({
      customerId: dto.customerId,
      createdAt: dto.createdAt,
    });
    await this.orderRepo.save(order);

    const orderMenus: OrderMenu[] = [];

    for (const item of dto.orderMenus) {
      const menu = await this.menuRepo.findOne({ where: { id: item.id } });
      if (!menu) throw new NotFoundException(`Menu ${item.id} not found`);

      const orderMenu = this.orderMenuRepo.create({
        order,
        menu,
        quantity: item.quantity,
        totalPrice: menu.price * item.quantity,
      });

      orderMenus.push(orderMenu);
    }

    await this.orderMenuRepo.save(orderMenus);

    return this.orderRepo.findOne({
      where: { id: order.id },
      relations: ['orderMenus', 'orderMenus.menu'],
    });
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: ['orderMenus', 'orderMenus.menu'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['orderMenus', 'orderMenus.menu'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action removes a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
