import React from 'react';
import { Layout,Form,Icon,notification ,Input,Alert, Card, Calendar, Rate,Badge,Upload, Modal, Comment, Row, Col, Tabs, List, Button } from 'antd';
import { StickyContainer, Sticky } from 'react-sticky';
import './CSS/profile.css'
import moment from 'moment';

const {  Sider } = Layout;
const { Meta } = Card;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
);


 

 
  


const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

class Profile extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            comments: [],
            submitting: false,
            value: moment('2017-01-25'),
            selectedValue:moment('2017-01-25'),
            charge: this.props.location.charge,
            available: [],
            singleStylist: [],
            bookedDates:[],
            myBookings:[],
            myPaidBookings:[],
            paidDays:[],
            listedates:[],
            modal2Visible: false,
            top: 10,
            bottom: 10,
            stylist: '',
            date: new Date().toLocaleDateString('en-US', DATE_OPTIONS),
            slot: '00:00 AM-08:00 AM',
            todayDate: new Date().toLocaleDateString('en-US', DATE_OPTIONS),
            bookedDateArray:[],
            feedbacks:[],
            previewVisible: false,
            previewImage: '',
            fileList: [{
              uid: '-1',
              name: 'xxx.png',
              status: 'done',
              url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            }],
            user:{
                id:'',
                email:'',
                password:'',
                type:''
              },
              userStylist:{
                first_name:'',
                last_name:'', 
                price:'', 
                rating:'', 
                idstylist:'', 
                phone:'', 
                city:''
              },
              calander:{
                saloon:'',
                slot:''
              }
            
        }
     
        this.acceptRequest=this.acceptRequest.bind(this)
        this.initializeComponent();
    }

    initializeComponent() {
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
            this.getMypaidBooking(user.id)
            this.getStylistById(user.id)
            this.getMyBooking(user.id)
            this.getMyFeedbacks(user.id)
            
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
        //const {calander}=this.state
        arr=this.getListData(value)[3];  
       
        // var mysaloon=this.getListData(value)[1]
        // var myslot=this.getListData(value)[2]
        if(value.date()===this.getListData(value)[0] && value.month()===this.getListData(value)[4]&& value.year()===this.getListData(value)[5]){
            console.log('return date',this.getListData(value)[3])
          
            return(
                <div  style={{backgroundColor:"#009999"}}>

                    {
                        <List style={{ fontSize: 10 }} dataSource={arr}
                            renderItem={item => (

                                <List.Item >
                                    <label>{item.saloonName}</label>
                                    <label>{item.slot}</label>
                                </List.Item>
                            )}
                        />
                    }
                </div>
        );
     
        }
      
        }

        onSelect = (value) => {  
            var date=new Date(value)
            var convertedDate=date.toLocaleDateString('en-US', DATE_OPTIONS)  
            this.setState({
              value,
              selectedValue:value ,
            });

            this.getPaymentByDate(convertedDate)
          }

          onPanelChange = (value) => {
            this.setState({ value });
          }

componentDidMount() {

}

openNotification = () => {
    const{myBookings}=this.state;
   
    if(myBookings.length>0){
       
    
        notification.config({
            placement: 'bottomRight',
            bottom: 50,
           
          })
        const args = {
          message: 'Booking Notification',
          description: 'One of the saloon owner has booked you',
          duration: 0,
        };
        notification.open(args);
    }

 
  };

  changeTab(){

  }


    getStylistById (id) {
        fetch('http://localhost:8080/stylist/getstylistById?idstylist=' + id)
            .then(response => response.json())
            .then(response => {
                this.setState({ stylist: response.data });
                console.log("my profile", response.data)
               this.state.stylist.forEach(element=>{

                this.setState({
                    userStylist:{
                        first_name:element.first_name,
                        last_name:element.last_name,
                        price:element.price,
                        rating:element.rating, 
                        idstylist:element.idstylist, 
                        phone:element.phone, 
                        city:element.city
                    }
                      
                    
                })
               })
               
             
            })
            .catch(err => console.error(err))

    }


    getMyBooking (id) {
        fetch('http://localhost:8080/stylist/getMyBooking?stylistID=' + id)
            .then(response => response.json())
            .then(response => {
                this.setState({ myBookings: response.data });
                console.log("my booking", response.data)
                this.openNotification()
            })
            .catch(err => console.error(err))

    }

    getPaymentByDate (date) {
        const {userStylist}=this.state;
        fetch('http://localhost:8080/stylist/getPaymentbyDate?bookedDate=' + date+'&stylistID='+userStylist.idstylist)
            .then(response => response.json())
            .then(response => {
                this.setState({ paidDays: response.data });
                console.log("my booking", response.data)
            })
            .catch(err => console.error(err))

    }

    getMyFeedbacks(id) {
        fetch('http://localhost:8080/stylist/getMyFeedbacks?stylistid='+ id)
            .then(response => response.json())
            .then(response => {
                this.setState({ feedbacks: response.data });
                console.log("feedbacks",response.data)
            })
            .catch(err => console.error(err))

    }

    updateUser(){

        const {userStylist} =this.state;
        console.log("update part:"+userStylist.first_name)
        fetch('http://localhost:8080/stylist/updateStylist?idstylist='+userStylist.idstylist+'&first_name='+userStylist.first_name+'&last_name='+userStylist.last_name+'&price='+userStylist.price+'&phone='+userStylist.phone+'&city='+userStylist.city)
        .then(response => response.json())
        .then(response => {
           
            console.log(response)
        })
        .catch(err => console.error(err))
        this.setModal2Visible(false);
        this.getStylistById(userStylist.idstylist)
    }
  
    getMypaidBooking(id){
        fetch('http://localhost:8080/stylist/getMypaymentsBooking?stylistID=' + id)
        .then(response => response.json())
        .then(response => {
            this.setState({ myPaidBookings: response.data });
            console.log("my paid booking", response.data)
            // this.state.myPaidBookings.forEach(element=>{
            //     console.log('load:'+element.bookedDate)
            // })
        })
        .catch(err => console.error(err))

    }

    setModal2Visible(modal2Visible) {
   
   
        this.setState({ modal2Visible });

        
    }

    acceptRequest=(id)=>{
        const {myBookings}=this.state;
        
        myBookings.forEach(element => {
            if(element.id===id.id){
                
                this.insertToConfirm(element);
                //console.log("accepted",id)
            }
            
        });
       

    }
    rejectRequest(item){
        console.log("rejected",item)
        this.deleteFromNotification(item.id)
        this.getMyBooking();
    }

    deleteFromNotification(id){
        console.log("my id is"+id)
        fetch('http://localhost:8080/stylist/deleteFromNotification?id='+ id)
        .then(response => response.json())
        .catch(err => console.error(err))

    }
    insertToConfirm(element){

    
        console.log(element)

        fetch('http://localhost:8080/stylist/addtoConfirmation?saloonOwnerID='+element.saloonOwnerID+'&stylistID='+element.stylistID+'&bookedDate='+element.bookedDate+'&slot='+element.slot+'&payment='+element.price)
        .then(response =>{
           // response.json()
            console.log(response)
            this.deleteFromNotification(element.id);
            this.getMyBooking()
        } )
        .catch(err => console.error(err))
    }


      handleCancel = () => this.setState({ previewVisible: false })

      handlePreview = (file) => {
        this.setState({
          previewImage: file.url || file.thumbUrl,
          previewVisible: true,
        });
        console.log("preview image",file)
      }
    
      handleChange = ({ fileList }) => this.setState({ fileList })
    

    render() {
        
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

        const renderTabBar = (props, DefaultTabBar) => (
            <Sticky bottomOffset={80}>
                {({ style }) => (
                    <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#d9d9d9' }} />
                )}
            </Sticky>
        );
        const { comments } = this.state;
        const { stylist } = this.state;
        const {myBookings}=this.state;
        const {feedbacks}=this.state;
        const {userStylist}=this.state;
        const {paidDays}=this.state;

        const { previewVisible, previewImage, fileList } = this.state;
        const { selectedValue } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
        return (


            <div>

                <Layout>

                    <Layout>
                        <Sider width={300} style={{ background: '#fff' }}>
                            <div>

                                    <Card style={{ width: 300 }}>
                                    <img width={200} height={200} alt="example" src="https://pngimage.net/wp-content/uploads/2018/05/avatar-profile-png-2.png" />
                                   
                                   <div>  
                                       
                                    
                                       </div> 
                                       <List dataSource={stylist}
                                                renderItem={item => (

                                                    <List.Item  >
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
                                </Card>
                                 <Button type="primary" onClick={() => this.setModal2Visible(true)} block>Edit Profile</Button>
                                 <Alert message={`ON:  ${selectedValue && selectedValue.format('YYYY-MM-DD')}`} ></Alert>
                                 <List dataSource={paidDays}
                                    renderItem={item => (

                                        <List.Item  >   
                                            <Row>
                                            <label>{item.saloonName}</label>
                                            </Row>
                                            <Row><label>{item.bookedDate}</label></Row>
                                            <Row>  <label>{item.slot}</label></Row>
                                            
                                                            
                                        </List.Item>


                                    )}
                                />
                              
                            </div>

                        </Sider>


                        <Layout style={{ padding: '0 24px 24px' }}>
                            <StickyContainer>
                                <Tabs defaultActiveKey="1" renderTabBar={renderTabBar}>
                                    <TabPane tab="Calendar" key="1" >
                                      
                                    <Row gutter={16}>
                            <Col span={12}>
                           
                                     
                                             <Calendar onPanelChange={this.onPanelChange}
                                              dateCellRender={e=>this.dateCellRender(e)}
                                               onSelect={this.onSelect} 
                                                style={{ width:1100, border: '1px solid #d9d9d9', borderRadius: 4 }} />

                                            </Col>

                                      
                                        </Row>
                                       <br></br><br></br><br></br>
                                    </TabPane>
                                    <TabPane tab="Feedbacks" key="2">
                                        <List
                                            className="comment-list"
                                            header={feedbacks.length+" feedbacks"}
                                            itemLayout="horizontal"
                                            dataSource={feedbacks}
                                            renderItem={item => (
                                                <Comment
                                                   
                                                    author={item.first_name+" "+item.last_name}
                                                    avatar={'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'}
                                                    content={item.feedback}
                                                    
                                                />
                                            )}
                                        />
                                        {comments.length > 0 && <CommentList comments={comments} />}

                                    </TabPane>
                                    <TabPane tab={<div><span><Badge  count={myBookings.length} showZero></Badge></span><span> &nbsp;&nbsp;&nbsp;Notifications</span></div>} key="3">
                                    <List dataSource={myBookings}
                                            renderItem={item => (

                                                <List.Item  >
                                                    <Card title={item.saloon_name} bordered={true} style={{width:300}} >
                                                        <p>{item.first_name} {item.last_name} has booked you on {item.bookedDate} to {item.slot} slot</p>
                                                        <Row gutter={12}>
                                                            <Col span={8}>
                                                                <Button onClick={() => {this.acceptRequest(item)}}  style={{backgroundColor:'#40b207',color:'white'}}>Accept</Button>
                                                            </Col>
                                                            <Col>
                                                                <Button onClick={() => {this.rejectRequest(item)}}   style={{backgroundColor:'#ef4040',color:'white'}}>Reject</Button>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                </List.Item>


                                            )}
                                        />
                                    </TabPane>
                                    <TabPane tab="My Works" key="4">
                                   
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
                  {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
 
                                    </TabPane>
                                </Tabs>
                            </StickyContainer>

                        </Layout>
                    </Layout>
                </Layout>

                <Modal
                                title="Edit Profile"
                                centered
                                visible={this.state.modal2Visible}
                                onOk={() => this.updateUser()}
                                onCancel={() => this.setModal2Visible(false)}
                            >
                                 <Form onSubmit={this.handleSubmit}>
                                        <FormItem
                                        {...formItemLayout}
                                        label={(
                                            <span>
                                            First Name&nbsp;
                                            
                                            </span>
                                        )}
                                        >
                                        <Input value={userStylist.first_name} onChange={e=>this.setState({userStylist:{...userStylist,first_name:e.target.value}})}   />
                                        
                                        </FormItem>
                                        <FormItem
                                        {...formItemLayout}
                                        label={(
                                            <span>
                                            Last Name&nbsp;
                                            
                                            </span>
                                        )}
                                        >

                                        <Input  value={userStylist.last_name} onChange={e=>this.setState({userStylist:{...userStylist,last_name:e.target.value}})}   />
                                        
                                        </FormItem>
                                    
                                    
                                
                                
                                        <FormItem
                                        {...formItemLayout}
                                        label="Phone Number"
                                        >
                                        <Input value={userStylist.phone} onChange={e=>this.setState({userStylist:{...userStylist,phone:e.target.value}})}   />
                                        
                                        </FormItem>
                                    
                                    
                                        <FormItem
                                        {...formItemLayout}
                                        label="City"
                                        >

                                        <Input value={userStylist.city}  onChange={e=>this.setState({userStylist:{...userStylist,city:e.target.value}})}  />
                                        
                                        </FormItem>

                                        <FormItem
                                        {...formItemLayout}
                                        label="Charge"
                                        >

                                        <Input value={userStylist.price}  onChange={e=>this.setState({userStylist:{...userStylist,price:e.target.value}})}  />
                                        
                                        </FormItem>
                                    
                                    </Form>
                            </Modal>
            </div>


        )
    }
}
export default Profile;