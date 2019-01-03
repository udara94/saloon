import React from 'react';
import { Layout,Form, Input, Card,Badge, Calendar,Icon, Button,Tabs, Modal,Alert, Row, Col, List } from 'antd';
import { StickyContainer, Sticky } from 'react-sticky';
import moment from 'moment';
import './CSS/profile.css';
import './CSS/saloon.css';


const { Sider } = Layout;
const FormItem = Form.Item;
const { Meta } = Card;
const TabPane = Tabs.TabPane;





const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };

class SaloonProfile extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            comments: [],
            submitting: false,
            value: 0,
            charge: this.props.location.charge,
            available: [],
            singleStylist: [],
            bookedDates: [],
            myBookings: [],
            top: 10,
            bottom: 10,
            saloonOwner: [],
            date: new Date().toLocaleDateString('en-US', DATE_OPTIONS),
            slot: '00:00 AM-08:00 AM',
            todayDate: new Date().toLocaleDateString('en-US', DATE_OPTIONS),
            bookedDateArray: [],
            saloonName: '',
            cardNo:'',
            modal1Visible: false,
            modal2Visible: false,
            selectedValue:moment(new Date().toLocaleDateString('en-US', DATE_OPTIONS)),
            confirmedStylist:[],
            paidDays:[],
            didPayment:[],
            saloon:{
                first_name:'',
                last_name:'',
                phone:'',
                city:'',
                saloon_name:'',
                id:''
            },
            payment:{
                stylistid:'',
                stylistName:'',
                bookedDate:'',
                amount:'',
                slot:'',
                confirmid:'',
                paymentDate:''
            }  
        }
        this.getSaloonOwnerById=this.getSaloonOwnerById.bind(this)

    }

    componentDidMount() {

        this.initializeComponent()
      
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
         this.state.didPayment.forEach(element=>{
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
                 <div className="cellRender">
 
                     {
                         <List style={{ fontSize: 10 }} dataSource={arr}
                             renderItem={item => (
 
                                 <List.Item >
                                     <label>{item.first_name+" "+item.last_name}</label>
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

      getPaymentByDate (date) {
        const {saloon} =this.state;
        fetch('http://localhost:8080/stylist/getSaloonOwnerPaymentbyDate?bookedDate='+date+'&saloonOwnerID='+saloon.id)
            .then(response => response.json())
            .then(response => {
                this.setState({ paidDays: response.data });
                console.log("my booking", response.data)
            })
            .catch(err => console.error(err))

    }

      onPanelChange = (value) => {
        this.setState({ value });
      }

   
       initializeComponent() {
           const user = JSON.parse(localStorage.getItem('user'));
           if (user === null) {
            
           }
           else {
   
               this.getSaloonOwnerById(user.id)
               this.getConfirmedStylist(user.id);
               this.getDonePayment(user.id);
           }
       }

    getSaloonOwnerById (id) {
       
        fetch('http://localhost:8080/stylist/getsaloonOwner?saloonid=' + id)
            .then(response => response.json())
            .then(response => {
                this.setState({ saloonOwner: response.data });
                console.log("my profile", response.data)
                this.state.saloonOwner.forEach(element => {
                    this.setState({
                        saloon: {
                            first_name: element.first_name,
                            last_name: element.last_name,
                            phone: element.phone,
                            city: element.city,
                            saloon_name: element.saloon_name,
                            id:element.saloonid
                        }
                    })
                
                });

            })
            .catch(err => console.error(err))

    }

    getConfirmedStylist(id){
        fetch('http://localhost:8080/stylist/getconfirmedStylist?saloonOwnerID=' + id)
        .then(response => response.json())
        .then(response => {
         this.setState({confirmedStylist:response.data})
            console.log('confiremed stylist',response.data)

            this.state.confirmedStylist.forEach(element => {

                this.setState({
                    payment:{
                        stylistid:element.idstylist,
                        bookedDate:element.bookedDate,
                        amount:element.price,
                        stylistName:element.first_name,
                        confirmid:element.confirmid,
                        slot:element.slot,
                        paymentDate:new Date().toLocaleDateString('en-US', DATE_OPTIONS),
                    }
                })
    
                
            });
       
        })
        .catch(err => console.error(err))
    }
    
    getDonePayment(id){
        fetch('http://localhost:8080/stylist/getMydonePayment?saloonOwnerID=' + id)
        .then(response => response.json())
        .then(response => {
            this.setState({ didPayment: response.data });
        console.log("mydonepayment:",response.data)
        })
        .catch(err => console.error(err))
    }
   

    updateUser(){

        const {saloon} =this.state;
        fetch('http://localhost:8080/stylist/updateSaloonOwner?first_name='+saloon.first_name+'&last_name='+saloon.last_name+'&phone='+saloon.phone+'&city='+saloon.city+'&saloon_name='+saloon.saloon_name+'&saloonid='+saloon.id)
        .then(response => response.json())
        .then(response => {
           
            console.log(response)
        })
        .catch(err => console.error(err))
        this.setModal2Visible(false);
        this.getSaloonOwnerById(saloon.id)
    }


    makePayment(){
        const {saloon}=this.state
        this.setModal1Visible(false)
        console.log("payment done")
        this.addToPayment()
        this.getConfirmedStylist(saloon.id)
       
        
    }

    addToPayment(){
        const {payment} =this.state;
        const {saloon} =this.state;
        fetch('http://localhost:8080/stylist/addtoPayment?saloonOwnerID='+saloon.id+'&stylistID='+payment.stylistid+'&bookedDate='+payment.bookedDate+'&slot='+payment.slot+'&payment='+payment.amount+'&paymentDate='+payment.paymentDate+'&saloonName='+saloon.saloon_name)
        .then(response => {
           
            console.log(response)
            this.deleteFromConfirme()
        })
        .catch(err => console.error(err))

    }

    deleteFromConfirme(){
        
        const {payment}=this.state
        
        fetch('http://localhost:8080/stylist/deleteFromconfirme?confirmid='+payment.confirmid)
        .then(response => {
           
            console.log(response)
            this.getDonePayment(this.state.saloon.id)
        })
        .catch(err => console.error(err))
    }


    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible });
        
    }

    
    setModal1Visible(element,modal1Visible) {
        this.setState({ modal1Visible });

        console.log("in side setmodel visible",element)
        
    }



    render() {

        const renderTabBar = (props, DefaultTabBar) => (
            <Sticky bottomOffset={80}>
                {({ style }) => (
                    <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#d9d9d9' }} />
                )}
            </Sticky>
        );

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

        const { saloonOwner } = this.state;
        const {saloon} =this.state;
        const {confirmedStylist}=this.state;
        const {payment} =this.state;
        const {didPayment}=this.state;
        const {paidDays}=this.state
        const { selectedValue } = this.state;
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
                                    <List dataSource={saloonOwner}
                                        renderItem={item => (

                                            <List.Item  >
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                        <Card>
                                                    <pre><b><Icon type="user" />Name:<li className="details" >{item.first_name + " " + item.last_name}</li></b></pre>
                                                    <pre><b><Icon type="phone" />Contact:<li className="details" >{item.phone}</li></b></pre>
                                                    <pre><b><Icon type="environment" />City:<li className="details" >{item.city}</li></b></pre>
                                                    <pre><b><Icon type="dollar" />Saloon Name:<li className="details" >{item.saloon_name}</li></b></pre>
                                                  
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
                                            <label>{item.first_name+" "+item.last_name}</label>
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
                                            <Calendar
                                        style={{  border: '1px solid #d9d9d9', borderRadius: 4 }}
                                        dateCellRender={e=>this.dateCellRender(e)}
                                        onSelect={this.onSelect} onPanelChange={this.onPanelChange} />

                               
                                    </TabPane>
                                    {/* <TabPane tab="Booked Stylists" key="2">
                                 
                                    </TabPane> */}
                                    <TabPane tab={<div><span><Badge count={confirmedStylist.length} showZero></Badge></span><span> &nbsp;&nbsp;&nbsp;Confirmed Stylist</span></div>} key="3">
                                        <List dataSource={confirmedStylist}
                                                renderItem={item => (

                                                    <List.Item  >
                                                        <Card title={item.first_name+" "+item.last_name} bordered={true} style={{width:300}} >
                                                            <p>{item.first_name} {item.last_name} has accepted your booking request made on {item.bookedDate} to {item.slot} slot. You can pay {item.payment} RS in order to complete the transaction</p>
                                                            <Row gutter={12}>
                                                                <Col span={8}>
                                                                    <Button onClick={() => {this.setModal1Visible(item,true)}}  style={{backgroundColor:'#40b207',color:'white'}}>Pay</Button>
                                                                </Col>
                                                                {/* <Col>
                                                                    <Button onClick={() => {this.rejectRequest(item)}}   style={{backgroundColor:'#ef4040',color:'white'}}>Reject</Button>
                                                                </Col> */}
                                                            </Row>
                                                        </Card>
                                                    </List.Item>


                                                )}
                                            />
                                    </TabPane>
                                    <TabPane  tab="Finished Payments"  key="4">
                                    <List grid={{ gutter: 16, column: 4 }} dataSource={didPayment}
                                                renderItem={item => (

                                                    <List.Item  >
                                                        <Card title={item.first_name+" "+item.last_name} bordered={true} style={{width:300}} >
                                                            <p>You paid {item.payment} Rs to {item.first_name} {item.last_name} stylist on {item.paymentDate}</p>
                                                         
                                                        </Card>
                                                    </List.Item>


                                                )}
                                            />
                                    </TabPane>
                                    
                                </Tabs>
                            </StickyContainer>

                            




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
                                        <Input value={saloon.first_name} onChange={e=>this.setState({saloon:{...saloon,first_name:e.target.value}})}   />
                                        
                                        </FormItem>
                                        <FormItem
                                        {...formItemLayout}
                                        label={(
                                            <span>
                                            Last Name&nbsp;
                                            
                                            </span>
                                        )}
                                        >

                                        <Input  value={saloon.last_name} onChange={e=>this.setState({saloon:{...saloon,last_name:e.target.value}})}   />
                                        
                                        </FormItem>
                                    
                                    
                                
                                
                                        <FormItem
                                        {...formItemLayout}
                                        label="Phone Number"
                                        >
                                        <Input value={saloon.phone} onChange={e=>this.setState({saloon:{...saloon,phone:e.target.value}})}   />
                                        
                                        </FormItem>
                                    
                                    
                                        <FormItem
                                        {...formItemLayout}
                                        label="City"
                                        >

                                        <Input value={saloon.city}  onChange={e=>this.setState({saloon:{...saloon,city:e.target.value}})}  />
                                        
                                        </FormItem>

                                        <FormItem
                                        {...formItemLayout}
                                        label="Saloon Name"
                                        >

                                        <Input value={saloon.saloon_name}  onChange={e=>this.setState({saloon:{...saloon,saloon_name:e.target.value}})}  />
                                        
                                        </FormItem>
                                    
                                    </Form>
                            </Modal>


                            <Modal
                                title="Payment"
                                centered
                                visible={this.state.modal1Visible}
                                onOk={() => this.makePayment()}
                                onCancel={() => this.setModal1Visible(false)}
                            >
                                 <Form onSubmit={this.handleSubmit}>
                                        <FormItem
                                        {...formItemLayout}
                                        label={(
                                            <span>
                                            Name&nbsp;
                                            
                                            </span>
                                        )}
                                        >
                                        <Input value={payment.stylistName}  disabled={true} />
                                        
                                        </FormItem>
                                        <FormItem
                                        {...formItemLayout}
                                        label={(
                                            <span>
                                            Booked Date&nbsp;
                                            
                                            </span>
                                        )}
                                        >

                                        <Input  value={payment.bookedDate}  disabled={true}  />
                                        
                                        </FormItem>
                                    
                                    
                                
                                
                                        <FormItem
                                        {...formItemLayout}
                                        label="Amount"
                                        >
                                        <Input value={payment.amount} disabled={true}  />
                                        
                                        </FormItem>
                                    
                                    
                                        <FormItem
                                        {...formItemLayout}
                                        label="Card No"
                                        >

                                        <Input value={this.state.cardNo}  onChange={e=>this.setState({cardNo:e.target.value})}  />
                                        
                                        </FormItem>

                                       
                                    
                                    </Form>
                            </Modal>








                        </Layout>
                    </Layout>
                </Layout>
            </div>


        )
    }
}
export default SaloonProfile;