import React from 'react';
import { Form, Input,Card,Row,Col, Tooltip, Icon, Button, AutoComplete} from 'antd';
import {geolocated} from 'react-geolocated';
import {test} from './test';
import './CSS/addstylist.css';

const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;


class AddStylist extends React.Component {

constructor(props){

  super(props)
  this.state = {
    test:[],
    confirmDirty: false,
    autoCompleteResult: [],
    user:{
      id:'',
      email:'',
      password:'',
      type:''
    },
    
    stylist:{
      price:0,
      fname:'',
      lname:'',  
      phone:'',
      city:'',
      id:''
      
     
    },
  
   
  };

  this.addStylist=this.addStylist.bind(this)
  this.adduser=this.adduser.bind(this)
}

  handlestylistSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.adduser();

      }
    });
  }



  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  handleWebsiteChange = (value) => {
    let autoCompleteResult;
    if (!value) {
      autoCompleteResult = [];
    } else {
      autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  adduser = _ => {

    const { user } = this.state;

    fetch('http://localhost:8080/stylist/adduser?email=' + user.email + '&password=' + user.password + '&type=stylist')
      .then(response => {

        console.log('response', response.status)
        if (response.status === 200) {
          this.getuserIdByEmail()
        }
        else if (response.status === 403) {
          console.log('under construction')
        }

      })
      .catch(err => console.error(err))

  }


  getuserIdByEmail() {
    const { user } = this.state;
    const { stylist } = this.state;
    fetch('http://localhost:8080/stylist/getUserIdByemail?email=' + user.email)
      .then(response => response.json())
      .then(response => {
        var arr = response.data
        console.log('my arr', arr)
        arr.forEach(element => {

          stylist.id = element.userid
          console.log('my id', stylist.id)
          this.addStylist(stylist.id)

        });
      })
      .catch(err => console.error(err))
  }
  sendLocation() {

 
}
  addStylist(id){
    console.log("location", this.props.coords.latitude)
    console.log("location", this.props.coords.longitude)
 
    var lat=this.props.coords.latitude
    var lng=this.props.coords.longitude
    const {stylist}=this.state;
    fetch('http://localhost:8080/stylist/addstylist?idstylist='+id+'&first_name='+stylist.fname+'&last_name='+stylist.lname+'&price='+stylist.price+'&phone='+stylist.phone+'&city='+stylist.city+'&lat='+lat+'&lng='+lng)
    .then(response=>response.json())
    .catch(err=>console.error(err))
    this.props.history.push({pathname:'login'});
  }


  test(){
    console.log(this.props.coords.latitude)
  }


  render() {


    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;
    const { user } = this.state;
    const { stylist } = this.state;


    

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };



    const websiteOptions = autoCompleteResult.map(website => (
      <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
    ));

    return (

      <div>
        <div id="body1" >
          <div className="formDiv1">
            <Card className="card1">
              <h1 className="header1">Join as Stylist</h1>
              <Row>
                <Col span={12}>
                  <Form onSubmit={this.handlestylistSubmit}>
                    <FormItem
                      {...formItemLayout}
                      label={(
                        <span>
                          First Name&nbsp;
            </span>
                      )}
                    >

                      {getFieldDecorator('fname', {
                        rules: [{ required: true, message: 'Please enter your first name', whitespace: true }],
                      })(
                        <Input onChange={e => this.setState({ stylist: { ...stylist, fname: e.target.value } })} />
                      )}
                    </FormItem>


                    <FormItem
                      {...formItemLayout}
                      label={(
                        <span>
                          Last Name&nbsp;
            </span>
                      )}
                    >
                      {getFieldDecorator('lname', {
                        rules: [{ required: true, message: 'Please input your last name!', whitespace: true }],
                      })(
                        <Input onChange={e => this.setState({ stylist: { ...stylist, lname: e.target.value } })} />
                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="E-mail"
                    >

                      {getFieldDecorator('email', {
                        rules: [{
                          type: 'email', message: 'The input is not valid E-mail!',
                        }, {
                          required: true, message: 'Please input your E-mail!',
                        }],
                      })(
                        <Input onChange={e => this.setState({ user: { ...user, email: e.target.value } })} />

                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label="Password"
                    >
                      {getFieldDecorator('password', {
                        rules: [{
                          required: true, message: 'Please input your password!',
                        }, {
                          validator: this.validateToNextPassword,
                        }],
                      })(
                        <Input type="password" onChange={e => this.setState({ user: { ...user, password: e.target.value } })} />

                      )}
                    </FormItem>



                    <FormItem
                      {...formItemLayout}
                      label="Phone"
                    >
                      {getFieldDecorator('phone', {
                        rules: [{ required: true, message: 'Please input your phone number!' }],
                      })(
                        <Input style={{ width: '100%' }} onChange={e => this.setState({ stylist: { ...stylist, phone: e.target.value } })} />

                      )}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label={(
                        <span>
                          Charge&nbsp;
              <Tooltip title="How much you charge as a stylist?">
                            <Icon type="question-circle-o" />
                          </Tooltip>
                        </span>
                      )}
                    >
                      {getFieldDecorator('charge', {
                        rules: [{ required: true, message: 'Please enter your charge!', whitespace: true }],
                      })(
                        <Input onChange={e => this.setState({ stylist: { ...stylist, price: e.target.value } })} />

                      )}
                    </FormItem>

                    <FormItem
                      {...formItemLayout}
                      label="City"
                    >


                      {getFieldDecorator('city', {
                        rules: [{ required: true, message: 'Please enter the Home Town!', whitespace: true }],
                      })(
                        <AutoComplete
                          dataSource={websiteOptions}
                          onChange={this.handleWebsiteChange}
                          placeholder="City"
                        >
                          <Input onChange={e => this.setState({ stylist: { ...stylist, city: e.target.value } })} />
                        </AutoComplete>
                      )}
                    </FormItem>


                    <FormItem {...tailFormItemLayout}>
                      {/* <Button type="primary" htmlType="submit">Register</Button> */}
                      <input type="submit" htmlType="submit" className="twitter" value="Create Account" />
                    </FormItem>
                  </Form>
                </Col>
                <Col span={12}>
                  <div className="div2">
                    <input type="submit" id="facebook1" className="facebook1" onClick={() => console.log("facebook button clicked")} value="Loging with FaceBook" />
                    <input type="submit" id="google1" className="google1" onClick={() => console.log("facebook button clicked")} value="Loging with Google" />
                    <input type="submit" id="twitter1" className="twitter1" onClick={() => console.log("facebook button clicked")} value="Loging with Twitter" />
                    <input type="submit" onClick={() => this.sendLocation()} value="test" />
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </div>


      </div>

    )
  }
}

const WrappedRegistrationForm = Form.create()(AddStylist);
export default geolocated({ positionOptions: {enableHighAccuracy: false,},userDecisionTimeout: 5000,})(WrappedRegistrationForm);