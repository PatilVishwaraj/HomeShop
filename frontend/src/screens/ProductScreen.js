import { Button } from '@mui/material';
import axios from 'axios';
import { React, useContext, useEffect, useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Popup from '../components/Popup';
import Rating from '../components/Rating';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    product: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of stock');
      return;
    }
    ctxDispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
    navigate('/cart');
  };

  return loading ? (
    <Loading></Loading>
  ) : error ? (
    <Popup variant="error">{error}</Popup>
  ) : (
    <div className="row">
      <div className="col-2">
        <img className="small" src={product.image} alt={product.name}></img>
      </div>
      <div className="col-1">
        <ul>
          <li>
            <h1>{product.name}</h1>
          </li>
          <li>
            <Rating
              rating={product.rating}
              numReviews={product.numReviews}
            ></Rating>
          </li>
          <li>Price: ₹{product.price}</li>
          <li>
            Description
            <p>{product.description}</p>
          </li>
        </ul>
      </div>
      <div className="col-1">
        <div className="third-section">
          <ul>
            <li>
              <div className="row">
                <div>Price</div>
                <div className="price">₹{product.price}</div>
              </div>
            </li>
            <li>
              <div className="row">
                <div>Status</div>
                <div className="price">
                  {product.countInStock > 0 ? (
                    <span style={{ color: `green` }}>In stock</span>
                  ) : (
                    <span style={{ color: `red` }}>Unavailable</span>
                  )}
                </div>
              </div>
            </li>
            <li>
              <Button
                onClick={addToCartHandler}
                variant="contained"
                size="small"
              >
                Add to cart
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
