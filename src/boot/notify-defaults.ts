import { Notify, Platform } from 'quasar';

const mobile: boolean = Platform.is.capacitor || Platform.is.cordova;

Notify.setDefaults({
  position: mobile ? 'top' : 'bottom',
  timeout: 2500,
  textColor: 'white',
  actions: [{ icon: 'close', color: 'white' }]
});

// Note: This boot file doesn't need to export anything
// It just runs Notify.setDefaults() when the app boots.