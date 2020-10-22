import React, { PureComponent } from 'react';
import Header from './header';
import _ from 'lodash';
import Style from './css/trip.module.css';
import axios from 'axios';

/**
 * Component to display all the data of trip in the form of tables .
 * Note : Here I have not add many icons because due to insufficient of time i was unable to find out the exact icons .
 */
class TripTable extends PureComponent {
 constructor(props) {
  super(props);
  {
   this.state = {
    tripData: [],
    fromDate: '',
    toDate: '',
   };
  }
 }

 componentDidMount() {
  this.getTripData(1582156800000, 1593613371659);
 }

 /**
  *  it is used for searching the data on the basis of selection of dates.
  */
 searchData = () => {
  const { fromDate, toDate } = this.state;
  const fromDay = new Date(fromDate).getTime();
  const toDay = new Date(toDate).getTime();
  this.getTripData(fromDay, toDay);
 };

 /**
  *  It will execute when any button clicked . it shows the alert dialog box to inform which button has clicked.
  */
 btnClick = (btnName) => {
  alert(`You have clicked ${btnName} button`);
 };

 /**
  *  In this method , We are calling the api for getting data .
  *  we are not using redux that's why I have integrate it here otherwise we will integrate this in our reducer .
  */
 getTripData = (fromDate, toDate) => {
  axios({
   url:
    'http://amazon.watsoo.com/watsoo-amazon-api//trip-controller-web/v1/vehicle/wise/summary/01',
   method: 'post',
   data: {
    clientId: 10,
    dataRecord: {
     userRoleId: 4,
     userRoleName: 'COMPANY',
     userId: 10,
    },
    fromDate,
    toDate,
   },
   responseType: 'json',
  })
   .then((response) => {
    if (response.data.responseCode === 4000) {
     alert('No record found');
    }
    this.setState({
     tripData: response.data.data,
    });
   })
   .catch((err) => {
    alert('something went wrong!');
   });
 };

 /**
  *  It is used to convert the time into hour and minutes and return the formatted time output on the basis of format argument.
  */
 msToTime = (duration, format) => {
  let seconds = Math.floor((duration / 1000) % 60),
   minutes = Math.floor((duration / (1000 * 60)) % 60),
   hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  if (format) {
   return hours + ' Hrs ' + minutes + ' Minutes ';
  }
  return hours + ':' + minutes;
 };

 render() {
  const { tripData } = this.state;
  let tripDetails = [];
  let vehicleNo = '';
  let totaltrip = '';
  let totalKm = '';
  let totalTime = '';
  let tripTime = '';
  let totalExp = '';
  let showtables = [];
  if (tripData) {
   tripDetails = _.get(tripData, 'tripDetails', []);
   vehicleNo = _.get(tripData, 'vehicleNo', '');
   totaltrip = _.get(tripData, 'totalTrips', '');
   totalKm = _.get(tripData, 'totalKm', '');
   totalTime = _.get(tripData, 'totalTime', '');
   tripTime = _.get(tripData, 'totalTripTime', '');
   totalExp = _.get(tripData, 'totalExpences', '');
  }
  let tableBody = [];
  if (tripDetails.length > 0) {
   tripDetails.map((items) => {
    tableBody = [];
    let startDay = new Date(Number(items.startDay));
    let endDay = new Date(Number(items.endDay));
    let dailyRunningTime = this.msToTime(
     Number(items.dailyRunningTime),
     'format'
    );
    let totalkm = 0;
    let totalExpenses = 0;
    items.tripLists.map((item, index) => {
     const startTripTime = new Date(Number(item.startTripDate));
     const endTripDate = new Date(Number(item.endTripDate));
     const tripTime = this.msToTime(
      Number(item.startTripDate) - Number(item.endTripDate),
      'format'
     );
     totalkm = totalkm + Number(item.totalKm);
     let tripExpenses = 0;
     if (item.tripExpenses.length > 0) {
      item.tripExpenses.map((amt) => {
       tripExpenses = tripExpenses + amt.amount;
      });
     }
     totalExpenses = totalExpenses + tripExpenses;
     tableBody.push(
      <tbody>
       <tr>
        <td>{index + 1}</td>
        <td>
         <spam className={Style.text} style={{ color: 'black' }}>
          {`${
           item.startPointNode
          }(${startTripTime.getHours()}:${startTripTime.getMinutes()})`}
          <svg
           width="19px"
           height="19px"
           style={{ margin: '0px' }}
           viewBox="0 0 24 24"
          >
           <path
            d="M13.7071068,6.29289322 L18.7071068,11.2928932 C18.7355731,11.3213595 18.7623312,11.3515341 18.787214,11.3832499 L18.7071068,11.2928932 C18.7425008,11.3282873 18.774687,11.3656744 18.8036654,11.4046934 C18.8215099,11.4288693 18.8382813,11.453725 18.8539326,11.4793398 C18.8613931,11.4913869 18.8685012,11.5036056 18.8753288,11.5159379 C18.8862061,11.5357061 18.8966234,11.5561086 18.9063462,11.5769009 C18.914321,11.5939015 18.9218036,11.6112044 18.9287745,11.628664 C18.9366843,11.6484208 18.9438775,11.6682023 18.9504533,11.6882636 C18.9552713,11.7031487 18.9599023,11.7185367 18.9641549,11.734007 C18.9701664,11.7555635 18.9753602,11.7772539 18.9798348,11.7992059 C18.9832978,11.8166247 18.9863719,11.834051 18.9889822,11.8515331 C18.9920328,11.8714753 18.9944666,11.892114 18.9962623,11.912935 C18.9978436,11.9317345 18.9989053,11.9497336 18.9994829,11.9677454 C18.9998183,11.9777892 19,11.9888734 19,12 L18.9994506,12.0332468 C18.9988772,12.050591 18.997855,12.0679231 18.996384,12.0852242 L19,12 C19,12.0506203 18.9962388,12.1003621 18.9889807,12.1489612 C18.9863719,12.165949 18.9832978,12.1833753 18.9797599,12.2007258 C18.9753602,12.2227461 18.9701664,12.2444365 18.964279,12.2658396 C18.9599023,12.2814633 18.9552713,12.2968513 18.9502619,12.3121425 C18.9438775,12.3317977 18.9366843,12.3515792 18.928896,12.3710585 C18.9218036,12.3887956 18.914321,12.4060985 18.9063266,12.4232215 C18.8966234,12.4438914 18.8862061,12.4642939 18.8751242,12.484277 C18.8685012,12.4963944 18.8613931,12.5086131 18.8540045,12.5207088 C18.8382813,12.546275 18.8215099,12.5711307 18.8036865,12.5951593 C18.7982466,12.602603 18.7927155,12.6098424 18.7870723,12.6170223 C18.7849289,12.6196628 18.7826279,12.6225624 18.7803112,12.625449 L18.7071068,12.7071068 L18.7071068,12.7071068 L13.7071068,17.7071068 C13.3165825,18.0976311 12.6834175,18.0976311 12.2928932,17.7071068 C11.9023689,17.3165825 11.9023689,16.6834175 12.2928932,16.2928932 L15.585,13 L6,13 C5.44771525,13 5,12.5522847 5,12 C5,11.4477153 5.44771525,11 6,11 L15.585,11 L12.2928932,7.70710678 C11.9023689,7.31658249 11.9023689,6.68341751 12.2928932,6.29289322 C12.6834175,5.90236893 13.3165825,5.90236893 13.7071068,6.29289322 Z"
            fill="#6fabd3"
           />
          </svg>
          {`${
           item.endPointNode
          }(${endTripDate.getHours()}:${endTripDate.getMinutes()})`}{' '}
         </spam>
        </td>
        <td>
         <spam className={Style.text} style={{ color: 'black' }}>
          {`${item.driverName}`}{' '}
         </spam>
        </td>
        <td>
         <spam className={Style.text} style={{ color: 'black' }}>
          Rs.{tripExpenses}
          <svg
           width="19px"
           height="19px"
           style={{ marginTop: '5px', float: 'right' }}
           viewBox="0 0 24 24"
          >
           <path
            d="M12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 Z M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,10.5 C11.4477153,10.5 11,10.9477153 11,11.5 L11,11.5 L11,15.5 C11,16.0522847 11.4477153,16.5 12,16.5 C12.5522847,16.5 13,16.0522847 13,15.5 L13,15.5 L13,11.5 C13,10.9477153 12.5522847,10.5 12,10.5 Z M12,7 C11.4477153,7 11,7.44771525 11,8 C11,8.55228475 11.4477153,9 12,9 C12.5522847,9 13,8.55228475 13,8 C13,7.44771525 12.5522847,7 12,7 Z"
            fill="#6fabd3"
           />
          </svg>
         </spam>
        </td>
        <td>
         <spam className={Style.text} style={{ color: 'black' }}>
          {`${item.totalKm} km`}{' '}
         </spam>
        </td>
        <td>
         <spam className={Style.text} style={{ color: 'black' }}>
          {`0.00km`}{' '}
         </spam>
        </td>
        <td>
         <spam className={Style.text} style={{ color: 'black' }}>
          {`${tripTime}`}{' '}
         </spam>
        </td>
        <td>
         <spam className={Style.text} style={{ color: 'black' }}>
          {`${item.startODOMeter} `}
          <svg
           width="19px"
           height="19px"
           style={{ margin: '0px' }}
           viewBox="0 0 24 24"
          >
           <path
            d="M13.7071068,6.29289322 L18.7071068,11.2928932 C18.7355731,11.3213595 18.7623312,11.3515341 18.787214,11.3832499 L18.7071068,11.2928932 C18.7425008,11.3282873 18.774687,11.3656744 18.8036654,11.4046934 C18.8215099,11.4288693 18.8382813,11.453725 18.8539326,11.4793398 C18.8613931,11.4913869 18.8685012,11.5036056 18.8753288,11.5159379 C18.8862061,11.5357061 18.8966234,11.5561086 18.9063462,11.5769009 C18.914321,11.5939015 18.9218036,11.6112044 18.9287745,11.628664 C18.9366843,11.6484208 18.9438775,11.6682023 18.9504533,11.6882636 C18.9552713,11.7031487 18.9599023,11.7185367 18.9641549,11.734007 C18.9701664,11.7555635 18.9753602,11.7772539 18.9798348,11.7992059 C18.9832978,11.8166247 18.9863719,11.834051 18.9889822,11.8515331 C18.9920328,11.8714753 18.9944666,11.892114 18.9962623,11.912935 C18.9978436,11.9317345 18.9989053,11.9497336 18.9994829,11.9677454 C18.9998183,11.9777892 19,11.9888734 19,12 L18.9994506,12.0332468 C18.9988772,12.050591 18.997855,12.0679231 18.996384,12.0852242 L19,12 C19,12.0506203 18.9962388,12.1003621 18.9889807,12.1489612 C18.9863719,12.165949 18.9832978,12.1833753 18.9797599,12.2007258 C18.9753602,12.2227461 18.9701664,12.2444365 18.964279,12.2658396 C18.9599023,12.2814633 18.9552713,12.2968513 18.9502619,12.3121425 C18.9438775,12.3317977 18.9366843,12.3515792 18.928896,12.3710585 C18.9218036,12.3887956 18.914321,12.4060985 18.9063266,12.4232215 C18.8966234,12.4438914 18.8862061,12.4642939 18.8751242,12.484277 C18.8685012,12.4963944 18.8613931,12.5086131 18.8540045,12.5207088 C18.8382813,12.546275 18.8215099,12.5711307 18.8036865,12.5951593 C18.7982466,12.602603 18.7927155,12.6098424 18.7870723,12.6170223 C18.7849289,12.6196628 18.7826279,12.6225624 18.7803112,12.625449 L18.7071068,12.7071068 L18.7071068,12.7071068 L13.7071068,17.7071068 C13.3165825,18.0976311 12.6834175,18.0976311 12.2928932,17.7071068 C11.9023689,17.3165825 11.9023689,16.6834175 12.2928932,16.2928932 L15.585,13 L6,13 C5.44771525,13 5,12.5522847 5,12 C5,11.4477153 5.44771525,11 6,11 L15.585,11 L12.2928932,7.70710678 C11.9023689,7.31658249 11.9023689,6.68341751 12.2928932,6.29289322 C12.6834175,5.90236893 13.3165825,5.90236893 13.7071068,6.29289322 Z"
            fill="#6fabd3"
           />
          </svg>
          {`${item.endODOMeter} `}
         </spam>
        </td>
        <td>
         <button
          onClick={() => {
           this.btnClick('movement report');
          }}
          className={Style.btn}
          style={{ background: 'darkcyan' }}
         >
          <spam className={Style.text}>Movement Report</spam>
         </button>
         <button
          onClick={() => {
           this.btnClick('stoppage report');
          }}
          className={`${Style.btn} ml-1`}
          style={{ background: 'darkcyan' }}
         >
          <spam className={Style.text}>Stoppage Report</spam>
         </button>
        </td>
       </tr>
      </tbody>
     );
    });

    showtables.push(
     <div className={`container-fluid ml-0 mt-3 ${Style.tableContainer}`}>
      <div className={`row ${Style.tableHeader}`}>
       <div className="col-sm-6">
        <spam className={Style.text}>
         {`Date:${startDay.getMonth()}/${startDay.getDate()}/${startDay.getFullYear()} at ${startDay.getHours()}:${startDay.getMinutes()} - ${endDay.getMonth()}/${endDay.getDate()}/${endDay.getFullYear()} at ${endDay.getHours()}:${endDay.getMinutes()} (${dailyRunningTime})`}
        </spam>
       </div>
       <div className={`col-sm-4 `}>
        <spam className={Style.text} style={{ color: '#6fabd3' }}>
         Total KM : {totalkm} KM
        </spam>
        <spam className={Style.text} style={{ color: 'yellow' }}>
         Total Expense: {totalExpenses}
        </spam>
       </div>
       <div className="col-sm-2 justify-content-end d-flex">
        <svg width="30px" height="20px">
         <path
          d="M6,13 C5.44771525,13 5,12.5522847 5,12 C5,11.4477153 5.44771525,11 6,11 L18,11 C18.5522847,11 19,11.4477153 19,12 C19,12.5522847 18.5522847,13 18,13 L6,13 Z"
          fill="white"
         />
        </svg>
       </div>
      </div>
      <div className="row mt-3">
       <div className="col-sm-12 justify-content-center d-flex">
        <div className="table-responsive-xl">
         <table className="table text-nowrap table-bordered">
          <thead>
           <tr className={Style.tableRowHeader}>
            <th scope="col">
             <spam className={Style.text}>#</spam>
            </th>
            <th scope="col">
             <spam className={Style.text}>
              Trip Starts(Node) to Trip Ends(Node)
             </spam>
            </th>
            <th scope="col">
             <spam className={Style.text}>Driver Name</spam>
            </th>
            <th scope="col">
             <spam className={Style.text}>Trip Expenses</spam>
            </th>
            <th scope="col">
             <spam className={Style.text}>Trip Km</spam>
            </th>
            <th scope="col">
             <spam className={Style.text}>Trip GPS Km</spam>
            </th>
            <th scope="col">
             <spam className={Style.text}>Trip time</spam>
            </th>
            <th scope="col">
             <spam className={Style.text}>Odometer reading</spam>
            </th>
            <th>
             <spam className={Style.text}>Actions</spam>
            </th>
           </tr>
          </thead>
          {tableBody}
         </table>
        </div>
       </div>
      </div>
     </div>
    );
   });
  }
  return (
   <div>
    <Header />
    <div className="container-fluid mt-4">
     <div className="row">
      <div className="col-sm-3">
       <p className="p-0 m-0">Trip Summary</p>
       <spam className={`${Style.text2} p-0`} style={{ color: 'blue' }}>
        Dashboard{' '}
       </spam>{' '}
       <spam style={{ color: 'gray' }}>/ </spam>
       <spam className={`${Style.text2} p-0`}>Trip Summary</spam>
      </div>
      <div className="col-sm-9 align-items-center justify-content-end d-flex">
       <form onSubmit={this.searchData}>
        <label className="ml-1 mt-2">
         <spam className={`${Style.text2} mr-2`}>From</spam>
         <input
          type="date"
          name="fromDate"
          onChange={(e) => {
           this.setState({ fromDate: e.target.value });
          }}
          className={`${Style.dateInput}`}
         />
        </label>
        <label className="ml-1 ">
         <spam className={`${Style.text2} mr-2`}>To</spam>
         <input
          type="date"
          name="toDate"
          onChange={(e) => {
           this.setState({ toDate: e.target.value });
          }}
          className={`${Style.dateInput}`}
         />
        </label>
        <button
         type="button"
         onClick={this.searchData}
         className={`${Style.btnSearch} ml-1`}
        >
         {' '}
         <svg
          width="19px"
          height="19px"
          style={{ margin: '0px' }}
          viewBox="0 0 24 24"
         >
          <path
           d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,4 C14.8659932,4 18,7.13400675 18,11 C18,12.5723496 17.4815869,14.0236173 16.6063605,15.1922034 L19.7071068,18.2928932 C20.0976311,18.6834175 20.0976311,19.3165825 19.7071068,19.7071068 C19.3165825,20.0976311 18.6834175,20.0976311 18.2928932,19.7071068 L15.1922034,16.6063605 C14.0236173,17.4815869 12.5723496,18 11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 Z"
           fill="white"
          />
         </svg>
        </button>
       </form>
       <button
        onClick={() => this.btnClick('export')}
        className={`${Style.btnExport} ml-1`}
       >
        <svg
         width="19px"
         height="19px"
         style={{ margin: '0px' }}
         viewBox="0 0 24 24"
        >
         <path
          d="M21,15 C21.5522847,15 22,15.4477153 22,16 L22,19.5 C22,20.8807119 20.8807119,22 19.5,22 L4.5,22 C3.11928813,22 2,20.8807119 2,19.5 L2,16 C2,15.4477153 2.44771525,15 3,15 C3.55228475,15 4,15.4477153 4,16 L4,19.5 C4,19.7761424 4.22385763,20 4.5,20 L19.5,20 C19.7761424,20 20,19.7761424 20,19.5 L20,16 C20,15.4477153 20.4477153,15 21,15 Z M12,2 L12.0193545,2.00018615 C12.042681,2.00063489 12.0659949,2.00189498 12.0892501,2.00396641 L12,2 C12.0506203,2 12.1003621,2.00376119 12.1489612,2.01101934 C12.165949,2.01362808 12.1833753,2.01670217 12.2007258,2.02024007 C12.2227461,2.0246398 12.2444365,2.02983363 12.2658396,2.03572097 C12.2814633,2.04009773 12.2968513,2.04472872 12.3121425,2.04973809 C12.3317977,2.05612249 12.3515792,2.06331574 12.3710585,2.07110396 C12.3887956,2.07819642 12.4060985,2.08567905 12.4232215,2.09367336 C12.4438914,2.10337664 12.4642939,2.11379392 12.484277,2.12487577 C12.4963944,2.13149883 12.5086131,2.13860692 12.5207088,2.14599545 C12.546275,2.1617187 12.5711307,2.17849009 12.5951593,2.19631351 C12.602603,2.20175344 12.6098424,2.20728448 12.6170223,2.21292769 C12.6196628,2.21507113 12.6225624,2.2173721 12.625449,2.21968877 L12.7071068,2.29289322 L12.7071068,2.29289322 L17.7071068,7.29289322 C18.0976311,7.68341751 18.0976311,8.31658249 17.7071068,8.70710678 C17.3165825,9.09763107 16.6834175,9.09763107 16.2928932,8.70710678 L13,5.414 L13,15 C13,15.5522847 12.5522847,16 12,16 C11.4477153,16 11,15.5522847 11,15 L11,5.414 L7.70710678,8.70710678 C7.31658249,9.09763107 6.68341751,9.09763107 6.29289322,8.70710678 C5.90236893,8.31658249 5.90236893,7.68341751 6.29289322,7.29289322 L11.2928932,2.29289322 L11.374551,2.21968877 C11.3774376,2.2173721 11.3803372,2.21507113 11.3832499,2.21278596 L11.2928932,2.29289322 C11.3282873,2.25749917 11.3656744,2.22531295 11.4046934,2.19633458 C11.4288693,2.17849009 11.453725,2.1617187 11.4793398,2.14606743 C11.4913869,2.13860692 11.5036056,2.13149883 11.5159379,2.12467117 C11.5357061,2.11379392 11.5561086,2.10337664 11.5769009,2.09365378 C11.5939015,2.08567905 11.6112044,2.07819642 11.628664,2.07122549 C11.6484208,2.06331574 11.6682023,2.05612249 11.6882636,2.04954668 C11.7031487,2.04472872 11.7185367,2.04009773 11.734007,2.03584514 C11.7555635,2.02983363 11.7772539,2.0246398 11.7992059,2.02016515 C11.8166247,2.01670217 11.834051,2.01362808 11.8515331,2.0110178 C11.8705042,2.00811223 11.890153,2.00576612 11.909968,2.00399798 C11.9343349,2.0018656 11.9579802,2.00059932 11.9816379,2.00016755 C11.9872016,2.00006024 11.9935938,2 12,2 Z"
          fill="#fff"
         />
        </svg>
        <spam className={Style.text} style={{ color: 'blue' }}>
         Export
        </spam>
       </button>
      </div>
     </div>
     <div className="row">
      <div className="col-sm-2 mr-1 mt-1">
       <div className={`${Style.racBox}`}>
        <p className={Style.text}>{vehicleNo}</p>
       </div>
       <div className={`${Style.racBox} mt-2`} style={{ background: 'green' }}>
        <p className={`${Style.text}`}>
         <svg
          width="19px"
          height="19px"
          style={{ margin: '0px' }}
          viewBox="0 0 24 24"
         >
          <path
           d="M12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 Z M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,6 C11.4477153,6 11,6.44771525 11,7 L11,7 L11,12 C11,12.5522847 11.4477153,13 12,13 L12,13 L17,13 C17.5522847,13 18,12.5522847 18,12 C18,11.4477153 17.5522847,11 17,11 L17,11 L13,11 L13,7 C13,6.44771525 12.5522847,6 12,6 Z"
           fill="#fff"
          />
         </svg>
         Trip Time : {this.msToTime(Number(tripTime), 'format')}
        </p>
       </div>
      </div>
      <div className="col-sm-2 mr-1 mt-1">
       <div className={`${Style.racBox}`} style={{ background: '#CCCC00' }}>
        <p className={Style.text}>Total Trip : {totaltrip}</p>
       </div>
       <div className={`${Style.racBox} mt-2`} style={{ background: 'purple' }}>
        <p className={Style.text}>
         <svg
          width="19px"
          height="19px"
          style={{ margin: '0px' }}
          viewBox="0 0 24 24"
         >
          <path
           d="M12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 Z M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,6 C11.4477153,6 11,6.44771525 11,7 L11,7 L11,12 C11,12.5522847 11.4477153,13 12,13 L12,13 L17,13 C17.5522847,13 18,12.5522847 18,12 C18,11.4477153 17.5522847,11 17,11 L17,11 L13,11 L13,7 C13,6.44771525 12.5522847,6 12,6 Z"
           fill="#fff"
          />
         </svg>
         Total Time : {this.msToTime(Number(totalTime), 'format')}
        </p>
       </div>
      </div>
      <div className="col-sm-2 mr-1 mt-1">
       <div className={`${Style.racBox}`} style={{ background: 'blue' }}>
        <p className={Style.text}>Total KM : {totalKm}</p>
       </div>
       <div
        className={`${Style.racBox} mt-2`}
        style={{ background: '#808000	' }}
       >
        <p className={Style.text}>Total Exp : Rs.{totalExp}</p>
       </div>
      </div>
      <div
       className={`col-5 align-items-center justify-content-end d-flex ml-1`}
      >
       <div className={`${Style.othExp}`}>
        <p className={Style.text}>Other Exp: Rs.0.00</p>
       </div>
      </div>
     </div>
     <div>{showtables}</div>
    </div>
   </div>
  );
 }
}

export default TripTable;
