import {Suspense, useMemo} from 'react';
import {gql, useShopQuery, useLocalization} from '@shopify/hydrogen';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/fragments';
import {SimpleSlider} from '~/components';

const mockProducts = new Array(12).fill('');

export function ProductSwimlane({data = mockProducts, count = 12}) {
  const productCardsMarkup = useMemo(() => {
    // If the data is already provided, there's no need to query it, so we'll just return the data
    if (typeof data === 'object') {
      return (
        <Suspense>
          <SimpleSlider products={data} />
        </Suspense>
      );
    }

    // If the data provided is a productId, we will query the productRecommendations API.
    // To make sure we have enough products for the swimlane, we'll combine the results with our top selling products.
    if (typeof data === 'string') {
      return (
        <Suspense>
          <RecommendedProducts productId={data} count={count} />
        </Suspense>
      );
    }

    // If no data is provided, we'll go and query the top products
    return <TopProducts count={count} />;
  }, [count, data]);

  return (
    <div className="w-[93%] md:w-[95%] lg:w-[97%] pb-2">
      {productCardsMarkup}
    </div>
  );
}

// function ProductCards({products}) {
//   return (
//     <>
//       {products.map((product) => (
//         <ProductCard
//           product={product}
//           key={product.id}
//           className={
//             'snap-start w-80 hover:scale-105 ease-in-out duration-300 cursor-pointer'
//           }
//         />
//       ))}
//     </>
//   );
// }

function RecommendedProducts({productId, count}) {
  const {
    language: {isoCode: languageCode},
    country: {isoCode: countryCode},
  } = useLocalization();

  const {data: products} = useShopQuery({
    query: RECOMMENDED_PRODUCTS_QUERY,
    variables: {
      count,
      productId,
      languageCode,
      countryCode,
    },
  });

  const mergedProducts = products.recommended
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts
    .map((item) => item.id)
    .indexOf(productId);

  mergedProducts.splice(originalProduct, 1);

  return <SimpleSlider products={mergedProducts} />;
}

function TopProducts({count}) {
  const {
    data: {products},
  } = useShopQuery({
    query: TOP_PRODUCTS_QUERY,
    variables: {
      count,
    },
  });

  return <SimpleSlider products={products.nodes} />;
}

const RECOMMENDED_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query productRecommendations(
    $productId: ID!
    $count: Int
    $countryCode: CountryCode
    $languageCode: LanguageCode
  ) @inContext(country: $countryCode, language: $languageCode) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

const TOP_PRODUCTS_QUERY = gql`
  ${PRODUCT_CARD_FRAGMENT}
  query topProducts(
    $count: Int
    $countryCode: CountryCode
    $languageCode: LanguageCode
  ) @inContext(country: $countryCode, language: $languageCode) {
    products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
`;
