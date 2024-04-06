export interface Converter<Base, Converted> {
  prepare(props: any): Promise<void>;
  convert(base: Base, props: any | undefined): Promise<Converted>; // should check wether Converted was prepared
}

export abstract class BaseConverter {
  protected prepared: boolean;
  protected logging: boolean;

  constructor(logging: boolean) {
    this.prepared = false;
    this.logging = logging;
  }

  protected checkIfPrepared() {
    if (!this.prepared) {
      throw new Error(
        "Converter instance not prepared. Call prepare before using the instance."
      );
    }
  }
}
