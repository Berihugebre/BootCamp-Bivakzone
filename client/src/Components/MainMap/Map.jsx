import React from "react";
import L from "leaflet";
import {
  GeoJSON,
  Map as LeafletMap,
  Marker,
  Popup,
  TileLayer,
  ZoomControl
} from "react-leaflet";
import Control from "react-leaflet-control";
import { Link } from "react-router-dom";
import BivakZoneModal from "../Modal/BivakZoneModal";
import "../../App.css";
import "./Map.css";
import { Icon } from "antd";
import Controllers from "../../controllers/controllers.js";
import BivakzoneModalMobile from "../Modal/BivakZoneModalMobile";
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const Leaflet = window.L;
let markerdefault = L.icon({
  iconUrl: "Icons/costum-marker.png",
  shadowUrl: iconShadow,
  iconSize: [24, 30],
  iconAnchor: [12, 30]
});
L.Marker.prototype.options.icon = markerdefault;

const myIcon = L.icon({
  iconUrl: "https://image.flaticon.com/icons/svg/1271/1271831.svg",
  iconSize: [45, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [11, -41]
});

class Map extends React.Component {
  constructor(props) {
    super(props);
    //defining state to keep track of the location
    this.state = {
      location: { lat: 51, lng: 5 },
      haveLocationOfUser: false,
      zoom: 3,
      allowance: false,
      showLocation: false,
      showButton: false,
      bivakzones: props.bivakzones,
      showModal: false,
      bivakzone: null,
      markerPosition: {}
    };
  }

  // eslint-disable-next-line no-useless-constructor

  showModalFunc = modalState => {
    this.setState({
      showModal: modalState
    });
  };

  handleOnClick = e => {
    
    if (e.sourceTarget.feature === this.state.bivakzone) {
      this.setState({
        showModal: false,
        filter: true,
        bivakzone: null
      });
    } else {
      this.props.setShowFilter(false);
      this.setState({
        filter: false,
        clicked: true,
        showModal: true,
        bivakzone: e.sourceTarget.feature,
        location: {
          lat: e.sourceTarget.feature.geometry.coordinates[1],
          lng: e.sourceTarget.feature.geometry.coordinates[0]
        },
        zoom: 9
      });
    }

    this.setState({
      ...this.state,
      markerPosition: e.latlng
    });
  };

  handleArrowClick = () => {
    this.setState(
      {
        showModal: !this.state.showModal,
        arrowDirection: !this.state.arrowDirection
      }
    );
  };

  handleOnClose = () => {
    this.setState({
      ...this.state,
      showModal: false
    });
  };

  currentLocation = () => {
    return navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          haveLocationOfUser: true, //when it finds the location of the user, then it sets the state' haveLocationOfUser value as true
          zoom: 11
        });
      },
      () => {
        this.setState({
          location: { lat: 50.85, lng: 4.48 },
          haveLocationOfUser: false, //making it false not to show the marker if user doesn't want his location to be used
          zoom: 10,
          allowance: false
        });
      }
    );
  };

  componentDidMount() {
    if (!this.state.showLocation) {
      this.setState({
        location: { lat: 50.6, lng: 4.41 },
        haveLocationOfUser: false, //making it false not to show the marker if user doesn't want his location to be used
        zoom: 10,
        allowance: false
      });
    }
  }

  updateBivakZones = bivakzones => {
    this.setState({
      bivakzones
    });
  };

  render() {

    if (this.props.showFilter) {
      // to show filter ad search when we click the search button on header:
      if (!this.state.filter) {
        this.showFilterOnMenuClick();
      }
    } else if (this.props.showFilter === false) {
      if (this.state.filter)
        this.setState({
          filter: false
        });
    }

    const showStyle = {};

    const hideStyle = {
      width: "0",
      transform: "translateX(-30vw)"
    };

    let modal;
    const rightArrow = <Icon type="right" />;
    const leftArrow = <Icon type="left" />;
    modal = (
      <BivakZoneModal
        style={this.state.showModal ? showStyle : hideStyle}
        modalState={this.showModalFunc}
        handleOpen={this.handleOnClick}
        onRef={ref => (this.child = ref)}
        handleClose={this.handleOnClose}
        bivakzone={this.state.bivakzone}
        showModal={this.state.showModal}
        onFilterChangeCallback={this.updateBivakZones}
      />
    );

    let btn_2= this.state.showModal ? "sidepanel_btn_2_clicked" : "sidepanel_btn_2_unclicked"
    const position = [this.state.location.lat, this.state.location.lng];
    const bounds = Leaflet.latLngBounds([position, this.state.markerPosition]);
    return (
      <>
        <LeafletMap
          //bounds={bounds}
          className="leaflet-container"
          center={position}
          zoom={this.state.zoom}
          maxZoom={19}
          attributionControl={true}
          zoomControl={false}
          doubleClickZoom={true}
          scrollWheelZoom={true}
          dragging={true}
          animate={true}
          easeLinearity={0.35}
        >
          <ZoomControl
            position={
              window.visualViewport.height < 700 ? "topright" : "bottomright"
            }
          ></ZoomControl>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & Icons made by <a href="https://www.flaticon.com/authors/phatplus" title="phatplus">
            phatplus</a>, <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> flaticon.com</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {//Adjusting the location marker if browser finds the location of the user to show marker, if not then not to show it
          this.state.haveLocationOfUser ? (
            <Marker position={position} icon={myIcon} className="markerIcon">
              <Popup>You are here</Popup>
            </Marker>
          ) : (
            ""
          )}
          {this.state.bivakzones.map(bivak => {
            if (bivak.geometry.type === "Polygon") {
              bivak.geometry.coordinates = Controllers.centroid(
                bivak.geometry.coordinates
              );
              bivak.geometry.type = "Point";
            }
            return (
              <GeoJSON
                data={bivak}
                style={() => ({
                  color: "#4a83ec",
                  weight: 0.5,
                  fillColor: "#1a1d62",
                  fillOpacity: 1
                })}
                onMouseOver={e => {
                  e.target.openPopup();
                }}
                onMouseOut={e => {
                  setTimeout(() => {
                    e.target.closePopup();
                  }, 5000);
                }}
                onClick={e => {
                  this.handleOnClick(e);
                }}
                icon={markerdefault}
              >
                <Popup>
                  {/* <PopupCard bivakzone={bivakzone} /> */}
                  {bivak.properties.name}
                  {bivak.geometry.type}
                </Popup>
              </GeoJSON>
            );
          })}
          <Control key={this.state.showLocation}  position={
              window.visualViewport.height < 700 ? "topright" : "bottomright"
            }>
            {/* Control is used to control a component's position on map */}

            <button
              className="location-button"
              onClick={() => {
                this.setState({ showLocation: true });
                this.currentLocation();
              }}
            >

            <img
              onClick={() => {
                this.setState({ showLocation: true });
                this.currentLocation();
              }}
              src={"/Icons/location.png"}
              alt="Location button"
              width="30px"
              height="30px"
              className="currentLocationIcon"
              data-toggle="tooltip"
              title="detect my current location"
            />
            {/* {this.state.showModal ? styleForCurrentLocationItem : null} */}
            </button>
          </Control>
          <section className={"sidepanel"}>
            {modal}
            <button
              onClick={this.handleArrowClick}
              className={
                this.state.showModal
                  ? "sidepanel_btn_clicked"
                  : "sidepanel_btn_unclicked"
              }
            >
              {this.state.showModal ? leftArrow : rightArrow}
            </button>
            <BivakzoneModalMobile
              className={
                this.state.showModal
                  ? "bivak_modal_mobile_show"
                  : "bivak_modal_mobile_hide"
              }
              modalState={this.showModalFunc}
              handleOpen={this.handleOnClick}
              onRef={ref => (this.child = ref)}
              handleClose={this.handleOnClose}
              bivakzone={this.state.bivakzone}
            />
            <button
              onClick={this.handleArrowClick}
              className= {"sidepanel_btn_2" +" "+ btn_2 }
            >
              {this.state.showModal ? leftArrow : rightArrow}
            </button>
          </section>
          {/* <Filter style={{position:"static", zIndex:"0"}} callBack={this.showBivakzones}></Filter> */}
        </LeafletMap>
      </>
    );
  }
}

export default Map;
