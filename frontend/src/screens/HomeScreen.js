import { React, useEffect, useReducer } from 'react';
import Prodcard from '../components/Prodcard';
import axios from 'axios';
import Loading from '../components/Loading';
import Popup from '../components/Popup';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HomeScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="row center">
        {loading ? (
          <Loading></Loading>
        ) : error ? (
          <Popup variant="error">{error}</Popup>
        ) : (
          products.map((product) => (
            <Prodcard key={product.slug} product={product}></Prodcard>
          ))
        )}
      </div>
    </div>
  );
}
