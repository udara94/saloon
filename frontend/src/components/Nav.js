import React, { Component } from 'react';
import './CSS/navbar.css';
import {Navbar,Nav,NavItem} from 'react-bootstrap';
class Navbarclass extends Component {


    constructor(props){
        super(props)
        this.state={
          user:{
            id:'',
            email:'',
            password:'',
            type:''
          },
          userstylist:{
            id:'',
            email:'',
            password:'',
            type:''
          },
          href:''
        }
      }
    

    logout(){

        localStorage.removeItem('user');
    }

    componentDidMount() {
     
        this.initializeNavBar();

    }

    initializeNavBar() {

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
            this.chooseProfile(user);
        }
    }

    chooseProfile(user) {

        console.log('my user type is:' + user.type)
        if (user.type === 'stylist') {
            this.setState({
                href: 'profile'
            })
        }
        else if (user.type === 'saloonOwner') {
            this.setState({
                href: 'saloonProfile'
            })
        }
    }

    render() {
        
        const {user}=this.state;
        const {href}=this.state;
        if(user==null){
        return (
           
            <Navbar inverse >
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">Saloon</a>
                    </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                    <NavItem eventKey={1} href="/">
                        Home
                </NavItem>
                    <NavItem eventKey={2} href="search">
                        Search
                </NavItem>
                    <NavItem eventKey={3} href="login">
                        Login
                </NavItem>
                    <NavItem eventKey={4} href="signup">
                        Signup
                </NavItem>

                </Nav>
            </Navbar>
        )
        }
        else{
            return (

                <Navbar inverse collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/">Saloon</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem eventKey={1} href="/">
                                Home
                         </NavItem>
                            <NavItem eventKey={2} href="search">
                                Search
                         </NavItem>
                            <NavItem eventKey={3} href={href}>
                                Profile
                        </NavItem>
                            <NavItem onClick={() => this.logout()} eventKey={4} href="/">
                                Logout
                         </NavItem>

                        </Nav>

                    </Navbar.Collapse>
                </Navbar>

            )
        }
    }

}
export default Navbarclass;