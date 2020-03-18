import log from '../logger';

let commands = {};

commands.performActions = async function (actions) {  
  const enhancedActions = updateButtonValues(actions);
  return await this.winAppDriver.sendCommand('/actions', 'POST', {enhancedActions});
};

function updateButtonValues (actions) {
	let enhancedActions = actions;
	for (var i = 0; i < enhancedActions.length; ++i) {
		for (var j = 0; j < enhancedActions[i].actions.length; ++j) {
			if ((enhancedActions[i].actions[j].type === 'pointerDown') || (enhancedActions[i].actions[j].type === 'pointerUp')) {
				enhancedActions[i].actions[j].button = 0;
	}}}
  return enhancedActions;
}

Object.assign(commands);
export default commands;
