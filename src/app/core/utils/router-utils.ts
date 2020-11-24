export const applyFilterToQueryParams = (router, filter) => {
  // console.log(123123123, filter);
  // try {
  //   throw new Error('WHO???? call me');
  // } catch (e) {
  //   console.error(e);
  // }
  router.navigate([], {
    queryParams: filter,
    queryParamsHandling: 'merge'
  });
}
