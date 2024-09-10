import { IsEnum, IsString } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";





export class StatusDto{

    @IsString()
    @IsEnum(OrderStatusList,{
        message: `Status must be one of the following values: ${OrderStatusList}`,
    })
    status: OrderStatus;
}