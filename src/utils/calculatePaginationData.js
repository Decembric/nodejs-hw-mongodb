export const calculatePaginationData = (totalItems, perPage, page) => {
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    totalItems,
    perPage,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
