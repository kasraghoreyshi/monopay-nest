import { Inject, Injectable } from '@nestjs/common';
import { getPaymentDriver } from 'monopay';
import { Driver } from 'monopay/dist/driver';
import { MONOPAY_CONFIG } from './monopay.constants';
@Injectable()
export class MonopayService<T extends Driver> {
  private readonly driver: Driver;

  constructor(
    @Inject(MONOPAY_CONFIG)
    private readonly config: Parameters<T['setConfig']>[0],
  ) {
    this.driver = getPaymentDriver<T>('zarinpal', this.config);
  }

  async requestPayment(options: Parameters<T['requestPayment']>[0]) {
    return this.driver.requestPayment(options);
  }

  setConfig(options: Parameters<T['setConfig']>[0]) {
    return this.driver.setConfig(options);
  }

  async verifyPayment(
    options: Parameters<T['verifyPayment']>[0],
    params: Parameters<T['verifyPayment']>[1],
  ) {
    return this.driver.verifyPayment(options, params);
  }
}
