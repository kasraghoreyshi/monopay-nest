# NestJS Monopay wrapper

A [NestJS](https://github.com/nestjs/nest) wrapper for [monopay](https://github.com/alitnk/monopay).

## Installation

```shell
npm install monopay-nest monopay
```

```shell
yarn add monopay-nest monopay
```

## Usage

Register the module:

```ts
import { Zarinpal } from 'monopay';
import { MonopayModule } from 'monopay-nest';

@Module({
  imports: [
    MonopayModule.forRoot<Zarinpal>({
      isGlobal: true,
      config: { merchantId: 'zarinpal-merchant' },
      driver: 'zarinpal',
    }),
    // ...
  ],
})
export class AppModule {}
```

If you're using Javascript, omit the typing after `forRoot`

Now inject the service:

```ts
import { Zarinpal } from 'monopay';
import { MonopayService } from 'monopay-nest';

@Controller()
export class SomeController {
  constructor(private readonly monopayService: MonopayService<Zarinpal>) {}

  @Get('/')
  someEndpoint() {
    this.monopayService.requestPayment({
      amount: 50000,
      callbackUrl: 'https://my-site.com/callback',
      description: 'Description about the transaction',
    });
  }
}
```
