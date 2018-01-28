const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

global.storyOf = function(name, props, impl) {
  describe(name, () => impl && impl(props));
}