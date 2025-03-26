export class Env {
  static get IS_TEST() {
    return process.env.NODE_ENV === 'test';
  }

  static get IS_DEV() {
    return process.env.NODE_ENV === 'development';
  }

  static get IS_PROD() {
    return process.env.NODE_ENV === 'production';
  }
}