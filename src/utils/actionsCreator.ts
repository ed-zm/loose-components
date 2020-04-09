export default (actionsForm, dispatch) => {
  const actions: any = {};
  Object.keys(actionsForm).forEach(action => {
    actions[action] = actionsForm[action](dispatch);
  });
  return actions;
};
