import React from 'react';
import './CSS/login.css';
import {Form, Icon, Input, Button, Checkbox, Card } from 'antd';
 



class Login extends React.Component {

  constructor(props){
    super(props)
    this.state={
      email:'',
      password:'',
      count:'',
      data:[],
      user:{
        id:'',
        email:'',
        password:'',
        type:''
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.login()
      }
    });
  }

  login() {
    fetch('http://localhost:8080/stylist/login?email=' + this.state.email + '&password=' + this.state.password)
      .then(response => response.json())
      .then(response => {

        console.log(response.data)
        this.setState({ data: response.data })

        this.state.data.forEach(element => {
          this.setState({
            count: element.count
          })
          this.setState({
            user: {
              id: element.userid,
              email: element.email,
              password: element.password,
              type: element.type
            }
          })

          this.doValidation(this.state.count)
          console.log("my count is" + element.count)
        });
      })
      .catch(err => console.error(err))
  }

  doValidation(count) {
    const { user } = this.state
    console.log('data:' + count)
    if (count === 1) {
      console.log("valid user")

      localStorage.setItem('user', JSON.stringify(user));
      this.props.history.push({ pathname: '/', data: user });

    }
    else if (count === 0) {
      console.log("invalid user")
    }
  }

     
  render() {
    const { getFieldDecorator } = this.props.form;
   
    return (
      <div className="div" >
        <Card className="card">
          <h1 className="heding">Log In</h1>
          <Form style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input className="email" onChange={e => this.setState({ email: e.target.value })} prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input className="password" onChange={e => this.setState({ password: e.target.value })} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </Form.Item>
            <Form.Item>

              {/* <Button type="primary" htmlType="submit"  style={{backgroundColor:"#1890ff", width:200, height:45,top:100, margin:0}} className="login">
            Log in
          </Button> */}
              <input type="submit" htmlType="submit" className="login" value="Login" />
            </Form.Item>
            <Form.Item className="form">

              <div className="forgotDiv">
                <a className="forgot" href="/">Forgot password</a><br></br>
                Or <br></br><a href="/">register now!</a>
              </div>
            </Form.Item>
          </Form>
        </Card>

      </div>

    )
    
  }
  
}

const WrappedNormalLoginForm = Form.create()(Login);
export default WrappedNormalLoginForm;