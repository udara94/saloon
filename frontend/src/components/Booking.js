import React from 'react';
import { Row,Card,Radio, Col,Input,Button,Form } from 'antd';
import { Link } from 'react-router-dom';
import './CSS/booking.css';

//const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const width = window.innerWidth ;
const height = window.innerHeight;

class Booking extends React.Component {

    constructor(props) {
        super(props)
        this.state = {    
          stateojc:this.props.location.data,
          single:this.props.location.stylist,
          radio:1,
          payment:{
            saloonID:'',
            stylistID:2,
            bookedDate:'2018-9-25',
            slot:0,
            charge:90,
            paymentDate:'2018-3-2'
          },
          user: {
            id:'',
            type: '',
            password:'',
            email:''
        }

          
        }
        this.submitPayment=this.submitPayment.bind(this);
        this.updateState=this.updateState.bind(this);
      
                
    }

    chooseSlot(e){
      console.log('slot value',e.target.value)

    }
    RadioOnChange = (e) => {
      console.log('radio checked', e.target.value);
      this.setState({
        radio: e.target.value,
      });
    }

    componentDidMount() {
     
      this.initializeComponent();
 
    }

    
    initializeComponent(){
      const user = JSON.parse(localStorage.getItem('user'));
      if (user === null) {
          this.setState({
              user: null
          })
      }
      else {

          this.setState({
              user: {
                  id: user.id,
                  type: user.type,
                  password: user.password,
                  email: user.email
              }
          })

         
      }
  }

  submitPayment() {
    const { user } = this.state;
    const { stateojc } = this.state

    fetch('http://localhost:8080/stylist/addPayment?saloonOwnerID=' + user.id + '&stylistID=' + stateojc.id + '&bookedDate=' + stateojc.date + '&slot=' + stateojc.slot + '&price=' + stateojc.charge)
      .then(response => response.json())
      .catch(err => console.error(err))

  }

  updateState = (e) => {
    // const {slot}=this.state.payment;
    console.log("state updated")
    this.setState({
      payment: {
        slot: e.target.value
      }
    })

  }

    renderStylist=({idstylist,last_name,first_name,email,date,slot,phone})=>
   
    <div key={idstylist}  >
      <Form >
        <FormItem label="Stylist Name">
          <Input value={first_name + " " + last_name} disabled={true} style={{ width: 300 }} />
        </FormItem>

        <FormItem label="Mobile">
          <Input value={phone} disabled={true} style={{ width: 300 }} />
        </FormItem>
        <FormItem label="Date">
          <Input value={this.state.stateojc.date} disabled={true} style={{ width: 300 }} />
        </FormItem>
        <FormItem label="Slot">
          <Input value={this.state.stateojc.slot} disabled={true} style={{ width: 300 }} />
        </FormItem>
        <FormItem>
          <Link to={{ pathname: "/", data: this.state }}>

            <input type="submit" id="submit" className="booking" onClick={this.submitPayment} value="Book Stylist" />
          </Link>
        </FormItem>
      </Form>
    </div>


    
  render() {
   
    const { singleStylist } = this.state.stateojc;
    //  const {payment}=this.state;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    return (
      <div >
        <div id="body1" style={{ height: height, width: width }} >
          <Row gutter={40}>
            <Col span={12}>
              <Card style={{ height: height }}>
                <div className="center">
                  {singleStylist.map(this.renderStylist)}


                </div>
              </Card>
            </Col>
            <Col span={12}>

              <h1></h1>

            </Col>
          </Row>
        </div>

      </div>
    )
    
  }
  
}


export default Booking;