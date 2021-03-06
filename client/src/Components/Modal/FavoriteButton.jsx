import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import "./BivakZoneModal.css"

const FavoriteButton = ({ bivakzone }) => {
  let defaultArr = [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: '',
        coordinates: [[]],
      },
      id: '',
    },
  ];
  let style= {
    color: "gray",
  }
  if (JSON.parse(localStorage.getItem('favourites')) === null) {
    localStorage.setItem('favourites', JSON.stringify(defaultArr));
  }

  const initialValue = () => JSON.parse(localStorage.getItem('favourites'));
  console.log(initialValue());
  const [store, setStore] = useState(initialValue || defaultArr);

  let exist;
  if (store.length > 1) {
    exist = store.find(fav => fav.id === bivakzone.id);
  }

  useEffect(() => {
    //

    localStorage.setItem('favourites', JSON.stringify(store));
  }, [store]);
  const handleClick = () => {
    if (typeof localStorage.getItem('favourites')) {
      //If there are favourites
      const storage = JSON.parse(localStorage['favourites']);
      const existed = storage.find(fav => fav.id === bivakzone.id);
      if (existed) {
         style= {
          
          color: "gold"
        }
        const toRemove = storage.indexOf(existed);
        storage.splice(toRemove, 1);
        localStorage.setItem('favourites', JSON.stringify(storage));
        setStore(storage);
      } else {
        storage.push(bivakzone);
        console.log('new bivakzone');
        localStorage.setItem('favourites', JSON.stringify(storage));
        setStore(storage);
      }
    } else {
      //No favourites in local storage, so add new
      const favArray = [];
      favArray.push(bivakzone);
      localStorage.setItem('favourites', JSON.stringify(favArray));
      console.log('favorite created and added');
    }
  };

  const handleFav = () => {
    localStorage.setItem('favourites', JSON.stringify(defaultArr));
    setStore(JSON.parse(localStorage.getItem('favourites')));
  };

  return (
    <>
      <i><img className={exist? "star-clicked": "star" } onClick={handleClick} src="/Icons/star_gold.png"></img></i>
      {/* <Button onClick={handleFav}>Remove favorite</Button> */}
    </>
  );
};
export default FavoriteButton;
