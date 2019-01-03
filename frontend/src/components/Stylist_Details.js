import React from 'react';
//import { DatePicker } from 'antd';
//import TimePicker from 'react-time-picker'
import { Layout,Icon,Affix, Card, Calendar,Rate,Modal, Comment,Row,Select, Col , List, Avatar, Form, Button, Input } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import './CSS/stylist.css';

const Option = Select.Option;
const { Content, Sider } = Layout;
const TextArea = Input.TextArea;
const FormItem = Form.Item;


const Editor = ({
    onChange, onSubmit, submitting, value,
}) => (
        <div>
            <Form.Item>
                <TextArea rows={4} onChange={onChange} value={value} />
            </Form.Item>
            <Form.Item>
                <Button
                    htmlType="submit"
                    loading={submitting}
                    onClick={onSubmit}
                    type="primary"
                >
                    Add Comment
        </Button>
            </Form.Item>
        </div>
    );

const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

class Stylist_Details extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            comments: [],
            submitting: false,
            modal2Visible: false,
            value: 0,
            id:this.props.location.data,
            charge:this.props.location.charge,
            available: [],
            singleStylist:[],
            myPaidBookings:[],
            feedbacks:[],
            top: 10,
            bottom: 10,
            date:new Date().toLocaleDateString('en-US', DATE_OPTIONS),
            slot:'00:00 AM-08:00 AM',
            todayDate:new Date().toLocaleDateString('en-US', DATE_OPTIONS),
            user: {
                id: '',
                type: '',
                password: '',
                email: ''
            },
            rating:{
                score:'',
                count:'',
                rate:''
            },
            isVisible:false
            
          
        }
        this.handleRatingChange=this.handleRatingChange.bind(this)
        
    }


    componentDidMount() {

        this.getStylistAvailableDates();
        this.getStylistById();
       this.getMyFeedbacks();
       this.initializeComponent();
       this.getMypaidBooking(this.state.id)
       this.getUserType()
    }

    getUserType(){
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (user === null) {
            this.setState({
                isVisible:false
            })
        }
        else if(user.type==='stylist') {

            this.setState({
               isVisible:false
            })
        }
        else if(user.type==='saloonOwner'){
            this.setState({
                isVisible:true
            })
        }
    }

    getListData(value) {

        var valueDate=value.date();
        var valueMonth=value.month();
        var valueYear=value.year();
 
     
        var mydate=''
        var mysaloon='';
        var myslot=''
        var myelement=''
        var arr=[];
        var todate
        var tomonth
        var toyear
         this.state.myPaidBookings.forEach(element=>{
             var date=new Date(element.bookedDate)
              todate=date.getDate();
             tomonth=date.getMonth();
             toyear=date.getFullYear();
          
             if(todate===valueDate && tomonth===valueMonth&&toyear===valueYear){
                
             mydate=todate;
             mysaloon=element.saloonName;
             myslot=element.slot;
             myelement=element
             arr.push(myelement) 
             }
         })
         return [mydate,mysaloon,myslot,arr,tomonth,toyear]
 
       }
 
 
     dateCellRender(value) {
         var arr
         arr=this.getListData(value)[3];  
        
         if(value.date()===this.getListData(value)[0] && value.month()===this.getListData(value)[4]&& value.year()===this.getListData(value)[5]){
             console.log('return date',this.getListData(value)[3])
           
             return(
                 <div  style={{backgroundColor:"#009999"}}>
 
                     {
                         <label>booked</label>
                        //  <List style={{ fontSize: 10 }} dataSource={arr}
                        //      renderItem={item => (
 
                        //          <List.Item >
                        //              <label>{item.saloonName}</label>
                        //              <label>{item.slot}</label>
                        //          </List.Item>
                        //      )}
                        //  />
                     }
                 </div>
         );
      
         }
       
         }

         getMypaidBooking(id){
            fetch('http://localhost:8080/stylist/getMypaymentsBooking?stylistID=' + id)
            .then(response => response.json())
            .then(response => {
                this.setState({ myPaidBookings: response.data });
                console.log("my paid booking", response.data)
            })
            .catch(err => console.error(err))
    
        }     

    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible }); 
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

    RateStylist(rate){
      
        var score=this.state.rating.score;
        var count=this.state.rating.count;
        var myrate=rate
        var newscore=score+myrate
        var newcount=count+1
 
        var average=(score+myrate)/(count+1)
        var newrate=average
    
        this.setState({
            rating:{
                score:newscore,
                count:newcount,
                rate:newrate
            }
        })
        this.updateRating()



    }
    
    handleRatingChange = (value) => {
        
        this.setState({ 
            rating:{
                rate:value
        } });
        this.RateStylist(value)
        //this.getStylistAvailableDates()
      }

      updateRating(){
        const {rating}=this.state
        
        console.log(rating.score)
        console.log(rating.count)
        console.log(rating.rate)
        fetch('http://localhost:8080/stylist/updateRatings?count='+rating.count+'&rating='+rating.rate+'&score='+rating.score+'&idstylist='+ this.state.id)
        .then(response => response.json())
        .then(response => {
            this.setState({ available: response.data });
          //  console.log("hello",response.data)
        })
        .catch(err => console.error(err))
       
        this.setModal2Visible(false)
    }

    getStylistAvailableDates = _ => {
        fetch('http://localhost:8080/stylist/getstylistById?idstylist='+ this.state.id)
            .then(response => response.json())
            .then(response => {
                this.setState({singleStylist: response.data });
                console.log("stylist",response.data )

                this.state.singleStylist.forEach(element=>{

                    this.setState({
                        rating:{
                            score:element.score,
                            count:element.count,
                            rate:Math.round(element.rating*10)/10
                        }
                    })
                })
                
            })
            .catch(err => console.error(err))

    }
    getStylistById = _ => {
        fetch('http://localhost:8080/stylist/getAvailableDates?stylist_id='+ this.state.id)
            .then(response => response.json())
            .then(response => {
                this.setState({ available: response.data });
              //  console.log("hello",response.data)
            })
            .catch(err => console.error(err))

    }

    getMyFeedbacks = _ => {
        fetch('http://localhost:8080/stylist/getMyFeedbacks?stylistid='+ this.state.id)
            .then(response => response.json())
            .then(response => {
                this.setState({ feedbacks: response.data });
                //console.log("feedbacks",response.data)
            })
            .catch(err => console.error(err))

    }

    addFeedback(){
        const {user}=this.state;
     
        fetch('http://localhost:8080/stylist/addfeedback?saloonid='+user.id+'&stylistid='+this.state.id+'&feedback='+this.state.value+'&date='+this.state.todayDate)
        .then(response => response.json())
        .catch(err => console.error(err))
        this.getMyFeedbacks()
    }


    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        this.addFeedback();

        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    {
                        author: 'Han Solo',
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content: <p>{this.state.value}</p>,
                        datetime: moment().fromNow(),
                    },
                    ...this.state.comments,
                ],
            });
        }, 1000);
    }

   
    handleChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }

    onSelect = (values) => {
        console.log(values)
        this.setState({
           
               date:values._d.toLocaleDateString('en-US', DATE_OPTIONS)
        });
      }

test(){
    console.log("fdd")
}
    handleSlotChange=(value)=> {
      
        this.setState({
           
               slot:value
           
        })
        console.log(this.state.slot)
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


    render() {

        
        const{singleStylist}=this.state
        const { submitting, value } = this.state;
        const {feedbacks} =this.state; 
        
        return (
            <div>

                <Layout>

                    <Layout>
                        <Sider width={300} style={{ background: '#fff' }}>
                            <div>

                                <Card >
                                    <img width={200} height={200} alt="example" src="https://pngimage.net/wp-content/uploads/2018/05/avatar-profile-png-2.png" />
                                   
                                   <div>  
                                       
                                    
                                       </div> 
                                       <List dataSource={singleStylist}
                                                renderItem={item => (

                                                    <List.Item  >
                                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                                        <Card>
                                                            <pre><b><Icon type="user" />Name:<li className="details" >{item.first_name + " " + item.last_name}</li></b></pre>
                                                            <pre><b><Icon type="phone" />Contact:<li className="details" >{item.phone}</li></b></pre>
                                                            <pre><b><Icon type="environment" />City:<li className="details" >{item.city}</li></b></pre>
                                                            <pre><b><Icon type="dollar" />Charge:<li className="details" >{item.price} Rs per slot</li></b></pre>
                                                            <span style={{ color: "#009999" }}>
                                                                <b className="rating">{Math.round(item.rating*10)/10}</b>  <Rate disabled style={{ color: "#009999" }} value={item.rating} />
                                                                {item.rating && <span className="ant-rate-text"></span>}
                                                            </span>
                                                        </Card>
                                                    </List.Item>
      

                                                )}
                                            />
                                   {/* <Button type="primary" block>Rate Stylist</Button> */}
                                   <input type="submit" id="ratingbtn" className="ratingbtn" icon="star"  onClick={() => this.setModal2Visible(true)} value="Rate Stylist" />
                                </Card>
                            </div>
                           
                        </Sider>
                        <Layout style={{ padding: '0 24px 24px' }}>

                            <Content style={{
                                background: '#fff', padding: 24, margin: 0,
                            }}
                            >
                         <Row gutter={16}>
                         
                                        <Form >
                                            <FormItem>
                                               
                                                <Input value={this.state.date} onChange={this.test} style={{ width: 300 }} />&nbsp;&nbsp;
                                                
                                                <Select defaultValue="Select Slot" style={{ width: 200 }} onChange={this.handleSlotChange} >
                                                    <Option value="00:00 AM-08:00 AM">00:00 AM-08:00 AM</Option>
                                                    <Option value="08:00 AM-16:00 PM">08:00 AM-16:00 PM</Option>
                                                    <Option value="16:00 PM-24:00 PM">16:00 PM-24:00 PM</Option>
                                                </Select>&nbsp;&nbsp;
                                               {this.state.isVisible? <Link to={{ pathname: "/booking", data: this.state, stylist: this.state.singleStylist }}>
                                                    <Button type="danger"  >Request for Booking</Button>
                                                </Link>:null}
                                            </FormItem>
                                        </Form>
                            <Calendar  
                            style={{ border: '1px solid #d9d9d9', borderRadius: 4 }} 
                            dateCellRender={e=>this.dateCellRender(e)} 
                            onSelect={this.onSelect}
                            disabledDate={this.disabledDate} />
                        
                            <List
                                    className="comment-list"
                                    header={`${feedbacks.length} Feedbacks`}
                                    itemLayout="horizontal"
                                    dataSource={feedbacks}
                                    renderItem={item => (
                                        <Comment
                                            
                                            author={item.first_name+" "+item.last_name}
                                            avatar={'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}
                                            content={item.feedback}
                                            // datetime={moment(new Date().diff(moment(item.date)))}
                                        />
                                    )}
                                />
                                {/* {comments.length > 0 && <CommentList comments={comments} />} */}
                                <Comment
                                    avatar={(
                                        <Avatar
                                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                            alt="Han Solo"
                                        />
                                    )}
                                    content={(
                                        <Editor
                                            onChange={this.handleChange}
                                            onSubmit={this.handleSubmit}
                                            submitting={submitting}
                                            value={value}
                                        />
                                    )}
                                />
                           
                            
                            
                        </Row>


                         <Modal
                                title="Let's Rate the stylist.."
                                centered
                                visible={this.state.modal2Visible}
                                onOk={() =>console.log("cancel") }
                                onCancel={() => this.setModal2Visible(false)}
                                style={{fontSize:70}}
                            >
                                 <span className="starRating" style={{ color: "#009999",fontSize:50}}>
                                <Rate className="starRating" onChange={e=>this.handleRatingChange(e)}  style={{ color: "#009999",fontSize:85 }} />
                            {/* {rating && <span className="ant-rate-text"></span>} */}
                                                            </span>
                            </Modal>
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

export default Stylist_Details