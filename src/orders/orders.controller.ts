import { Controller, Get, Post,Patch, Body, Query, Param, Inject, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { ORDER_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto, StatusDto } from './dto';
import { firstValueFrom } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto);
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    
    try{
      console.log('id', id);
      const order = await firstValueFrom(
        this.ordersClient.send('findOneOrder', { id })
      );

      return order;
    }catch(error)
    {
      throw new RpcException(error);
    }
    
  }

  @Get(':status')
  async findOneByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    
    try{

      return this.ordersClient.send('findAllOrders', { status: statusDto.status, ...paginationDto });

    }catch(error)
    {
      throw new RpcException(error);
    }

  }


  @Patch(':id')
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  )
  {

    try
    {
      const orderUpdated = await firstValueFrom(
        this.ordersClient.send('changeOrderStatus', { id, status: statusDto.status })
      );
  
      return orderUpdated;

    }
    catch(error)
    {
      throw new RpcException(error);
    }

  }

}
