import moment from 'moment';
const convert = (minutes) => {
  return {
    hour: parseInt(minutes / 60),
    minutes: minutes % 60
  };
};
const time = {
  formatToString: (minutes) => {
    const time = convert(minutes);
    const hourStr = ('0' + time.hour).slice(-2);
    const minutesStr = ('0' + time.minutes).slice(-2);
    return `${hourStr}:${minutesStr}`;
  },
  amPmToHours: (time) => {
    let hours = Number(time.match(/^(\d+)/)[1]);
    let minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1].toUpperCase();
    if (AMPM === "PM" && hours < 12) hours = hours + 12;
    if (AMPM === "AM" && hours === 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return (sHours + ':' + sMinutes);
  },
  nowIsInTime: (timeStart, timeEnd) => {
    // const date = new Date();
    // const nowTimeStr = date.getHours() + ':' + date.getMinutes();
    // return timeStart <= nowTimeStr && nowTimeStr <= timeEnd;
    const start = moment(timeStart, 'HH:mm');
    const end = moment(timeEnd, 'HH:mm');
    return moment().isBetween(start, end);
  },
  // format iso8601 for time string YYYYMMDDTHHmmss. ex: 20160915T071800
  formatISO8601: (timeStr) => {
    const year = timeStr.slice(0, 4);
    const month = timeStr.slice(4, 6);
    const day = timeStr.slice(6, 8);
    const hour = timeStr.slice(9, 11);
    const minute = timeStr.slice(11, 13);
    const second = timeStr.slice(13, 15);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
  },
  // get the locale time from datetime
  localeTimeFromDatetime: (datetime) => {
    // const dt = moment(new Date(datetime));
    // let hours = dt.hours();
    const index = datetime.indexOf(':');
    let hours = parseInt(datetime.substr(0, 2));
    hours = hours < 10 ? `0${hours}` : hours;
    // let minutes = dt.minutes();
    let minutes = parseInt(datetime.substr(index + 1, 2));
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return hours + ':' + minutes;
  },
  // convert to GMT time from time (HH:mm)
  convertToGMTFromTime: (time) => {
    const index = time.indexOf(':');
    let hours = parseInt(time.substr(0, 2));
    let minutes = parseInt(time.substr(index + 1, 2));
    let utcTime = moment().utc();
    utcTime.hours(hours);
    utcTime.minutes(minutes);
    return moment(utcTime.toDate());
  }
};
export default time;
