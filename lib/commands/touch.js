const commands = {};

commands.performActions = async function (actions) {  
  return await this.winAppDriver.sendCommand('/actions', 'POST', {actions});};

Object.assign(commands);
export default commands;
