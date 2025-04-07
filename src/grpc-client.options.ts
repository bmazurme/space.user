import { ReflectionService } from '@grpc/reflection';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:50051',
    package: 'user', // ['hero', 'hero2']
    // protoPath: join(__dirname, '../../proto/user/user.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
    protoPath: join(__dirname, './users/user.proto'), // ['./hero/hero.proto', './hero/hero2.proto']
    onLoadPackageDefinition: (pkg, server) => {
      new ReflectionService(pkg).addToServer(server);
    },
  },
};
