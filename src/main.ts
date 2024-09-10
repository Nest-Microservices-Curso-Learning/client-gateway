import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExcepcionFilter } from './common';

async function bootstrap() {
  const logger =  new Logger('Main-Gateway');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true,
        forbidNonWhitelisted: true,
      }
    )
  );
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new RpcCustomExcepcionFilter());
  await app.listen(envs.port);
  logger.log(`Gateway is running on PORT ${envs.port} 🚪`);
}
bootstrap();
