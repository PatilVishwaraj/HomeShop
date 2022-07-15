import { React, useEffect } from 'react';
import Prodcard from '../components/Prodcard';
import Loading from '../components/Loading';
import Popup from '../components/Popup';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
// import { listTopSellers } from '../actions/userActions';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const userTopSellersList = useSelector((state) => state.userTopSellersList);
  const {
    loading: loadingSellers,
    error: errorSellers,
    users: sellers,
  } = userTopSellersList;

  useEffect(() => {
    dispatch(listProducts({}));
    // dispatch(listTopSellers());
  }, [dispatch]);

  return (
    <div>
      <h2>Top Sellers</h2>
      {loadingSellers ? (
        <Loading></Loading>
      ) : errorSellers ? (
        <Popup variant="danger">{errorSellers}</Popup>
      ) : (
        <>
          {sellers.length === 0 && <Popup>No Seller Found</Popup>}
          <Carousel showArrows autoPlay showThumbs={false}>
            {sellers.map((seller) => (
              <div key={seller._id}>
                <Link to={`/seller/${seller._id}`}>
                  <img src={seller.seller.logo} alt={seller.seller.name} />
                  <p className="legend">{seller.seller.name}</p>
                </Link>
              </div>
            ))}
          </Carousel>
        </>
      )}
      <h2>Featured Products</h2>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <Popup variant="danger">{error}</Popup>
      ) : (
        <>
          {products.length === 0 && <Popup>No Product Found</Popup>}
          <div className="row center">
            {products.map((product) => (
              <Prodcard key={product._id} product={product}></Prodcard>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
