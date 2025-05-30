import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import productsFromServer from '../../api/products.json';
import './ProductCard.scss';
import { Link, useLocation } from 'react-router-dom';

import phonesFromServer from '../../api/phones.json';
import tabletsFromServer from '../../api/tablets.json';
import accessoriesFromServer from '../../api/accessories.json';
import { Product } from '../../types/Propduct';
import classNames from 'classnames';
import { useBasket, useFavorites } from '../../utils/Stores';

type Props = {
  id: number;
};

export const ProductCard: React.FC<Props> = ({ id }) => {
  const findProduct = (idForProduct: number) =>
    productsFromServer.find(product => product.id === idForProduct) ||
    productsFromServer[0];

  const {
    image,
    name,
    price,
    fullPrice,
    screen,
    capacity,
    ram,
    itemId,
    category,
  } = findProduct(id);

  const { pathname } = useLocation();

  const favorites: Product[] = useFavorites(state => state.favorites);
  const addFavorite = useFavorites(state => state.addFavorite);
  const removeFavorite = useFavorites(state => state.removeFavorite);

  const basketStore = useBasket(state => state.basket);
  const addToBasket = useBasket(state => state.addToBasket);
  const removeFromBasket = useBasket(state => state.removeFromBasket);

  let checkedName = name;
  let nameDots = false;

  if (name.length > 25) {
    checkedName = name.slice(0, 25);
    nameDots = true;
  }

  let checkedScreen = screen;
  let screenDots = false;

  if (screen.length > 12) {
    checkedScreen = screen.slice(0, 12);
    screenDots = true;
  }

  const findProductById = () => {
    switch (category) {
      case 'phones':
        return (
          phonesFromServer.find(phone => phone.id === itemId) ||
          phonesFromServer[0]
        );

      case 'tablets':
        return (
          tabletsFromServer.find(tablet => tablet.id === itemId) ||
          tabletsFromServer[0]
        );

      case 'accessories':
        return (
          accessoriesFromServer.find(access => access.id === itemId) ||
          accessoriesFromServer[0]
        );

      default:
        return phonesFromServer[0];
    }
  };

  const handleSetFavoriteArr = () => {
    if (favorites.find((product: Product) => product.itemId === itemId)) {
      removeFavorite(itemId);
    } else {
      return addFavorite(findProduct(id));
    }
  };

  const handleSetBasketStore = () => {
    if (basketStore.find((product: Product) => product.itemId === itemId)) {
      removeFromBasket(itemId);
    } else {
      return addToBasket(findProduct(id));
    }
  };

  return (
    <article className="product-card">
      <Link
        to={`/${category}/product/${findProductById().namespaceId}?color=${findProductById().color}&capacity=${findProductById().capacity}`}
        className="product-link"
        onClick={() => window.scrollTo({ top: 0 })}
      >
        <img src={image} alt="product photo" className="product-card__image" />

        <h4 className="product-card__title">
          {checkedName}
          {nameDots ? '...' : ''}
        </h4>
      </Link>
      <p className="product-card__price">${price}</p>
      <p className="product-card__full-price">${fullPrice}</p>
      <div className="product-card__line" />
      <div className="product-card__options-box">
        <div className="product-card__options">
          <h5 className="product-card__options-title">Screen</h5>
          <p className="product-card__options-value">
            {checkedScreen}
            {screenDots ? '...' : ''}
          </p>
        </div>
        <div className="product-card__options">
          <h5 className="product-card__options-title">Capacity</h5>
          <p className="product-card__options-value">{capacity}</p>
        </div>
        <div className="product-card__options">
          <h5 className="product-card__options-title">RAM</h5>
          <p className="product-card__options-value">{ram}</p>
        </div>
      </div>
      <div className="product-card__buttons-box">
        <button
          className={classNames('product-card__buy-button', {
            'product-card__buy-button--catalog': pathname === `/${category}`,
            'product-card__buy-button--favorites': pathname === '/favorites',
            'product-card__buy-button--added': basketStore.find(
              product => product.itemId === itemId,
            ),
          })}
          onClick={handleSetBasketStore}
        >
          {basketStore.find(product => product.itemId === itemId)
            ? 'Added to cart'
            : 'Add to cart'}
        </button>
        <button
          className="product-card__favorite-button"
          onClick={handleSetFavoriteArr}
        >
          {favorites.find(product => product.itemId === itemId) ? (
            <img src="./img/heart-icon-active.svg" alt="favorite active" />
          ) : (
            <img src="./img/heart-icon.svg" alt="favorite" />
          )}
        </button>
      </div>
    </article>
  );
};
