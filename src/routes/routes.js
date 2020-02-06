import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    withRouter
  } from "react-router-dom";
import { render } from '@testing-library/react';
import Map from '../Map';
import BivakzoneModal from '../Components/BivakzoneModal'
import Bivakzones from '../bivakzones.json'
import MainContainer from '../MainContainer'



  class Routers extends Component{
    previousLocation = this.props.location;
    
    
    
    componentWillUpdate(nextProps) {
        const { location } = this.props;
        
    }

        render(){
            return(
               
                   <Router>
                <Switch>
                  <Route exact path={["/", "/home"]} component= {Map}/>
                  <Route path={["/home/node/:bivakzoneId","/home/way/:bivakzoneId" ]} exact component = {BivakzoneModal} />
                  
                </Switch>
              </Router>
            
               
            )
        }
  }

  export default Routers;