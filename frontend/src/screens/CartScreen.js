import React, { useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Popup from '../components/Popup';
import { Link, useNavigate } from 'react-router-dom';
import { Button, ButtonGroup } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';

export default function CartScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { id: productId } = params;

  const { search } = useLocation();
  const qtyInUrl = new URLSearchParams(search).get('qty');
  const qty = qtyInUrl ? Number(qtyInUrl) : 1;

  const cart = useSelector((state) => state.cart);
  const { cartItems, error } = cart;
  const dispatch = useDispatch();
  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeItemHandeler = (id) => {
    // delete action
    dispatch(removeFromCart(id));
  };

  const checkoutHandeler = () => {
    navigate('/signin?redirect=/shipping');
  };

  return (
    <div>
      <title>Shopping Cart</title>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {error && <Popup variant="danger">{error}</Popup>}
          {cartItems.length === 0 ? (
            <Popup variant="error">
              Cart is empty <Link to="/">Go Shopping</Link>
            </Popup>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <div>
                      <select
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/*  */}
                    <Col md={3}>
                      <ButtonGroup
                        disableElevation
                        variant="contained"
                        aria-label="outlined primary button group"
                      >
                        <Button
                          onClick={() =>
                            addToCart(item.product, item.quantity - 1)
                          }
                          variant="outlined"
                          disabled={item.quantity === 1}
                        >
                          <RemoveCircleOutlineIcon />
                        </Button>
                        <Button variant="outlined">{item.quantity}</Button>
                        <Button
                          onClick={() =>
                            addToCart(item.product, item.quantity + 1)
                          }
                          variant="outlined"
                          disabled={item.quantity === item.countInStock}
                        >
                          <AddCircleOutlineIcon />
                        </Button>
                      </ButtonGroup>
                    </Col>
                    {/*  */}
                    <Col md={3}>₹{item.price}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandeler(item)}
                        variant="outlined"
                      >
                        <DeleteOutlineIcon />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : ₹
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      onClick={checkoutHandeler}
                      variant="contained"
                      disabled={cartItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
