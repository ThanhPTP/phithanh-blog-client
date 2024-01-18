export default (initialState: API.UserInfo) => {
  // Documentation: https://umijs.org/docs/max/access
  const canSeeAdmin = !!(
    initialState && initialState.name !== 'dontHaveAccess'
  );
  return {
    canSeeAdmin,
  };
};
