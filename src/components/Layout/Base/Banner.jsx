'use client'
import { useState, useEffect } from "react";
import { Carousel, ConfigProvider } from "antd";

const settings_mobile = {
  dots: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
  initialSlide: 0,
  adaptiveHeight: true,
  arrows: true,
};

const BANNERS = [
  'images/banner_hot_event_1.png',
  'images/banner_hot_event_2.png',
  'images/banner_hot_event_3.png',
];

export default function Banner() {
  const [width, setWidth] = useState();

  useEffect(() => {
    if (window && document) {
      setWidth(document.body.clientWidth);
      window.addEventListener('resize', function (e) {
        setWidth(document.body.clientWidth);
      });
    }
  }, []);

  const settings = {
    dots: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 5000,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
  };
  return (
    <section id="banner">
      <ConfigProvider
        theme={{
          components: {
            Carousel: {
              arrowSize: 40
            }
          }
        }}
      >
        <div className='mx-auto mt-3 lg:px-6'>
          {width && (
            <div className='lg:block hidden'>
              <Carousel {...settings}>
                {BANNERS.map((item, index) => (
                  <div key={index}>
                    <img alt="banner" src={item} className="mx-auto" />
                  </div>
                ))}
              </Carousel>
            </div>
          )}
          <div className='lg:hidden'>
            <Carousel {...settings_mobile}>
              {BANNERS.map((item, index) => (
                <div key={index}>
                  <img alt="banner" src={item} />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </ConfigProvider>

    </section>
  );
}
