import { React, useEffect } from 'react';
import Prodcard from '../components/Prodcard';
import Loading from '../components/Loading';
import Popup from '../components/Popup';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts({}));
  }, [dispatch]);

  return (
    <div>
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
