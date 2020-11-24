import {Injectable} from '@angular/core';
import {map} from "rxjs/operators";
import gql from 'graphql-tag';
import {Apollo} from "apollo-angular";
import {ILoadProductsFilters} from "./store/reducers/shop.types";

@Injectable()
export class ShopService {

  constructor(
    private apollo: Apollo
  ) {
  }

  loadProducts(payload: ILoadProductsFilters, currentFilters: ILoadProductsFilters) {
    return this.apollo.watchQuery({
      query: this.buildLoadProductsQuery(payload, currentFilters)
    }).valueChanges.pipe(map((data: any) => {
      // console.log(data);
      let products = data.data.products.edges.map(item => {
        let product = item.node;
        let instrumentType = null, promoStatus = null;
        product.productCategories.nodes.forEach(cat => {
          if (cat.description === 'instrumentType') {
            instrumentType = cat.name;
          } else if (cat.description === 'promoStatus') {
            promoStatus = cat.name;
          }
        });
        return product;
      });
      return {
        products,
        pageInfo: data.data.products.pageInfo
      }
    }));
  }

  buildLoadProductsQuery(payload: ILoadProductsFilters, currentFilters: ILoadProductsFilters) {
    // console.log(payload.count);
    let mixedFilters = {
      ...currentFilters,
      ...payload
    }
    // console.log(mixedFilters);
    let count = mixedFilters.count || 12;
    let beforeAfter = 'after: ""';
    let firstLast = `first: ${count},`;
    if (mixedFilters.before) {
      beforeAfter = 'before: "' + mixedFilters.before + '",';
      firstLast = `last: ${count},`;
    }
    if (mixedFilters.after) {
      beforeAfter = 'after: "' + mixedFilters.after + '",';
      firstLast = `first: ${count},`;
    }

    let where = '{';
    if (mixedFilters.categories && mixedFilters.categories[0]) {
      where += `, categoryIdIn: [${mixedFilters.categories.map(cat => `${cat}`).join(',')}]`;
    }
    if (mixedFilters.maxPrice) {
      where += `, maxPrice: ${mixedFilters.maxPrice}`;
    }
    if (mixedFilters.minPrice) {
      where += `, minPrice: ${mixedFilters.minPrice}`;
    }
    if (mixedFilters.onlyInStock) {
      where += `, stockStatus:IN_STOCK`;
    }
    if (mixedFilters.orderby) {
      where += `, orderby: {field: ${mixedFilters.orderby.toUpperCase()}, order: ASC}`;
      // current graphql api does not work correctly with cursor pagination
      // if query has orderby sorting
      // so as a temporary solution we will load all (or just 500 products)
      // and aviod pagination in such cases
      beforeAfter = 'after: "';
      firstLast = 'first: 500';
    }
    where += '}';

    return gql`
      query LoadProducts {
        products(
          ${beforeAfter}
          ${firstLast}
          where: ${where}
          ) {
          edges {
            cursor
            node {
              id
              productId
              name
              image {
                sourceUrl
              }
              productCategories {
                nodes {
                  name
                  description
                }
              }
              ... on SimpleProduct {
                price
                regularPrice
              }
            }
          }
          pageInfo {
            endCursor
            startCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
      `
  }

  loadProductCategories() {
    const query = gql`
      {
        productCategories(where: {descriptionLike:"instrumentType"}) {
          nodes {
            name
            databaseId
          }
        }
      }    
    `;
    return this.apollo.watchQuery({query}).valueChanges
      .pipe(map((data: any) => {
        return data.data.productCategories.nodes.map(cat => ({
          name: cat.name,
          id: cat.databaseId
        }));
      }));
  }
}
