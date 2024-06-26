export class BussinessException extends Error {

    public statusCode: number;
  
    constructor(statusCode: number, message: string) {
      super(message);
      this.statusCode = statusCode;
      Object.setPrototypeOf(this, BussinessException.prototype);
    }
  }
  