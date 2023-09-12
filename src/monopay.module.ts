import { DynamicModule, Module, Provider } from "@nestjs/common";
import { Driver } from "monopay/dist/driver";
import {
  MonopayModuleAsyncOptions,
  MonopayModuleOptions,
  MonopayOptionsFactory,
} from "./interfaces/monopay-module-options";
import { MONOPAY, MONOPAY_CONFIG } from "./monopay.constants";
import { MonopayService } from "./monopay.service";

@Module({})
export class MonopayModule {
  static forRoot<T extends Driver>({
    config,
    driver,
    isGlobal,
  }: MonopayModuleOptions<T>): DynamicModule {
    return {
      global: !!isGlobal,
      module: MonopayModule,
      providers: [
        { provide: MONOPAY_CONFIG, useValue: config },
        { provide: MONOPAY, useValue: driver },
        MonopayService,
      ],
      exports: [MonopayService],
    };
  }
  static forRootAsync<T extends Driver>(
    options: MonopayModuleAsyncOptions<T>
  ): DynamicModule {
    const { isGlobal, ...monopayOptions } = options;
    const asyncOpts = this.createAsyncProviders(monopayOptions);
    return {
      module: MonopayModule,
      imports: options.imports,
      providers: [MonopayService, ...asyncOpts],
      exports: [MonopayService],
      global: options.isGlobal,
    };
  }

  private static createAsyncProviders<T extends Driver>(
    options: MonopayModuleAsyncOptions<T>
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ];
  }

  private static createAsyncOptionsProvider<T extends Driver>(
    options: MonopayModuleAsyncOptions<T>
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MONOPAY_CONFIG,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: MONOPAY_CONFIG,
      useFactory: async (optionsFactory: MonopayOptionsFactory<T>) =>
        await optionsFactory.createMonopayOptions(),
      inject: [options.useExisting || options.useClass!],
    };
  }
}
