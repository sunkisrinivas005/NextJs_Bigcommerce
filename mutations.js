import gql from "graphql-tag";

export const GET_SCRIPTS_TAG = gql`
  query {
    scriptTags(first: 5) {
      edges {
        node {
          id
          src
          displayScope
        }
      }
    }
  }
`;

export const DELETE_SCRIPT_TAG = gql`
  mutation scriptTagDelete($id: ID!) {
    scriptTagDelete(id: $id) {
      deletedScriptTagId
      userErrors {
        field
        message
      }
    }
  }
`;

export const CREATE_SCRIPT_TAG = gql`
  mutation scriptTagCreate($input: ScriptTagInput!) {
    scriptTagCreate(input: $input) {
      scriptTag {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const GET_ORDER_DETAILS = gql`
  query {
    orders(first: 25) {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          id
          test
          name
          currentTotalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          processedAt
          transactions(first: 25) {
            id
            kind
            status
          }
        }
        cursor
      }
    }
  }
`;

// export const GET_ORDER_AMOUNT = gql`{
//     order(id: "gid://shopify/Order/order-id"){
//     currentTotalPriceSet{
//     shopMoney{
//     amount
//     }
//     }
//     lineItems (first: 10) {
//     edges {
//     node {
//     id
//     title
//     originalTotalSet {
//     shopMoney {
//     amount currencyCode
//     }
//     }
//     }
//     }
//     }
//     }
//     }`
