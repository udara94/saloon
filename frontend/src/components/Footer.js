import React from 'react';
//import ReactDOM from 'react-dom';
import './CSS/footer.css';

class Footer extends React.Component {


  render() {


    return (

      <div>
        <footer id="main-footer" className="text-center p-4">
          <div className="container">
            <div className="row">
              <div className="col">
                <p> Eyepax Design ©2018 Created by Udara</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

    )
  }
}
export default Footer;