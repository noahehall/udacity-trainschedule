import React from 'react';
import styles from './start.css';
import { connect } from 'react-redux';
import * as actionCreators from 'store/actions/index.js';
import { bindActionCreators } from 'redux';
import * as dom from 'lib/dom.js';
import Popup from 'react-popup';
import Stationinfo from 'components/stationinfo/stationinfo.js';
import * as time from 'lib/time.js';

class Start extends React.Component {
  static propTypes = {
    appError: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.object.isRequired,
    schedules: React.PropTypes.object.isRequired,
    stations: React.PropTypes.object.isRequired,
  }

  handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const
      arrive = e.currentTarget['arrive-station'].value,
      arriveDateTime = time.getBartTime(e.currentTarget['arrive-time'].value),
      depart = e.currentTarget['depart-station'].value,
      departDateTime = time.getBartTime(e.currentTarget['depart-time'].value),
      options = e.currentTarget['stations-select'].options;

    let from, to;

    try {
      to = Array.from(options).find((opt) => opt.value === arrive).dataset.abbr;
      from = Array.from(options).find((opt) => opt.value === depart).dataset.abbr;
    } catch (err) {
      return this.props.dispatch.appError('You have selected incorrect stations');
    }

    const
      departDate = departDateTime.substring(0, departDateTime.indexOf(' ')).trim(),
      departTime = departDateTime.substring(departDateTime.indexOf(' ')).trim();

    return from && to ? this.props.dispatch.getSchedules(from, to, departDate, departTime) : undefined;
  }

  getStations = (e) => {
    if (e){
      e.preventDefault();
      e.stopPropagation();

      return this.props.dispatch.getStations();
    }

    let stations;
    try {
      stations = this.props.stations.data.stations[0].station.map((station, idx) =>
        <option
          data-abbr={station.abbr}
          data-address={station.address}
          data-city={station.city}
          data-county={station.county}
          data-name={station.name}
          data-state={station.state}
          data-zipcode={station.zipcode}
          key={`${station.abbr}${idx}`}
        >
          {station.name}
        </option>
      );
    }catch (err) {
      stations = 'Please click the button above to get stations';
    }

    return stations;
  }

  getStation = (e) => {
    e.stopPropagation();
    e.preventDefault();

    let abbr;
    try {
      abbr = `${this.props.stations.data.stations[0].station.find((station) =>
        station.name[0] === e.currentTarget.value
      ).abbr[0] }`;
    } catch (err) {
      abbr = '';
    } finally {
      return dom.setNextInnerHtml(e.currentTarget, abbr);
    }
  }

  getMoreInfo = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let thisEl;
    const
      abbr = e.currentTarget.dataset.abbr,
      stationinfo = {
        abbr: undefined,
        address: undefined,
        city: undefined,
        county: undefined,
        name: undefined,
        thisEl: undefined,
        zipcode: undefined,
      };

    try {
      thisEl = this.props.stations.data.stations[0].station.find((station) =>
        station.abbr[0] === abbr
      );
      if (thisEl) {
        stationinfo.name = thisEl.name[0];
        stationinfo.abbr = thisEl.abbr[0];
        stationinfo.city = thisEl.city[0];
        stationinfo.county = thisEl.county[0];
        stationinfo.zipcode = thisEl.zipcode[0];
        stationinfo.address = thisEl.address[0];
      }
    } catch (err) {
      console.log('error in setting station info', err);
    }

    return abbr &&
      // Popup.alert(e.currentTarget.innerHTML);
      Popup.create({
        buttons: {
          // left: ['cancel'],
          right: [{
            action: (popup) => popup.close(),
            text: 'Ok',
            // className: 'special-btn', // optional
          }]
        },
        className: 'alert',
        content: <Stationinfo {...stationinfo} /> || 'No information found',
        title: stationinfo.name && `${stationinfo.name} Station Information` || 'Bart Station Information',
      });
  }

  makeScheduleForm = () =>
    <form onSubmit={this.handleSubmit}>
      <Popup
        btnClass='mm-popup__btn'
        className='mm-popup'
        closeBtn={false}
        closeHtml={null}
        defaultCancel='Cancel'
        defaultOk='Ok'
        wildClasses={false}
      />
      <p>
        <label htmlFor='depart-station'>I want to leave&nbsp;
          <input
            id='depart-station'
            list='stations'
            onChange={this.getStation}
            required
            style={{border: '2px solid black'}}
          />
          <button className='more-info sike' onClick={this.getMoreInfo} />
        </label>
      </p>
      <p>
        <label htmlFor='depart-time'>around
          <input id='depart-time' type='datetime-local' />
        </label>
      </p>
      <p>
        <label htmlFor='arrive-station'>and arrive at&nbsp;
          <input
            id='arrive-station'
            list='stations'
            onChange={this.getStation}
            required
            style={{border: '2px solid black'}}
          />
          <button className='more-info sike' onClick={this.getMoreInfo} />
        </label>
      </p>
      <label htmlFor='arrive-time'> by
        <input id='arrive-time' type='datetime-local' />
      </label>
      <datalist id='stations'>
        <select id='stations-select'>{this.getStations()}</select>
      </datalist>
      <input style={{border: '2px solid black'}} type='submit' value='Submit' />
    </form>;

  renderSchedules(){
    if (this.props.schedules.status !== 'SUCCESS' || this.props.appError.msg) return '';

    let
      arriveAt,
      leaveAt,
      scheduleDate,
      scheduleTime,
      fare,
      trips,
      trips2,
      trips3,
      trips4;

    try {
      //date = ,
      //time = this.props.schedules.data.schedule[0].time,
      trips = this.props.schedules.data.schedule[0].request[0].trip[0].$;
      trips2 = this.props.schedules.data.schedule[0].request[0].trip[1].$ || {};
      trips3 = this.props.schedules.data.schedule[0].request[0].trip[2].$ || {};
      trips4 = this.props.schedules.data.schedule[0].request[0].trip[3].$ || {};
      leaveAt = trips.origTimeMin;
      arriveAt = trips.destTimeMin;
      scheduleDate = this.props.schedules.data.schedule[0].date[0];
      scheduleTime = this.props.schedules.data.schedule[0].time[0];
      fare = trips.fare;
    } catch (e) {
      trips = leaveAt = arriveAt = fare = undefined;
      let error;
      try {
        error = `${this.props.schedules.data.message[0].error[0].text[0]}
        ${this.props.schedules.data.message[0].error[0].details[0]}`;

        return this.props.dispatch.appError(error);
      } catch (er) {
        return '';
      }
    }

    return <div style={{
      marginBottom: '10px',
      wordWrap:'break-word',
    }}>
      <div>Schedule for {scheduleDate} that leaves by {scheduleTime}</div>
      <div>the next train leaves at {leaveAt} and will arrive at {arriveAt} and cost ${fare}</div>
      See below for the next four stations <br /><br />
      <table>
        <tbody>
          <tr>
            <th>cost</th><th>leave at</th><th>arrive at</th>
          </tr>
          <tr>
            <td>${fare}</td><td>{leaveAt}</td><td>{arriveAt}</td>
          </tr>
          <tr>
            <td>${trips2.fare}</td>
            <td>{trips2.origTimeMin}</td>
            <td>{trips2.destTimeMin}</td>
          </tr>
          <tr>
            <td>${trips3.fare}</td>
            <td>{trips3.origTimeMin}</td>
            <td>{trips3.destTimeMin}</td>
          </tr>
          <tr>
            <td>${trips4.fare}</td>
            <td>{trips4.origTimeMin}</td>
            <td>{trips4.destTimeMin}</td>
          </tr>
        </tbody>
      </table>
    </div>;
  }

  renderErrors() {
    const error = this.props.appError.msg;

    return error ? <h1>{this.props.appError.msg}</h1> : '';
  }

  render() {
    return (
      <div className='start'>
        <style scoped type='text/css'>{styles}</style>
        {this.renderErrors()}
        <h2>Lets get started!</h2>
        {this.renderSchedules()}
        <form onSubmit={this.getStations}>
          <input style={{border: '2px solid black'}} type='submit' value='Update Stations' />
        </form>
        {
          this.props.stations.status === 'SUCCESS' ?
            this.makeScheduleForm():
            'Please get current list of stations'
        }
      </div>
    );
  }
}

const mapStateToProps = (state) =>
  ({
    appError: state.appError,
    schedules: state.gotSchedules,
    stations: state.gotStations,
  });

const mapDispatchToProps = (dispatch) =>
  ({
    dispatch: bindActionCreators(actionCreators, dispatch),
  });

export default connect(mapStateToProps, mapDispatchToProps)(Start);
