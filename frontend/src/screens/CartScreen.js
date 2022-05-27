import React, { useContext } from 'react';
import { Store } from '../Store';
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
import axios from 'axios';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandeler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of stock');
      return;
    }
    ctxDispatch({ type: 'ADD_TO_CART', payload: { ...item, quantity } });
  };
  const removeItemHandeler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
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
          {cartItems.length === 0 ? (
            <Popup variant="error">
              Cart is empty <Link to="/">Go Shopping</Link>
            </Popup>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <ButtonGroup
                        disableElevation
                        variant="contained"
                        aria-label="outlined primary button group"
                      >
                        <Button
                          onClick={() =>
                            updateCartHandeler(item, item.quantity - 1)
                          }
                          variant="outlined"
                          disabled={item.quantity === 1}
                        >
                          <RemoveCircleOutlineIcon></RemoveCircleOutlineIcon>
                        </Button>
                        <Button variant="outlined">{item.quantity}</Button>
                        <Button
                          onClick={() =>
                            updateCartHandeler(item, item.quantity + 1)
                          }
                          variant="outlined"
                          disabled={item.quantity === item.countInStock}
                        >
                          <AddCircleOutlineIcon></AddCircleOutlineIcon>
                        </Button>
                      </ButtonGroup>
                    </Col>
                    <Col md={3}>₹{item.price}</Col>
                    <Col md={2}>
                      <Button
                        onClick={() => removeItemHandeler(item)}
                        variant="outlined"
                      >
                        <DeleteOutlineIcon></DeleteOutlineIcon>
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
