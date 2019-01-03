
import React from 'react';
import Navbarclass from '../components/Nav'
import Body from '../components/Body';
import Footer from '../components/Footer';

const CustomLayout=(props)=>{
    return(
      <div>
        <Navbarclass></Navbarclass>
        <Body></Body>
        <Footer></Footer>
        
      </div>
    
    )
    
}

export default CustomLayout;