import React from 'react';
import { Card,Input,Button,Rate,DatePicker ,Layout,Affix,List ,Row,Col,Menu, Dropdown, Icon} from 'antd';
import {Navbar,FormGroup} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import {geolocated} from 'react-geolocated';
import {test} from './test';
import './CSS/search.css'



const Searchtext = Input.Search;
const {  Sider } = Layout;

const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

class Search extends React.Component{
   
   constructor(props) {
    super(props);
    this.state = {
        stylist:this.props.location.data,
       maxprice:0 ,
       minprice:0,
       value: 3,
       name:'',
       arr:'',
       data:this.props.location.data,
       top: 10,
       location:{
           lat:'',
           lng:''
       },
       selectedDate:''
      

     
    };
}

disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }
  disabledDateTime() {
    return {
      disabledHours: () => this.range(0, 24).splice(4, 20),
      disabledMinutes: () => this.range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }

  range(start, end) {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }

  disabledRangeTime(_, type) {
    if (type === 'start') {
      return {
        disabledHours: () => this.range(0, 60).splice(4, 20),
        disabledMinutes: () => this.range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return {
      disabledHours: () => this.range(0, 60).splice(20, 4),
      disabledMinutes: () => this.range(0, 31),
      disabledSeconds: () => [55, 56],
    };
  }



getMinValue = (e) => {

    this.setState({
        minprice: e.target.value
    })
    console.log(this.state.minprice)
}

getMaxValue= (e) => {
    
    this.setState({
        maxprice: e.target.value
    })
    console.log(this.state.maxprice)
}

getdate=(value)=>{
    // console.log(value).toLocaleDateString('en-US', DATE_OPTIONS);
      var dateformat=(value._d).toLocaleDateString('en-US', DATE_OPTIONS);
      console.log(dateformat)
     this.setState({
         selectedDate:dateformat
     })
    // this.findAvailableStylist(dateformat);
     // this.setState({selectedDate:})
 
 }

handleChange = (value) => {
    this.setState({ value });
    console.log(value)
  }


findStylistByPrice = (e) => {
    console.log("clicked")
   e.preventDefault();
   const form = {
    maxprice: this.state.maxprice,
    minprice:this.state.minprice
   }
   this.getStylistByPrice(form.minprice,form.maxprice)
   console.log("Maxprice"+form.maxprice,"minPrice"+form.minprice)

}


   componentDidMount(){

    this.initializeComponent()
   }

    initializeComponent() {
     //   this.getStylist();
        if (this.state.stylist === '') {
            console.log("there is no stylist")
            this.getStylist()
        }
        else {
            this.setState({
                stylist:this.props.location.data
            })
        }
        

    }
   getStylist= _=>{
       fetch('http://localhost:8080/stylist')
       .then(response=>
       response.json())
       .then(response=>this.setState({stylist:response.data }))
       .catch(err=>console.error(err))
       
   }

   
    sendLocation() {

        console.log("location", this.props.coords.latitude)
        axios.post('http://localhost:8080/stylist/location', {
            lat: this.props.coords.latitude,
            lng: this.props.coords.longitude
        })
            .then(response=> {
                console.log(response);
                this.setState({ stylist: response.data.data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getStylistByName(name) {

        console.log("abc", name)
        this.setState({ arr: this.state.arr.concat(name) });

        fetch('http://localhost:8080/stylist/searchByName?first_name=' + name)
            .then(response => response.json())
            .then(response => this.setState({ stylist: response.data }))
            .catch(err => console.error(err))

    }
getStylistByPrice(min, max){
    
 fetch('http://localhost:8080/stylist/searchByPrice?pricemin='+min+'&pricemax='+max)
 .then(response=>response.json())
 .then(response=>this.setState({stylist:response.data }))
 .catch(err=>console.error(err))
 
}
findStylistByRating(){
    fetch('http://localhost:8080/stylist/searchByRatings')
    .then(response=>response.json())
    .then(response=>this.setState({stylist:response.data }))
    .catch(err=>console.error(err))
}
sortStylistByPrice(){
    fetch('http://localhost:8080/stylist/sortByPrice')
    .then(response=>response.json())
    .then(response=>this.setState({stylist:response.data }))
    .catch(err=>console.error(err))
}

loadStylistPage(e){
console.log(e);

}


findAvailableStylist(){
    fetch('http://localhost:8080/stylist/getAvailableStylist?bookedDate='+this.state.selectedDate)
    .then(response=>response.json())
    .then(response=>this.setState({stylist:response.data }))
    .catch(err=>console.error(err))

}


render(){
  
         const {stylist}=this.state;
         const {location}=this.state;
   
          
        
    return (
        <div >

            <Layout >
                <Layout>
                    <Sider width={300} style={{ background: '#fff' }}>
                    <Affix offsetTop={this.state.top}>
                      
                        <div id="blog-div" className="blog-div" onClick={() => this.sendLocation()}>
                        <p className="hiddentext">Nearby Stylist</p>
                        <img style={{height:100}} alt="example" src="http://cdn.onlinewebfonts.com/svg/img_339206.png" />
                            {/* <input type="submit" id="nearbyStylist" className="nearbyStylist" onClick={() => this.sendLocation()} value="Find Nearby Stylist" /> */}
                        </div>
                        <div id="blog-div" className="blog-div" onClick={() => this.findStylistByRating()}>
                        <p className="hiddentext">Sort by Rating</p>
                        <img style={{height:100}}  src="http://cdn.onlinewebfonts.com/svg/img_504726.png" />
                            {/* <input type="submit" id="ratingsort" className="ratingsort" onClick={() => this.findStylistByRating()} value="Sort By Ratings" /> */}
                        </div>
                        <div id="blog-div" className="blog-div"  onClick={() => this.sortStylistByPrice()}>
                        <p className="hiddentext">Sort by Charge</p>
                       <img style={{height:100}}  src="http://pngimg.com/uploads/dollar_sign/dollar_sign_PNG12.png" />
                            {/* <input type="submit" id="pricesort" className="pricesort" onClick={() => this.sortStylistByPrice()} value="Sort By Price" /> */}
                        </div>
                                
                        </Affix>        
                    </Sider>


                    <Layout className="layout" style={{backgroundColor:'#d9dddd', padding: '0 24px 24px' }}>
                    <Affix offsetTop={this.state.top}>
            <Navbar className="nav">
            <Row>
                <Col >
                <Navbar.Form pullLeft>
                        <FormGroup>
                        <Searchtext className="search" style={{ width: 480 }} placeholder="Search stylist by Name" onChange={e => this.getStylistByName(e.target.value)} enterButton />
                        </FormGroup>
                        </Navbar.Form>
                </Col>
                <Col >
                        <Navbar.Form pullLeft>
                            <FormGroup>
                                <Row>
                                    <Col> 
                                <Input className="price" style={{ width: 150 }} placeholder="Minimum Price" onChange={e => this.getMinValue(e)} />&nbsp;&nbsp;&nbsp;
                                <Input className="price" style={{ width: 150 }} placeholder="Maximum Price" onChange={e => this.getMaxValue(e)} />
                                <Button type="primary" className="pricebtn" icon="search" onClick={(e) => this.findStylistByPrice(e)} />
                               </Col>
                             
                               </Row>
                                
                            </FormGroup>
                        </Navbar.Form>
                </Col>
                 
                    <Col>
                            <Navbar.Form  >
                                <FormGroup>
                                <DatePicker onChange={this.getdate} format="YYYY-MM-DD" disabledDate={this.disabledDate} style={{ backgroundColor: 'transparent' }}  ref="selectedDate"   />
                                <Button type="primary" className="pricebtn" icon="search" onClick={() => this.findAvailableStylist()} /> 
                                </FormGroup>
                            </Navbar.Form>
                    
                    </Col>
            </Row>
        
              
                
               
            </Navbar>
            </Affix>
           
    
        

            <List   grid={{ gutter: 16, column: 4 }} dataSource={stylist}
                renderItem={item => (
                    <Link key={item.idstylist} to={{ pathname: "/stylistDtails", data: item.idstylist, charge: item.price }}>
                        <List.Item  >
                            <Card className="animated pulse" id="card" style={{width:300,height:380}} hoverable   >
                            <Row>
                                
                                <Col>
                                     <img style={{width:200,height:250}} alt="example" src="https://pngimage.net/wp-content/uploads/2018/05/avatar-profile-png-2.png" />
                                </Col>
                                <Col>
                               <b> <label className="name" >{item.first_name+" "+item.last_name}</label></b>
                              
                               <i><label className="pricetag" >{item.price} Rs per slot</label></i>
                               
                                <span style={{color:"#009999"}}>
                                  <b className="rating">{Math.round(item.rating*10)/10}</b>  <Rate disabled style={{color:"#009999"}} value={item.rating} />
                                    {item.rating && <span className="ant-rate-text"></span>}
                                </span>
                                </Col>
                            </Row>
                       
                               
                            </Card>
                        </List.Item>
                    </Link>
                )}
            />



                    </Layout>
                </Layout>
            </Layout>

            
             
        </div>
    )
    }
  
}

export default geolocated({ positionOptions: {enableHighAccuracy: false,},userDecisionTimeout: 5000,})(Search)