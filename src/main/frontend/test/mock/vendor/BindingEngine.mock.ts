export class BindingEngineMock {
  collectionObserver() {
    return {
      subscribe: () => {
        /* Nothing to do here */
      },
    };
  }
}
