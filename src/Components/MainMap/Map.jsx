import React from 'react';
import L from 'leaflet';
import { Map as LeafletMap, GeoJSON, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import bivakzones from '../../bivakzones.json';
import PopupCard from './PopupCard';
import { Link } from 'react-router-dom';
import Filter from '../Header/Filter';
import { Handler } from 'leaflet';
import {Modal} from 'react-bootstrap';
import BivakzoneModal from '../Modal/BivakzoneModal2';
import '../../App.css';
import {ShowModalContext} from '../../utils/Context'
import {Icon} from 'antd'
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import  Controllers from '../../controllers/controllers.js' 

const Leaflet =window.L;


var myIcon = L.icon({
  iconUrl: 'https://image.flaticon.com/icons/svg/1271/1271831.svg',
  iconSize: [45, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [11, -41],
});

class Map extends React.Component {
  //defining state to keep track of the location
  constructor(props) {
    super(props);
    this.state = {
      location: { lat: 51, lng: 5 },
      haveLocationOfUser: false,
      zoom: 3,
      allowance: false,
      showButton: false,
      bivakzones: props.bivakzones,
      showModal:false,
      arrowDirection: false,
      clicks:0,
      bivakzone:null,
      markerPosition: {}
    };
    
  }
  
  // eslint-disable-next-line no-useless-constructor
  
 
 showModalFunc=(modalState)=>{
   this.setState(
     {
     
     showModal: modalState
     }
   )
 }
 
 handleOnClick= (e)=>{
  const prevBivId= this.state.bivakzone;
   
   {((e.sourceTarget.feature === prevBivId  )  ? this.setState({showModal:!this.state.showModal, bivakzone: null}) : this.setState({showModal: false,clicks: this.state.clicks + 1,bivakzone: e.sourceTarget.feature}))}
   
   this.setState({
     ...this.state,
     markerPosition:e.latlng
   })
     
  
  //  this.setState({
  //   bivakzone: e.sourceTarget.feature
  // })
   //  this.context= false;
  
   
  //  this.child.showModal()
  }
  handlArrowClick=()=>{
    this.setState({
      showModal: !this.state.showModal,
      arrowDirection: !this.state.arrowDirection
    })
  }

 handleOnClose= ()=>{
  this.setState({
    ...this.state,
    showModal: !this.state.showModal
  })
 
}




    

      
            
                  
                 
              
             





  componentDidMount() {
    //setting state to get the user's current location from position
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          location: { lat: position.coords.latitude, lng: position.coords.longitude },
          haveLocationOfUser: true, //when it finds the location of the user, then it sets the state' haveLocationOfUser value as true
          zoom: 13,
        });
      },
      () => {
        this.setState({
          location: { lat: 50.85, lng: 4.48 },
          haveLocationOfUser: false, //making it false not to show the marker if user doesn't want his location to be used
          zoom: 10,
          allowance: false,
        });
      },
    );
  }
  showBivakzones = a => {
    this.setState({
      bivakzones: a,
    });
  };

  render() {
    
      const showStyle={
        width:"30%",
        height:"70%",
        background:"white",
        transition:"width 1s ease-in-out",
        overflow:"hidden",
        float:"left",
        zIndex:"1",
        border:"1 solid black",
        boxShadow:"2px 2px  rgba(0,0,0,0.5)",
        display:"block",
        marginLeft:"10px"
       
      }
      const hideStyle={
        width:"0px",
        height:"200px",
        backGround:"blue",
        transition:"width 1s ease-in-out",
        overflow:"hidden",
        float:"left",
        zIndex:"1",
        marginLeft:"10px"
       
      }
        let modal;
        const rightArrow = <Icon  type="right" />;
     const leftArrow =<Icon  type="left" />
    // if (this.state.showModal){
    //     return  
    //     }
        modal= 
       
        <BivakzoneModal  
        style={this.state.showModal ? hideStyle:showStyle}
        // className={this.state.showModal ? "modal_on_click":"modal"}
        modalState={this.showModalFunc}
        handleOpen={this.handleOnClick} 
        onRef={ref => (this.child = ref)}  
        handleClose={this.handleOnClose} 
        bivakzone={this.state.bivakzone}
        showModal={this.state.showModal}
        >

        </BivakzoneModal>

    const position = [this.state.location.lat, this.state.location.lng];
    

     const bounds = Leaflet.latLngBounds([position, this.state.markerPosition]);
    return (
      <>
        {modal}
  
        <button style={{float:"left", zIndex:"1", height:"3rem", color:"blue"}} onClick={this.handlArrowClick} className="exp_btn" >
        {this.state.arrowDirection ? leftArrow:rightArrow}
        </button>
        {/* <Filter style={{position:"static", zIndex:"0"}} callBack={this.showBivakzones}></Filter> */}
       
        <LeafletMap
         
          bounds={bounds}
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
          <ZoomControl position="bottomright"></ZoomControl>
          <TileLayer
            attribution='contributors & Icon made by <a href="https://www.flaticon.com/authors/phatplus" title="phatplus">
            phatplus</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {//Adjusting the marker if browser finds the location of the user to show marker, if not then not to show it
          this.state.haveLocationOfUser ? (
            <Marker position={position} icon={myIcon} className="markerIcon">
              <Popup>You are here</Popup>
            </Marker>
          ) : (
            ''
          )}
          {this.state.bivakzones.map(bivak => {
            if (bivak.geometry.type === 'Polygon') {


              // const firstCoordinate = bivak.geometry.coordinates[0].map(a => a[0]);
              // const x = firstCoordinate.reduce((c, d) => c + d, 0) / firstCoordinate.length;


              // const secondCoordinate = bivak.geometry.coordinates[0].map(a => a[1]);
              // const y = secondCoordinate.reduce((c, d) => c + d, 0) / secondCoordinate.length;
              bivak.geometry.coordinates = Controllers.centroid(bivak.geometry.coordinates);
              bivak.geometry.type = 'Point';
            
              
            }
            return (
              <GeoJSON
                data={bivak}
                style={() => ({
                  color: '#4a83ec',
                  weight: 0.5,
                  fillColor: '#1a1d62',
                  fillOpacity: 1,
                })}
                onMouseOver={e => {
                  e.target.openPopup();
                }}
                onMouseOut={e => {
                  setTimeout(() => {
                    e.target.closePopup();
                  }, 5000);
                }
                }
                onClick ={e => {
                  this.handleOnClick(e)
                }} 
              >
                <Popup>
                  {/* <PopupCard bivakzone={bivakzone} /> */}
              <Link to={`/home/${bivak.id}`}>{bivak.properties.name}{bivak.geometry.type}</Link>
                </Popup>
              </GeoJSON>
            );
          })}
        </LeafletMap>
        
      </>
    )
  }
  }

export default Map;