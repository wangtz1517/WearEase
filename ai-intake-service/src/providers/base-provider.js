export class BaseProvider {
  constructor(name) {
    this.name = name;
  }

  async process() {
    throw new Error("Provider must implement process(jobContext).");
  }
}
