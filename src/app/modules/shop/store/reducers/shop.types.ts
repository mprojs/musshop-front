


export interface IProductCategory {
  id: number;
  name: string;
}

export interface IProductsPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalProducts: number;
  startCursor: string;
  endCursor: string;
}

export interface ILoadProductsFilters {
  categories?: Array<number>;
  before?: string;
  after?: string;
  maxPrice?: number;
  minPrice?: number;
  onlyInStock?: boolean;
  count?: number;
  orderby?: string;
}

export interface ISearchProductResult {
  name: string,
  id: number
}
