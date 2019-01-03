import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Search from './Search';
import Home from './Home';
import Stylist_Details from './Stylist_Details';
import Login from './Login';
import Booking from './Booking';
import Profile from './Profile';
import SaloonProfile from './SaloonProfile';
import AddSaloonOwner from './AddSaloonOwner';
import AddStylist from './AddStylist';
import SignUp from './SignUp';
import test from './test';




const Body =()=>(
    <main>
        <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/search' component={Search}/>
            <Route exact path='/stylistDtails' component={Stylist_Details}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/signup' component={SignUp}/>
            <Route exact path='/booking' component={Booking}/>
            <Route exact path='/profile' component={Profile}/>
            <Route exact path='/saloonProfile' component={SaloonProfile}/>
            <Route exact path='/addSaloon' component={AddSaloonOwner}/>
            <Route exact path='/addStylist' component={AddStylist}/>
            <Route exact path='/test' component={test}/>

        </Switch>
    </main>
   
)

export default Body;