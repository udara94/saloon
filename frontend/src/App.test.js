import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { configure, shallow } from 'enzyme';
import chai,{ expect } from 'chai';
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() });

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });
// describe('App component testing', function() {
//   it('renders welcome message', function() {
//     const wrapper = shallow(<App />); 
//     const welcome = <h1 className='App-title'>Welcome to React</h1>;
//     expect(wrapper.contains(welcome)).to.equal(true);
//   });
// });

describe('/POST location', () => {
  it('send location testing Testing', (done) => {
   
   let location={
     lat:6.93197, 
    lng:79.8577
   }
  chai.request('http://localhost:3000')
  
  .post('http://localhost:8080/stylist/location')
  .send(location)
  .end((err, res) => {
  chai.expect(res.status).to.equal(200);
  done();
  });
  });
  });