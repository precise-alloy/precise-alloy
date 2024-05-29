import { Base, BaseConfigModel } from "./init";

class Start extends Base {
  constructor(config: BaseConfigModel) {
    super(config)
  }

  async run() {
    console.log('run');
  }
}

export default Start;