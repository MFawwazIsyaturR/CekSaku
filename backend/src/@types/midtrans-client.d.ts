declare module 'midtrans-client' {
  export class CoreApi {
    constructor(options: any);
    transaction: {
      status: (orderId: string) => Promise<any>;
      approve: (orderId: string) => Promise<any>;
      cancel: (orderId: string) => Promise<any>;
      expire: (orderId: string) => Promise<any>;
    };
  }

  export class Snap {
    constructor(options: any);
    createTransaction: (parameter: any) => Promise<any>;
  }

  const midtransClient: {
    CoreApi: typeof CoreApi,
    Snap: typeof Snap
  };

  export default midtransClient;
  export { CoreApi, Snap };
}