import React from 'react';
import Icon from './Icon';
//--intend for server-render
const isBrowser = typeof window !== 'undefined';
const L = isBrowser ? require('leaflet') : undefined;
if (isBrowser) {
  require('leaflet_css');
  require('leaflet_markers_css');
}

/*eslint-disable react/no-multi-comp */

/* General Icons */
export const MailIcon = () => (<Icon width='20px' height='15px' iconUrl={require('../../assets/images/ic-email.svg')} />);
export const SmallClockIcon = () => (<Icon width='13px' height='13px' iconUrl={require('../../assets/images/ic-clock2.svg')} />);
export const ClockIcon = () => (<Icon width='18px' height='18px' iconUrl={require('../../assets/images/ic-clock.svg')} />);
export const FacebookIcon = () => (<Icon width='10px' height='23px' iconUrl={require('../../assets/images/ic-facebook.svg')} />);
export const LinkedInIcon = () => (<Icon width='22px' height='21px' iconUrl={require('../../assets/images/ic-linkedin.svg')} />);
export const BackIcon = () => (<Icon width='10px' height='16px' iconUrl={require('../../assets/images/btn-back.svg')} />);
export const NameIcon = () => (<Icon width='14px' height='19px' iconUrl={require('../../assets/images/ic-name.svg')} />);
export const PasswordIcon = () => (<Icon width='16.5px' height='20px' iconUrl={require('../../assets/images/ic-password.svg')} />);
export const SubmittedIcon = () => (<Icon width='60px' height='60px' iconUrl={require('../../assets/images/ic-submitted.svg')} />);
export const ViewIcon = () => (<Icon width='19px' height='11px' iconUrl={require('../../assets/images/ic-view.svg')} />);
export const LocationIcon = () => (<Icon width='36px' height='36px' iconUrl={require('../../assets/images/ic-location.svg')} />);
export const ClearLocationIcon = () => (<Icon width='18px' height='18px' iconUrl={require('../../assets/images/ic-location2.svg')} />);
export const SendMailIcon = () => (<Icon width='36px' height='36px' iconUrl={require('../../assets/images/ic-sendmail.svg')} />);
export const PhoneIcon = () => (<Icon width='36px' height='36px' iconUrl={require('../../assets/images/ic-phone.svg')} />);
export const ClearPhoneIcon = () => (<Icon width='18px' height='18px' iconUrl={require('../../assets/images/ic-phone2.svg')} />);
export const PhoneCallIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-phonecall.svg')} />);
export const GalleryIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-gallery.svg')} />);
export const TakePhotoIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-takephoto.svg')} />);
export const LogoutIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-logout.svg')} />);
export const SaveIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-save.svg')} />);
export const ProblemIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-problem.svg')} />);

/* Sidebar Icons */
export const WhiteBuildingIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-buildinginfo-2.svg')} />);
export const AboutIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-about.svg')} />);
export const HelpIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-help.svg')} />);
export const AccountIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-account.svg')} />);
export const SettingsIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-settings.svg')} />);
export const ReportIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-report-2.svg')} />);
export const MenuIcon = () => (<Icon width='18px' height='12px' iconUrl={require('../../assets/images/ic-menu.svg')} />);
export const UsersIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-users.svg')} />);
export const ServiceIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-service.svg')} />);

/* Live Icons */
export const CarwashIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-carwash.svg')} />);
export const ConciergerieIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-conciergerie.svg')} />);
export const FitnessIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-fitness.svg')} />);
export const FoodIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-fn-b.svg')} />);
export const HairdresserIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-hairdresser.svg')} />);
export const HotelIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-hotel.svg')} />);
export const LaundryIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-laundry.svg')} />);

/* Homepage */
export const MoveIcon = () => (<Icon width='47px' height='47px' iconUrl={require('../../assets/images/ic-move.svg')} />);
export const SmallMoveIcon = () => (<Icon width='30px' height='30px' iconUrl={require('../../assets/images/ic-move.svg')} />);
export const WorkIcon = () => (<Icon width='47px' height='47px' iconUrl={require('../../assets/images/ic-work.svg')} />);
export const SmallWorkIcon = () => (<Icon width='30px' height='30px' iconUrl={require('../../assets/images/ic-work.svg')} />);
export const LiveIcon = () => (<Icon width='47px' height='47px' iconUrl={require('../../assets/images/ic-live.svg')} />);
export const SmallLiveIcon = () => (<Icon width='30px' height='30px' iconUrl={require('../../assets/images/ic-live.svg')} />);
export const BuildingIcon = () => (<Icon width='15px' height='18px' iconUrl={require('../../assets/images/ic-building.svg')} />);
export const TimeHomeIcon = () => (<Icon width='26px' height='21px' iconUrl={require('../../assets/images/ic-e-t-a.svg')} />);

/* Mobility Icons */
export const VelibIcon = () => (<Icon width='33px' height='20px' iconUrl={require('../../assets/images/ic-velib.svg')} />);
export const MetroIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-metro.svg')} />);
export const BusIcon = () => (<Icon width='25px' height='25px' iconUrl={require('../../assets/images/ic-bus.svg')} />);
/* Move Icons */
export const MVVelibIcon = () => (<Icon width='49px' height='49px' iconUrl={require('../../assets/images/mv-velib.svg')} />);
export const MVPublicTransportIcon = () => (<Icon width='49px' height='49px' iconUrl={require('../../assets/images/mv-public-transport.svg')} />);
export const MVAirportIcon = () => (<Icon width='49px' height='49px' iconUrl={require('../../assets/images/mv-airport.svg')} />);
export const MVUberIcon = () => (<Icon width='49px' height='49px' iconUrl={require('../../assets/images/mv-uber.svg')} />);
export const MVAutolibIcon = () => (<Icon width='49px' height='49px' iconUrl={require('../../assets/images/mv-autolib.svg')} />);
export const MVTrafficIcon = () => (<Icon width='49px' height='49px' iconUrl={require('../../assets/images/mv-live-traffic.svg')} />);
export const MVTaxiIcon = () => (<Icon width='49px' height='49px' iconUrl={require('../../assets/images/mv-taxi.svg')} />);

export const AddIcon = () => (<Icon width='20px' height='20px' iconUrl={require('../../assets/images/ic-add.svg')} />);
export const RemoveIcon = () => (<Icon width='20px' height='20px' iconUrl={require('../../assets/images/ic-remove.svg')} />);

/* Button Icons */
export const ListViewIcon = () => (<Icon width='18px' height='12px' iconUrl={require('../../assets/images/ic-menu.svg')} />);
export const MapViewIcon = () => (<Icon width='24px' height='16px' iconUrl={require('../../assets/images/ic-move.svg')} />);

/* Meeting room Icons */
export const CapacityIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-capacity.svg')} />);
export const SmallCapacityIcon = () => (<Icon width='22px' height='22px' iconUrl={require('../../assets/images/ic-capacity.svg')} />);
export const CateringIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-catering.svg')} />);
export const SmallCateringIcon = () => (<Icon width='22px' height='22px' iconUrl={require('../../assets/images/ic-catering.svg')} />);

/* Map Marker Icons*/
export const FoodMarkerIcon = isBrowser && L.icon({
    iconUrl: require('../../assets/images/ic-fn-b.svg'),
    iconSize: [30, 30], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});
// export const CarwashIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-carwash.svg')} />);
// export const ConciergerieIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-conciergerie.svg')} />);
// export const FitnessIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-fitness.svg')} />);
// export const FoodIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-fn-b.svg')} />);
// export const HairdresserIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-hairdresser.svg')} />);
// export const HotelIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-hotel.svg')} />);
// export const LaundryIcon = () => (<Icon width='32px' height='32px' iconUrl={require('../../assets/images/ic-laundry.svg')} />);
