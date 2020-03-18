import log from '../logger';

let commands = {}, extensions = {};

commands.performActions = async function (actions) {
  log.debug(`Received the following W3C actions: ${JSON.stringify(actions, null, '  ')}`);
  
  const preprocessedActions = actions
    .map((action) => Object.assign({}, action, action.type === 'pointer' ? {
      parameters: {
        pointerType: 'mouse'
      }
    } : {}));
	
	const buttonEnhancedPreprocessedActions = updateButtonValue(actions);
	
  log.debug(`Preprocessed actions: ${JSON.stringify(buttonEnhancedPreprocessedActions, null, '  ')}`);
  return await this.winAppDriver.sendCommand('/actions', 'POST', {actions});
};

//Required as WinAppDriver seems to require payload to include 'button' attribute in order to accept click action
function updateButtonValue (actions) {
	let enhancedActions = actions;
	for (var i = 0; i < enhancedActions.length; ++i) {
		for (var j = 0; j < enhancedActions[i].actions.length; ++j) {
			if ((enhancedActions[i].actions[j].type === 'pointerDown') || (enhancedActions[i].actions[j].type === 'pointerUp')) {
				enhancedActions[i].actions[j].button = 0;
	}}}
    return enhancedActions;
}


Object.assign(extensions, commands);
export default extensions;
