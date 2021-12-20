namespace jest {
  interface Matchers<R> {
    toHaveBody(body: Message): R;
  }
}
