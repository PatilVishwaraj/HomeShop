import { Button } from '@mui/material';
import { React, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Popup from '../components/Popup';
import Rating from '../components/Rating';
import { useDispatch, useSelector } from 'react-redux';
import { createReview, detailsProduct } from '../actions/productActions';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants';

export default function ProductScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const params = useParams();
  const { id: productId } = params;

  const [qty, setQty] = useState(1);
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingReviewCreate,
    error: errorReviewCreate,
    success: successReviewCreate,
  } = productReviewCreate;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (successReviewCreate) {
      window.alert('Review Submitted Successfully');
      setRating('');
      setComment('');
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    }
    dispatch(detailsProduct(productId));
  }, [dispatch, productId, successReviewCreate]);
  const addToCartHandler = () => {
    navigate(`/cart/${productId}?qty=${qty}`);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (comment && rating) {
      dispatch(
        createReview(productId, { rating, comment, name: userInfo.name })
      );
    } else {
      alert('Please enter comment and rating');
    }
  };

  return loading ? (
    <Loading />
  ) : error ? (
    <Popup variant="error">{error}</Popup>
  ) : (
    <div>
      <Link to="/">Back to result</Link>
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
              {product.countInStock > 0 && (
                <>
                  <li>
                    <div className="row">
                      <div>Qty</div>
                      <div>
                        <select
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
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
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div>
        <h2 id="reviews">Reviews</h2>
        {product.reviews.length === 0 && <Popup>There is no review</Popup>}
        <ul>
          {product.reviews.map((review) => (
            <li key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=" "></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </li>
          ))}
          <li>
            {userInfo ? (
              <form className="form" onSubmit={submitHandler}>
                <div>
                  <h2>Write a customer review</h2>
                </div>
                <div>
                  <label htmlFor="rating">Rating</label>
                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="1">1- Poor</option>
                    <option value="2">2- Fair</option>
                    <option value="3">3- Good</option>
                    <option value="4">4- Very good</option>
                    <option value="5">5- Excelent</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="comment">Comment</label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label />
                  <button className="primary" type="submit">
                    Submit
                  </button>
                </div>
                <div>
                  {loadingReviewCreate && <Loading></Loading>}
                  {errorReviewCreate && (
                    <Popup variant="danger">{errorReviewCreate}</Popup>
                  )}
                </div>
              </form>
            ) : (
              <Popup>
                Please <Link to="/signin">Sign In</Link> to write a review
              </Popup>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
