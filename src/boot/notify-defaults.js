import {Notify, Platform} from 'quasar'
const mobile = Platform.is.capacitor || Platform.is.cordova;

Notify.setDefaults({
  position: mobile ? 'top' : 'bottom',
  timeout: 2500,
  textColor: 'white',
  actions: [{ icon: 'close', color: 'white' }]
})
