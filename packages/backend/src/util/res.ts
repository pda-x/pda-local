export class R {
  code: number;
  msg: string;
  data?: any;

  constructor(code: number, msg: string, data?: any) {
    this.code = code;
    this.msg = msg;
    this.data = data;
  }

  static success(data?: any) {
    if (data) {
      return new R(200, 'success', data);
    }

    return new R(200, 'success');
  }

  static fail(code: number, msg: string) {
    return new R(code, msg);
  }
}
