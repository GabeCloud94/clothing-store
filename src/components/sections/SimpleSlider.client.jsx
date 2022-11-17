import Slider from '@ant-design/react-slick';
import {ProductCard} from '~/components';

export function SimpleSlider({products}) {
  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <>
      <h1 className="px-6 md:px-8 lg:px-12 py-6 md:py-8 lg:py-12 text-lead font-bold max-w-prose whitespace-pre-wrap">
        Featured Products
      </h1>
      <Slider {...settings} className="mr-12">
        {products.map((product) => (
          <div key={product.id} className="pl-4">
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </>
  );
}
