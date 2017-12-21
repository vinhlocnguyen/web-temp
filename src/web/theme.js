import {
  white,
  blueGrey500,
  darkBlack,
  red500
} from 'material-ui/styles/colors';

import { fade } from 'material-ui/utils/colorManipulator';
import Spacing from 'material-ui/styles/spacing';
import zIndex from 'material-ui/styles/zIndex';
import typography from 'material-ui/styles/typography';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const Colors = {
  FlatTurtleBlue: '#20AFD6',
  BackgroundColor: '#FFFFFF',
  PrimaryTextColor: '#4A4A4A',
  SecondaryTextColor: '#FFFFFF',
  LinkColor: '#0874BA',
  LinkedIn: '#0976B4',
  Facebook: '#3B5998'
};

const Palette = {
  primary1Color: Colors.FlatTurtleBlue,
  primary2Color: white,
  primary3Color: blueGrey500,
  accent1Color: Colors.FlatTurtleBlue,
  accent2Color: Colors.FlatTurtleBlue,
  accent3Color: Colors.FlatTurtleBlue,
  textColor: darkBlack,
  alternateTextColor: Colors.FlatTurtleBlue,
  canvasColor: Colors.FlatTurtleBlue,
  disabledColor: blueGrey500,
  pickerHeaderColor: Colors.FlatTurtleBlue
};

const Theme = getMuiTheme({
  spacing: Spacing,
  zIndex: zIndex,
  fontFamily: 'Soho Gothic W01 Light, sans-serif',
  palette: Palette,
  textField: {
    floatingLabelColor: Palette.primary1Color,
    focusColor: Palette.primary1Color,
    textColor: Palette.textColor,
    hintColor: fade(Palette.textColor, 0.75),
    disabledTextColor: Palette.disabledColor,
    errorColor: red500,
    backgroundColor: 'transparent',
    borderColor: Palette.borderColor
  },
  raisedButton: {
    primaryColor: Palette.primary1Color,
    primaryTextColor: Palette.textColor,
    secondaryColor: Palette.primary2Color,
    secondaryTextColor: Palette.alternateTextColor
  },
  floatingActionButton: {
    buttonSize: 70,
    miniSize: 40,
    color: Palette.primary2Color,
    iconColor: Palette.alternateTextColor,
    secondaryColor: Palette.accent1Color,
    secondaryIconColor: Palette.textColor,
    disabledTextColor: Palette.disabledColor
  },
  tabs: {
    backgroundColor: Palette.primary2Color,
    selectedTextColor: Palette.alternateTextColor
  },
  stepper: {
    backgroundColor: 'transparent',
    hoverBackgroundColor: fade(darkBlack, 0.06),
    iconColor: Palette.primary1Color,
    hoveredIconColor: blueGrey500,
    inactiveIconColor: Palette.primary3Color,
    textColor: Palette.textColor,
    disabledTextColor: fade(Palette.textColor, 0.4),
    connectorLineColor: Palette.textColor
  },
  paper: {
    color: Palette.alternateTextColor,
    backgroundColor: Palette.primary2Color
  },
  dialog: {
    titleFontSize: 22,
    bodyFontSize: 16,
    bodyColor: Palette.alternateTextColor
  },
  flatButton: {
    color: 'transparent',
    buttonFilterColor: '#999999',
    disabledTextColor: fade(Palette.alternateTextColor, 0.3),
    textColor: Palette.textColor,
    primaryTextColor: Palette.alternateTextColor,
    secondaryTextColor: Palette.alternateTextColor,
    fontSize: typography.fontStyleButtonFontSize,
    fontWeight: typography.fontWeightMedium
  },
  datePicker: {
    color: darkBlack,
    textColor: white,
    selectColor: Palette.primary1Color,
    calendarTextColor: darkBlack,
    selectTextColor: white
  },
  snackbar: {
    backgroundColor: white
  }
});

module.exports = {
  Theme,
  Palette,
  Colors
};
