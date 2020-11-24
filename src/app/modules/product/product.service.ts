import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {map} from "rxjs/operators";
import {IProductFull} from "../../shared/types/IProductFull";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private apollo: Apollo
  ) {
  }

  loadProduct(id) {
    const query = gql`
      query loadProduct {
        simpleProduct(productId: ${id}) {
          productId
          name
          averageRating
          description
          galleryImages {
            edges {
              node {
                sourceUrl
              }
            }
          }
          stockStatus
          stockQuantity
          totalSales
          price
          regularPrice
          reviewCount
          reviews {
            edges {
              node {
                id
                author {
                  node {
                    name
                    url
                  }
                }
                content
              }
            }
          }
          image {
            sourceUrl
          }
          productCategories {
            nodes {
              name
              description
              productCategoryId
            }
          }
        }
      }    
    `;

    return this.apollo.watchQuery({query}).valueChanges.pipe(
      // watch('LoadProduct query' + Math.floor(Math.random() * 10000), 99999999),
      map((data: any) => {
        // console.log(`Apollo loadProduct ID:${id}`, data.data.simpleProduct);
        let result = data.data.simpleProduct;
        return result as IProductFull;
      })
    )
  }

  searchProducts(searchQuery: string) {
    const query = gql`
      query SearchProducts {
        products(first: 100, where: {search: "${searchQuery}"}) {
          nodes {
            name
            productId
          }
        }
      }    
    `;
    return this.apollo.watchQuery({query}).valueChanges
      .pipe(
        map((data: any) => {
          console.log(data.data.products.nodes);
          return data.data.products.nodes.map(node => ({
            name: node.name,
            id: node.productId
          }));
        }),
        // delay(2000)
      );
  }
}
