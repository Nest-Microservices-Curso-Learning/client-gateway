import { Controller,Query, Delete,Body, Get, Inject, Param, Patch, Post, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PRODUCT_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { firstValueFrom } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(@Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy) {
    
  }

  @Post()
  createProduct(@Body() createProductDto : CreateProductDto) {

    return this.productsClient.send({cmd:'create_product'},createProductDto)

  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({cmd: 'find_all_products'}, paginationDto);
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: number) {

    try {
      const product = await firstValueFrom(
        this.productsClient.send({cmd: 'find_one_product'}, {id})
      );

      return product;
    } catch (error) {
      throw new RpcException(error);
    }

  }

  @Delete(':id')
  async deleteProduct(@Param('id',ParseIntPipe) id: number) {

    try
    {

      const productDeleted =  await firstValueFrom(
        this.productsClient.send({cmd:'delete_product'},{id})
      );

      return productDeleted;
      
    }
    catch(error)
    {
      throw new RpcException(error);
    }

  }

  @Patch(':id')
  async patchProduct(@Param('id', ParseIntPipe) id:number, @Body() updateProductDto: UpdateProductDto) {


    try{
      const productUpdated = await firstValueFrom(
          this.productsClient.send({
              cmd:'update_product'
            },
            {
              id,
              ...updateProductDto
            }
          )
      );

      return productUpdated;
    }
    catch(error)
    {
      throw new RpcException(error);
    }

  }

}
