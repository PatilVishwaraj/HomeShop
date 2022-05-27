import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Rating from './Rating';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import { useContext } from 'react';
import axios from 'axios';

export default function Prodcard(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandeler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, Product is out of stock');
      return;
    }
    ctxDispatch({ type: 'ADD_TO_CART', payload: { ...item, quantity } });
  };
  return (
    <Card sx={{ maxWidth: 345, marginBottom: `1rem` }}>
      <Link to={`/product/${product.slug}`}>
        <CardMedia component="img" height="400" image={product.image} />
      </Link>
      <CardContent>
        <Link
          style={{ color: `black`, textDecoration: `none` }}
          to={`/product/${product.slug}`}
        >
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
        </Link>
        <Typography variant="body2" color="success">
          <span style={{ fontWeight: 600, color: `black` }}>Discription: </span>{' '}
          {product.description}
        </Typography>
        <Rating
          rating={product.rating}
          numReviews={product.numReviews}
        ></Rating>
      </CardContent>
      <CardActions
        sx={{ display: 'flex', justifyContent: `space-between`, marginTop: -3 }}
      >
        <Typography sx={{ size: `medium`, color: `black`, marginLeft: 1.3 }}>
          ₹ {product.price}
        </Typography>
        {product.countInStock === 0 ? (
          <Button disabled={true}>Out of stock</Button>
        ) : (
          <Button
            onClick={() => addToCartHandeler(product)}
            variant="contained"
            size="small"
          >
            Add to cart
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
