import React from 'react';
import {  DatePicker, Select,Input} from 'antd';
import moment from 'moment';
import $ from 'jquery';
import anime from 'animejs';
import {geolocated} from 'react-geolocated';
import axios from 'axios';
import './CSS/home.css';
import Button from 'react-bootstrap/lib/Button'

const width = window.innerWidth ;
const height = window.innerHeight;
const Option = Select.Option;



class Home extends React.Component {

    
    constructor(props) {
        super(props);
        
        this.state = {
             controlledDate: '',
             slot:'',
             visible: false,
             stylist:[],
             redirect:false,
             maxprice:0 ,
             minprice:0,
             user:'',
             location:{
                lat:'',
                lng:''
            }
            };
           
            this.handleChangeDate = this.handleChangeDate.bind(this);
            this.handleChange=this.handleChange.bind(this);
            this.getStylist=this.getStylist.bind(this);
            this.findStylistByPrice=this.findStylistByPrice.bind(this);
    }
    

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleChange = (value, date) => {
        this.setState({
            slot: value
        })
        // this.getStylist();
    }

    handleChangeDate = (event, date) => {
        this.setState({
            controlledDate: date
        });
        // this.getStylist();
    };

    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log("user is", user)
        this.textfuction()
    }
    getMinValue = (e) => {

        this.setState({
            minprice: e.target.value
        })
        console.log(this.state.minprice)
    }
    
    getMaxValue = (e) => {

        this.setState({
            maxprice: e.target.value
        })
        console.log(this.state.maxprice)
        console.log("lat" + this.props.location.data)
        this.findStylistByPrice()
    }

    findStylistByPrice = () => {
        console.log("clicked")
        //    e.preventDefault();
        const form = {
            maxprice: this.state.maxprice,
            minprice: this.state.minprice
        }
        this.getStylistByPrice(form.minprice, form.maxprice)
        console.log("Maxprice" + form.maxprice, "minPrice" + form.minprice)

    }

    getStylistByPrice(min, max) {

        fetch('http://localhost:8080/stylist/searchByPrice?pricemin=' + min + '&pricemax=' + max)
            .then(response => response.json())
            .then(response => {
                this.setState({ stylist: response.data })
                console.log(response.data)
            })
            .catch(err => console.error(err))

    }

    gotoSearch() {
        this.props.history.push({ pathname: 'search', data: this.state.stylist });
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

    getStylist = () => {
        console.log("my date", this.state.controlledDate)
        console.log("my slot", this.state.slot)
        fetch('http://localhost:8080/stylist/getAvailableStylist?date=' + this.state.controlledDate + '&slot=' + this.state.slot)
            .then(response => response.json())
            .then(response => {
                this.setState({ stylist: response.data });
                console.log("stylist", response.data)
                this.props.history.push({ pathname: '/search', data: response.data });
            })

            .catch(err => console.error(err))
    }

    navigatePage() {
        console.log("im here")
        this.setState({
            redirect: true
        })
    }

 

    textfuction() {

        $('.ml3').each(function () {
            $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
        });

        anime.timeline({ loop: true })
            .add({
                targets: '.ml3 .letter',
                opacity: [0, 1],
                easing: "easeInOutQuad",
                duration: 2250,
                delay: function (el, i) {
                    return 150 * (i + 1)
                }
            }).add({
                targets: '.ml3',
                opacity: 0,
                duration: 1000,
                easing: "easeOutExpo",
                delay: 1000
            });
    }

    render() {
      
          
     
        return (
            <div className="background" style={{ height: height, width: width }}>
                <h1 class="ml3">Great Thinkers </h1>
                <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
                <div className="container">

                    <form id="booking-form" class="booking-form" >
                        <div className="form-group">

                            <div id="div" className="form-date-from form-icon">
                                <label className="label" for="date_from">Date</label>
                                <DatePicker format="YYYY-MM-DD" disabledDate={this.disabledDate} />
                                <span className="icon"><i class="zmdi zmdi-calendar-alt"></i></span>
                            </div>
                            {/* <div  id="div" className="form-date-to form-icon">
                                <label className="label" for="date_to">Time Slot</label>
                                <Select defaultValue="Select Slot" style={{ width: 200 }} onChange={this.handleChange} ref="se">

                                    <Option value="1">00:00 AM-08:00 AM</Option>
                                    <Option value="2">08:00 AM-16:00 PM</Option>
                                    <Option value="3">16:00 PM-24:00 PM</Option>

                                </Select>
                                <span className="icon"><i className="zmdi zmdi-calendar-alt"></i></span>
                            </div> */}
                            <div id="div" className="form-date-to form-icon">
                                <label className="label" for="date_to">Min Price</label>
                                <Input className="price" style={{ width: 150 }} placeholder="Minimum Price" onChange={e => this.getMinValue(e)} />

                                <span className="icon"><i className="zmdi zmdi-calendar-alt"></i></span>
                            </div>
                            <div id="div" className="form-date-to form-icon">
                                <label className="label" for="date_to">Max Price</label>
                                <Input className="price" style={{ width: 150 }} placeholder="Maximum Price" onChange={e => this.getMaxValue(e)} />
                                <span className="icon"><i className="zmdi zmdi-calendar-alt"></i></span>
                            </div>



                        </div>
                    </form>
                </div>
                <div >
                    <input type="submit" id="submit" className="submit" onClick={e => this.gotoSearch()} value="Find Stylists" />

                </div>
                {/* <Button type="primary" onClick={() => this.getStylist()} >Find</Button> */}

            </div>
        )
    }
}

export default geolocated({ positionOptions: {enableHighAccuracy: false,},userDecisionTimeout: 5000,}) (Home)