import clipboardCmds from './clipboard';
import findCmds from './find';
import generalCmds from './general';
import recordScreenCmds from './record-screen';
import touchCmds from './touch';

const commands = {};
Object.assign(
  commands,
  clipboardCmds,
  generalCmds,
  findCmds,
  recordScreenCmds,
  touchCmds,
  // add other command types here
);

export { commands };
export default commands;
