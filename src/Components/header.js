import React, { PureComponent } from 'react';
import logo from '../images/logoWatsoo.jpeg';
import Style from './css/trip.module.css';

// Header component  , I was unable to get the logo thats why I have used the image and also icons of logout thatswhy i have not add the logout icon

class Header extends PureComponent {
 btnClick = (value) => {
  alert(`You have clicked on ${value} button`);
 };

 render() {
  return (
   <div className={` ${Style.header} `}>
    <div className="row">
     <div className="col-sm-1 d-flex">
      <svg
       width="30px"
       height="30px"
       onClick={() => {
        this.btnClick('nav bar');
       }}
      >
       <path
        d="M20,17 C20.5522847,17 21,17.4477153 21,18 C21,18.5522847 20.5522847,19 20,19 L4,19 C3.44771525,19 3,18.5522847 3,18 C3,17.4477153 3.44771525,17 4,17 L20,17 Z M20,11 C20.5522847,11 21,11.4477153 21,12 C21,12.5522847 20.5522847,13 20,13 L4,13 C3.44771525,13 3,12.5522847 3,12 C3,11.4477153 3.44771525,11 4,11 L20,11 Z M20,5 C20.5522847,5 21,5.44771525 21,6 C21,6.55228475 20.5522847,7 20,7 L4,7 C3.44771525,7 3,6.55228475 3,6 C3,5.44771525 3.44771525,5 4,5 L20,5 Z"
        fill="white"
       />
      </svg>
     </div>
     <div className={`col-sm-5 d-flex m-0`}>
      <img src={logo} height="40px" width="100px" className={Style.logoPos} />
     </div>
     <div className="col-sm-6 justify-content-end d-flex">
      <button
       onClick={() => {
        this.btnClick('logout');
       }}
       className={Style.btn}
      >
       <spam>Logout</spam>
      </button>
     </div>
    </div>
   </div>
  );
 }
}

export default Header;
