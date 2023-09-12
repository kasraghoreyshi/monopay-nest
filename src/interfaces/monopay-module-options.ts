import { ModuleMetadata, Type } from '@nestjs/common';
import { DriverName } from 'monopay';
import { Driver } from 'monopay/dist/driver';

export interface MonopayModuleOptions<T extends Driver> {
  isGlobal?: boolean;
  config: Parameters<T['setConfig']>[0];
  driver: DriverName;
}

export type AsyncMonopayModuleOptions<T extends Driver> = Omit<T, 'isGlobal'>;

export interface MonopayOptionsFactory<T extends Driver> {
  createMonopayOptions():
    | Promise<AsyncMonopayModuleOptions<T>>
    | AsyncMonopayModuleOptions<T>;
}

export interface MonopayModuleAsyncOptions<T extends Driver>
  extends Pick<ModuleMetadata, 'imports'> {
  isGlobal?: boolean;
  useExisting?: Type<MonopayOptionsFactory<T>>;
  useClass?: Type<MonopayOptionsFactory<T>>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AsyncMonopayModuleOptions<T>> | AsyncMonopayModuleOptions<T>;
  inject?: any[];
}
