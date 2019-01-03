import React from 'react';
import { Form, Input, Button, Row, Col, Card, AutoComplete } from 'antd';
import './CSS/addsaloon.css';

const FormItem = Form.Item;
const AutoCompleteOption = AutoComplete.Option;


class AddSaloonOwner extends React.Component {

  constructor(props) {

    super(props)
    this.state = {
      test: [],
      confirmDirty: false,
      autoCompleteResult: [],
      user: {
        id: '',
        email: '',
        password: '',
        type: ''
      },

      saloonOwner: {
        fname: '',
        lname: '',
        saloon: '',
        city: '',
        phone: '',
        id: ''
      },

    };

  }


  handleSloonOwnerSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.addSaloonUser()
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


  addSaloonUser = _ => {
    const { user } = this.state;

    fetch('http://localhost:8080/stylist/adduser?email=' + user.email + '&password=' + user.password + '&type=saloonOwner')
      .then(response => {

        console.log('response', response.status)
        if (response.status === 200) {
          this.getSaloonByEmail();
        }
        else if (response.status === 403) {
          console.log('under construction')
        }

      })
      .catch(err => console.error(err))
  }


  getSaloonByEmail() {
    const { user } = this.state;

    const { saloonOwner } = this.state;
    fetch('http://localhost:8080/stylist/getUserIdByemail?email=' + user.email)
      .then(response => response.json())
      .then(response => {
        var arr = response.data
        console.log('my arr', arr)
        arr.forEach(element => {

          saloonOwner.id = element.userid
          console.log('my id', saloonOwner.id)
          this.addSaloonOwner(saloonOwner.id)

        });
      })
      .catch(err => console.error(err))
  }


  addSaloonOwner(id) {

    const { saloonOwner } = this.state;
    fetch('http://localhost:8080/saloon/addsaloonowner?saloonid=' + id + '&first_name=' + saloonOwner.fname + '&last_name=' + saloonOwner.lname + '&phone=' + saloonOwner.phone + '&city=' + saloonOwner.city + '&saloon_name=' + saloonOwner.saloon)
      .then(response => response.json())
      .catch(err => console.error(err))
    this.props.history.push({ pathname: 'login' });
  }

  render() {


    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;
    const { user } = this.state;
    const { saloonOwner } = this.state;



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

      <div className="body2" >
      
        <div className="formDiv2">
      
          <Card className="card2">
            <h1 className="header2">Join as Saloon Owner</h1>
            <Row>
              <Col span={12}> <Form onSubmit={this.handleSloonOwnerSubmit}>
                <FormItem className="form2"
                  {...formItemLayout}
                  label={(
                    <span >
                      First Name&nbsp;
            </span>
                  )}
                >
                  {getFieldDecorator('sofname', {
                    rules: [{ required: true, message: 'Please enter your first name', whitespace: true }],
                  })(
                    <Input style={{ width: '100%' }} onChange={e => this.setState({ saloonOwner: { ...saloonOwner, fname: e.target.value } })} />
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
                  {getFieldDecorator('solname', {
                    rules: [{ required: true, message: 'Please input your last name!', whitespace: true }],
                  })(
                    <Input style={{ width: '100%' }} onChange={e => this.setState({ saloonOwner: { ...saloonOwner, lname: e.target.value } })} />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="E-mail"
                >
                  {getFieldDecorator('soemail', {
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
                  {getFieldDecorator('sopassword', {
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
                  {getFieldDecorator('sophone', {
                    rules: [{ required: true, message: 'Please input your phone number!' }],
                  })(
                    <Input onChange={e => this.setState({ saloonOwner: { ...saloonOwner, phone: e.target.value } })} style={{ width: '100%' }} />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="City"
                >
                  {getFieldDecorator('socity', {
                    rules: [{ required: true, message: 'Please enter the Home Town!' }],
                  })(
                    <AutoComplete
                      dataSource={websiteOptions}
                      onChange={this.handleWebsiteChange}
                      placeholder="City"
                    >
                      <Input style={{ width: '100%' }} onChange={e => this.setState({ saloonOwner: { ...saloonOwner, city: e.target.value } })} />
                    </AutoComplete>
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="Saloon Name"
                >
                  {getFieldDecorator('sosaloon', {
                    rules: [{ required: true, message: 'Please enter the Saloon Name!' }],
                  })(
                    <AutoComplete
                      dataSource={websiteOptions}
                      onChange={this.handleWebsiteChange}
                      placeholder="Saloon Name"
                    >
                      <Input style={{ width: '100%' }} onChange={e => this.setState({ saloonOwner: { ...saloonOwner, saloon: e.target.value } })} />
                    </AutoComplete>
                  )}
                </FormItem>


                <FormItem {...tailFormItemLayout}>
                  {/* <Button type="primary" htmlType="submit" >Register</Button> */}
                  <input type="submit" htmlType="submit" className="twitter2" value="Create Account" />
                </FormItem>
              </Form>
              </Col>
              <Col span={12} className="div2">
                <div className="div2">
                  <input type="submit" id="facebook2" className="facebook2" onClick={() => console.log("facebook button clicked")} value="Loging with FaceBook" />
                  <input type="submit" id="google2" className="google2" onClick={() => console.log("facebook button clicked")} value="Loging with Google" />
                  <input type="submit" id="twitter2" className="twitter2" onClick={() => console.log("facebook button clicked")} value="Loging with Twitter" />
                </div>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

    )
  }
}

const WrappedRegistrationForm = Form.create()(AddSaloonOwner);
export default WrappedRegistrationForm;