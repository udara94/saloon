import React from 'react';
import {  Row,Col,Card,} from 'antd';
import './CSS/signup.css'




class SignUp extends React.Component{
   
   constructor(props) {
    super(props);
    this.state = {
   
    };
}







   componentDidMount(){
   
   
   }
  

goToAddStylistPage(){
  this.props.history.push({pathname:'addStylist'});
}
goToAddSaloonPage(){
  this.props.history.push({pathname:'addSaloon'});
}




render(){
  
  
        
    return (
        <div className="body" >
            
            <div style={{padding: '300px' }}>
     <Row gutter={8}>
       <Col span={12}>
         <Card id="blog-card" className="animated pulse" onClick={()=>{this.goToAddStylistPage()}} bordered={true}><h1 className="cardheader">Join as Stylist/Educator</h1></Card>
       </Col>
       <Col span={12}>
         <Card  id="blog-card" className="animated pulse" onClick={()=>{this.goToAddSaloonPage()}} bordered={true}><h1 className="cardheader">Join as Saloon Owner</h1></Card>
       </Col>
     </Row>
   </div>
    
        

         
        </div>
    )
    }
  
}

export default SignUp