import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { OrderStatus } from '../enum/order.enum';
import { OrderStatusList } from '../enum/order.enum';

export class OrderPaginationDto extends PaginationDto {

    @IsOptional()
    @IsEnum(OrderStatus,{
        message: `Status must be one of the following values: ${OrderStatusList}`,
    })
    status: OrderStatus; 
}