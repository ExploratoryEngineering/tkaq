import { bootstrap } from "aurelia-bootstrapper";
import { ComponentTester, StageComponent } from "aurelia-testing";

class ComponentCreator {
  resources: string[];

  constructor(resources: string[] = []) {
    this.resources = resources;
  }

  createComponent = async (markup: string, vm: object = {}): Promise<ComponentTester> => {
    const component = StageComponent.withResources(this.resources)
      .inView(markup)
      .boundTo(vm);
    await component.create(bootstrap);
    return component;
  };
}

const delay = async function(ms: number) {
  const promise = new Promise((res) => {
    setTimeout(() => res(), ms);
  });
  return promise;
};

export { ComponentCreator, delay };
