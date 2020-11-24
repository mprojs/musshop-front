import {ICart} from "../../core/store/types/cart.types";

const product1 = {
  "name": "Yamaha Royal Massex",
  "productId": 74,
  "description": "<p>Keyboard musical instrument with percussion (hammer) method of sound production, created specifically for indoor music playing in small rooms. The upright piano is a smaller version of the piano in which the strings, soundboard and mechanical part are arranged vertically instead of horizontally, so the piano takes up much less space than a grand piano.</p>\n",
  "price": "$2,500.00",
  "image": {
    "sourceUrl": "http://musshop-back.local/wp-content/uploads/2020/07/zu-photography-pOist9c0-XM-unsplash-1.jpg",
    __typename: "ImageType"
  },
  __typename: "ProductType"
};

const product2 = {
  "name": "Godin Bass Guitar",
  "productId": 71,
  "description": null,
  "price": "$4,000.00",
  "image": {
    "sourceUrl": "http://musshop-back.local/wp-content/uploads/2020/07/pikrepo-scaled.jpg",
    __typename: "ImageType"
  },
  __typename: "ProductType"
};

const product3 = {
  "name": "YAMAHA BABY GRAND",
  "productId": 69,
  "description": "<p>Black color<br />\nEnclosure type: Cabinet grand piano<br />\nBody Material: Spruce</p>\n",
  "price": "$6,000.00",
  "image": {
    "sourceUrl": "http://musshop-back.local/wp-content/uploads/2020/07/brown-grand-piano-scaled.jpg",
    __typename: "ImageType"
  },
  __typename: "ProductType"
}

const cartObject = {
  "contents": {
    "nodes": [
      {
        "key": "ad61ab143223efbc24c7d2583be69251",
        "product": product1,
        "quantity": 1,
        "subtotal": "$2,500.00",
        "__typename": "CartItem"
      },
      {
        "key": "e2c420d928d4bf8ce0ff2ec19b371514",
        "product": product2,
        "quantity": 1,
        "subtotal": "$4,000.00",
        "__typename": "CartItem"
      },
      {
        "key": "14bfa6bb14875e45bba028a21ed38046",
        "product": product3,
        "quantity": 2,
        "subtotal": "$12,000.00",
        "__typename": "CartItem"
      }
    ],
    "__typename": "CartToCartItemConnection"
  },
  "shippingTotal": "$0.00",
  "discountTotal": "$0.00",
  "subtotal": "$18,500.00",
  "total": "$18,500.00",
  "__typename": "Cart"
}

const getCartResponse = {
  data: {
    "cart": cartObject
  }
}

const addToCartResponse = {
  data: {
    "addToCart": {
      "cart": cartObject,
      __typename: "AddToCartPayload"
    }
  }
}

const cart = {
  "items": [
    {
      "key": "ad61ab143223efbc24c7d2583be69251",
      "product": product1,
      "quantity": 1,
      "subtotal": "$2,500.00",
      __typename: "CartItem"
    },
    {
      "key": "e2c420d928d4bf8ce0ff2ec19b371514",
      "product": product2,
      "quantity": 1,
      "subtotal": "$4,000.00",
      __typename: "CartItem"
    },
    {
      "key": "14bfa6bb14875e45bba028a21ed38046",
      "product": product3,
      "quantity": 2,
      "subtotal": "$12,000.00",
      __typename: "CartItem"
    }
  ],
  "total": "$18,500.00",
  "subtotal": "$18,500.00",
  "discountTotal": "$0.00",
  "shippingTotal": "$0.00"
}

export const TEST_DATA = {
  cart,
  getCartResponse,
  addToCartResponse,
  product1,
  product2,
  product3,
}
