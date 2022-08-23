import Slider from '@ant-design/react-slick';
import {ProductCard} from '~/components';

export function SimpleSlider({products}) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <h1 className="px-6 md:px-8 lg:px-12 py-6 md:py-8 lg:py-12 text-lead font-bold max-w-prose whitespace-pre-wrap">
        Featured Products
      </h1>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} className="px-4" />
          </div>
        ))}
      </Slider>
    </>
  );
}
