const enMessages = {
  // status
  "loading": "Loading ...",
  // button
  "button.edit": "Modify",
  "button.save": "Save",
  "button.previous": "Previous",
  "button.next": "Next",
  "button.finish": "Finish",
  "button.done": "Ok",
  "button.editNearByStop": "Edit nearby stops",
  "button.editMeetingRooms": "Edit meeting rooms",
  "button.viewMenu": "View menu",
  "button.viewWebsite": "Website",
  "button.deleteBuilding": "Delete building",
  "button.createService": "Create service",
  "button.cancel": "Cancel",
  "button.book": "Book",
  //error messages
  "error.unauthorized": "You need to log in to continue.",
  "error.forbidden": "You don't have permission to access this.",
  "error.badrequest": "Something went wrong with your request. If the problem persists, please contact {email}",
  "error.servererror": "Server Error",
  "error.notfound": "The page you are looking for is not found.",
  "error.conflict": "This email already exists. Please try a different one.",
  "error.payloadtoolarge": "Your file is too large.",
  "error.unknown": "We encountered an unknown error, please try again in a few minutes. If the problem persists, please contact {email}",
  "error.emptyFilter": "Please choose categories.",
  "error.addressNotFound": "Address not found. If the problem persists, please contact {email}",
  "error.maxStopsSearchDistance": "Maximum is {maxDistance} km.",
  "error.greaterThanZero": "Must be greater than 0.",
  //footer
  "footer": "Drops by",
  //Menu
  "menu.selectBuilding": "Change building",
  "menu.building": "Building info",
  "menu.reportProblem": "Report a problem",
  "menu.about": "About Drops",
  "menu.help": "Help",
  "menu.settings": "Settings",
  "menu.manageBuildings": "Manage buildings",
  "menu.manageUsers": "Manage users",
  "menu.manageServices": "Manage services",
  "menu.account": "Account",
  "menu.legal": "legal",
  //signup page
  "register.title": "Register",
  "register.firstname": "Your first name",
  "register.lastname": "Your last name",
  "register.email": "Personal email",
  "register.password": "Password",
  "register.submit": "Register",
  "register.alreadyHaveAccount": "Already have an account?",
  "register.login": "Log in",
  //login page
  "login.signup": "Don't have an account?",
  "login.signupLink": "Sign up",
  "login.forgotLink": "Forgot your password?",
  "login.email": "Email Address",
  "login.password": "Password",
  "login.submit": "Log in",
  "login.orLoginWith": "Or log in with",
  "login.facebookButton": "Facebook",
  "login.linkedinButton": "LinkedIn",
  //home page
  "homepage.hello": "Hello",
  "homepage.notification": "You have {number} {bookingText} today",
  "homepage.buttonBar.report": "Report an issue",
  "homepage.buttonBar.meeting": "Meeting rooms",
  "homepage.buttonBar.restaurant": "Restaurants nearby",
  "homepage.buttonBar.services": "Services",
  "homepage.buttonBar.map": "Map",
  "homepage.buttonBar.live": "Live",
  "homepage.buttonBar.liveDescription": "eat, sleep, drink, sweat.. nearby",
  "homepage.buttonBar.work": "Work",
  "homepage.buttonBar.workDescription": "reserve, meet, shout..",
  "homepage.buttonBar.move": "Move",
  "homepage.buttonBar.moveDescription": "taxi, uber, train, metro.. nearby",
  "homepage.mobility.home": "Ride home",
  "homepage.mobility.bus": "Next bus",
  "homepage.mobility.subway": "Next {subway}",
  "homepage.mobility.velib": "{velib}",
  //about page
  "about.title": "About Drops",
  "about.copyright": "Copyright {year} Drops by FlatTurtle",
  "about.name": "Drops.io de FlatTurtle.com",
  "about.drops": "",
  "about.contact": "Get in touch with our helpdesk: ",
  "about.version": "Version: {version}",
  //callback page
  "callback.message.success": "Succesfully verified",
  "callback.message.failure": "Something failed...",
  "callback.continue": "Continue",
  "callback.title": "Confirmation",
  "callback.description": "Please wait several seconds until the confirmation is done.",
  "callback.register": "Your email has been confirmed and your account is now active.",
  "callback.update_private_email": "Your email has been updated. Please login with your updated email",
  "callback.update_work_email": "Your work email has been updated.",
  "callback.reset_password": "Your password has been updated",
  "callback.terminate_token": "You were logged out of the device.",
  //change password page
  "changepassword.title": "Change password",
  "changepassword.current": "Current password",
  "changepassword.new": "New password",
  "changepassword.newAgain": "New password again",
  "changepassword.buttonText": "Change",
  // forgot password page
  "forgotpassword.title": "Password recovery",
  "forgotpassword.explanation": "Enter your email to recover your password",
  "forgotpassword.email": "Your email",
  "forgotpassword.buttonText": "Send",
  // retrieve password page
  "retrievepassword.title": "Retrieve password",
  "retrievepassword.new": "New password",
  "retrievepassword.newAgain": "New password again",
  "retrievepassword.buttonText": "Retrieve",
  // report page
  "report.title": "Incident report",
  "report.message": "The incident has been reported! Thank you for your feedback.",
  "report.what": "What",
  "report.where": "Where",
  "report.extra": "Give as much details as possible",
  "report.whatList": ["Temperature", "Noise", "Cleaning", "Broken", "Dangerous", "Urgent"],
  "report.whereList": ["Office", "Toilet", "Elevator", "Entrance", "Parking", "Outside"],
  "report.somethingElse": "something else",
  "report.somewhereElse": "somewhere else",
  "report.button.drop": "Drop a picture",
  "report.resolve.title": "Resolve incident report",
  "report.commentLabel": "Comment",
  "report.commentHint": "write something ...",
  "report.resolveButton": "Resolve",
  "report.resolve.successMessage": "Resolved report !",
  "report.finish.notification": "Your problem has been reported",
  "report.what.title": "What can we help you with?",
  "report.where.title": "Where can we find the problem?",
  "report.extra.title": "Please describe the problem",
  //setting page
  "account.personal": "Personal",
  "account.personal.name": "Name",
  "account.personal.email": "Email",
  "account.personal.workEmail": "Work email",
  "account.personal.phone": "Phone",
  "account.personal.language": "Language",
  "account.personal.buttonEditText": "Edit",
  "account.saveButtonText": "Update settings",
  "account.personal.updatedMessage.success": "Succesfully updated. If you have changed your email, the old one will stay there until you confirm the new one.",
  "account.personal.updatedMessage.failure": "Update failed",
  "account.transport": "Transport",
  "account.transport.updatedMessage": "Updated",
  "account.transport.methods": "Traffic",
  "account.transport.favouriteAddresses": "Favourite address",
  "account.transport.favourite.tagHint": "How do you call it (home, mom, ...)?",
  "account.transport.favourite.addressHint": "Address",
  "account.transport.button.save": "Save transport settings",
  "account.transport.updatedMessage.success": "Succesfully updated.",
  "account.transport.updatedMessage.failure": "Update failed.",
  "account.transport.confirmation.turnOffLocationMessage": "If you disable location services all the distances displayed in the app will be calculated from the building and not from your position. Are you sure you want to disable it?",
  "account.transport.confirmation.turnOffLocationMessage.yesButton": "Yes, please do it!",
  "account.transport.confirmation.turnOffLocationMessage.noButton": "No, I want to keep it!",
  "account.transport.warningMsg": "Please allow location service. If you can not allow it, please follow {link}",
  "account.transport.warningMsg.link": "these instructions",
  "account.notification": "Notification",
  "account.title": "Account",
  "account.personal.firstName_example": "Bill",
  "account.personal.email_example": "bill.gates@gmail.com",
  "account.personal.workEmail_example": "bgates@microsoft.com",
  "account.personal.phone_example": "+32 472 11 22 33",
  "account.personal.firstName": "First name",
  "account.personal.lastName": "Last name",
  "account.personal.lastName_example": "Gates",
  "account.personal.building": "My building",
  "account.personal.buttonEditPhone": "Edit number",
  "account.personal.buttonEditBuilding": "Change building",
  // User detail
  "userDetail.ownedBuildings": "Owned buildings",
  //verify phone number page
  "verifynumber.title": "Verify phone number",
  "verifynumber.number.buttonText": "Verify",
  "verifynumber.code.pin": "PIN code",
  "verifynumber.code.confirmButton": "Confirm",
  "verifynumber.code.cancelButton": "Cancel",
  //select building page
  "building.search": "Search your building",
  "building.nextButton": "Next to me",
  "building.title": "Building list",
  "building.imageCaption": "Select building",
  "building.greeting": "Hi {name}! Please choose the building you are working in.",
  "building.result": "Select your work place",
  "building.confirmDeleteMsg": "There are {count} users registered in this building.\nAre you sure that you want to delete this building? This action is irreversible!",
  //new building page
  "newBuilding.title": "New building",
  "newbuilding.nearByStops.taxi": "Taxi",
  "newbuilding.taxi.phone": "Phone",
  "newbuilding.taxi.name": "Name",
  "newbuilding.taxi.website": "Website",
  //service page
  "service.title": "Services",
  "service.name": "Name",
  "service.description": "Description",
  "service.category": "Category",
  //service edit page
  "service.edit.name": "Name",
  "service.edit.description": "Description",
  "service.edit.address": "Address",
  "service.edit.phoneNumber": "Phone number",
  "service.edit.latitude": "Latitude",
  "service.edit.longitude": "Longitude",
  "service.edit.openingHour": "Opening hour (HH:mm)",
  "service.edit.closingHour": "Closing hour (HH:mm)",
  "service.edit.category": "Category",
  "service.edit.banner": "Banner",
  "service.edit.thumbnail": "Thumbnail",
  "service.edit.updatingSuccess": "Your service was updated successfully!",
  "service.edit.linkType": "Link type",
  "service.edit.url": "URL",
  "service.edit.showOnWork": "Show on work page",
  "service.edit.hideOnMap": "Hide map button",
  //mobility page
  "mobility.autolib": "Autolib",
  "mobility.bus": "Bus",
  "mobility.metro": "Metro",
  "mobility.velib": "Velib",
  "mobility.train": "Train",
  // list user page
  "listUser.title": "List User",
  "listUser.dialog.admin": "Is admin?",
  "listUser.dialog.name": "Name",
  "listUser.dialog.privateEmail": "Private email",
  "listUser.dialog.workEmail": "Work email",
  "listUser.searching": "Search for a user",
  "listUser.removingSuccess": "User removed!",
  "listUser.confirmDeleteUser": "Are you sure?",
  //building info page
  "buildingInfo.change": "Change",
  "buildingInfo.hello": "Hello!",
  "buildingInfo.name": "Name",
  "buildingInfo.openingHours": "Opening hours",
  "buildingInfo.openingHour": "Opening hour",
  "buildingInfo.closingHour": "Closing hour",
  "buildingInfo.address": "Address",
  "buildingInfo.address.street": "Street",
  "buildingInfo.address.city": "City",
  "buildingInfo.address.country": "Country",
  "buildingInfo.phone": "Phone (Concierge)",
  "buildingInfo.email": "Email (Concierge)",
  "buildingInfo.owner": "Owned by",
  "buildingInfo.report": "Report a problem",
  "buildingInfo.submit": "Save",
  "buildingInfo.updatingSuccess": "Building updated!",
  "buildingInfo.banner": "Main banner",
  "buildingInfo.latitude": "Latitude",
  "buildingInfo.longitude": "Longitude",
  "buildingInfo.DeleteBuilingSuccess": "Delete building successful!",
  "buildingInfo.hasMeetingRoom": "Has meeting room?",
  "buildingInfo.isActive": "Is active?",
  // New translations
  "menu.logout": "Sign out",
  "help.faq": "Frequently asked questions",
  // Live page
  "livePage.title": "Live",
  "livePage.notServiceFound": "No service found",
  // Live detail
  "liveDetail.view_on_map": "Show on map",
  "liveDetail.information": "General information",
  "liveDetail.call_for_booking": "Call to book",

  "moveList.title": "Move",
  "workPage.title": "Work",
  "workPage.report_a_problem_button": "Report a problem",
  "workPage.notification": "You have {countView} {count, plural, one {meeting} other {meetings}} starting soon!",
  "workPage.list_meeting_room_button": "List meeting room",
  "workPage.calendar_view_button": 'Meeting room calendar',

  "loginPage.wrong_username_password": "Connection refused. Incorrect email or password.",
  "error.title": "",
  "dialog.close": "Close",
  "dialog.no": "No",
  "dialog.yes": "Yes",

  "verifynumber.explanation.number": "Please fill in your phone number. A verification code will be sent to you.",
  "verifynumber.explanation.code": "Please fill in the code that you received on your phone.",
  "verifynumber.number.example": "+32 472 01 23 45",

  "transport.velib": "Velib",
  "transport.rer": "RER",
  "transport.bus": "Bus",
  "transport.tramway": "Tramway",
  "transport.noStopFound": "No stops found",
  "transport.loading": "Loading data...",
  // timetable
  "timetable.notScheduleFound": "No schedule found",

  "coming_soon": "Coming soon",
  //new building
  "newbuilding.information.title": "Information",
  "newbuilding.nearByStops.title": "Nearby stops",
  "newbuilding.nearByStops.selectedTitle": "Selected stations/stop points",
  "newbuilding.creationSuccess": "A new building has just created successfully!",
  // manage services
  "manageServices.title": "Manage services",
  "manageServices.workTab": "Work",
  "manageServices.liveTab": "Live",
  "manageServices.currentServices": "Current services",
  "manageServices.chooseService": "Add a nearby service to your building",
  "manageServices.createService": "Create new service if it doesn't exist",
  "manageServices.distanceFilter": "only show in a {input} km radius",
  "manageServices.creationSuccess": "A new service has just created successfully!",
  "manageServices.confirmDeleteService": "Completing this action will remove this service from Drops and from the following building(s): {buildingList}. Are you sure?",
  "manageServices.confirmDeleteService.yesButton": "Yes, please do!",
  "manageServices.confirmDeleteService.noButton": "No, I want to keep it!",
  // Create service page
  "createService.title": "New service",
  //notfound page
  "notfound.message": "Oops! The page you're looking for can't be found. You will be redirected to home after {count} {counter, plural, one {second} other {seconds}}.",
  // warning
  "warning.localStorage": "Your web browser does not support storing settings locally. In Safari, the most common cause of this is using \"Private Browsing Mode\". Some settings may not save or some features may not work properly for you.",
  "warning.locationService": "Showing distances from building, allow location access for personal distances",

  // meeting room
  "meetingRoomPage.noMeetingRoomFound": "No meeting room found",
  "meetingRoomPage.title": "Meeting rooms",
  "meetingRoomPage.button.done": "Done",

  "meetingRoomInfo.reservation_info": "Reservation info",
  "meetingRoomInfo.book_button": "Book this room",
  "meetingRoomInfo.view_direction_button": "View direction",
  "meetingRoomInfo.catering_included": "Catering included",
  "meetingRoomInfo.description": "Description",
  "meetingRoomInfo.room": "Room",
  "meetingRoomInfo.floor": "Floor",
  "meetingRoomInfo.dialog.date": "Date",
  "meetingRoomInfo.dialog.fromTime": "From time",
  "meetingRoomInfo.dialog.toTime": "To time",
  "meetingRoomInfo.schedule.weekly": "Open weekly on ",
  "meetingRoomInfo.schedule.monthly": "Open monthly on ",
  "meetingRoomInfo.schedule.daily": "Open everyday ",
  "meetingRoomInfo.closingDays": "Closing days",
  "meetingRoomInfo.bookingSuccess": "Booking success.",

  "meetingRoomEditPage.banner": "Banner",
  "meetingRoomEditPage.thumbnail": "Thumbnail",
  "meetingRoomEditPage.name": "Name",
  "meetingRoomEditPage.price": "Price",
  "meetingRoomEditPage.schedule_type": "Schedule type",
  "meetingRoomEditPage.opening_hours": "Opening hours",
  "meetingRoomEditPage.closing_hours": "Closing hours",
  "meetingRoomEditPage.day_of_week": "Day of week",
  "meetingRoomEditPage.day_of_month": "Day of month",
  "meetingRoomEditPage.capacity": "Capacity",
  "meetingRoomEditPage.currency": "Currency",
  "meetingRoomEditPage.belong_to": "Belongs to",
  "meetingRoomEditPage.daily": "Daily",
  "meetingRoomEditPage.weekly": "Weekly",
  "meetingRoomEditPage.monthly": "Monthly",
  "meetingRoomEditPage.overlap": "Overlap",
  "meetingRoomEditPage.max_time_block": "Maximum time block",
  "meetingRoomEditPage.min_time_block": "Minimum time block",
  "meetingRoomEditPage.closing_days": "Closing days",
  "meetingRoomEditPage.repeat_on": "Repeat on",

  "meetingRooms.list": "Meeting rooms",
  "meetingRooms.new": "New meeting room",
  "meetingRooms.button.add": "Add room",
  "meetingRooms.message.addSuccess": "Room added successfully.",
  "meetingRooms.message.addFailure": "Added room fail. Please check the room information.",

  // Help page
  "helpPage.title": "Help"
};

export default enMessages;
