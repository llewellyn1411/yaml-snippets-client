import { analytics } from '../firebase';

export default ( name: string, payload?: any ) => {
    if ( payload ) {
        analytics.logEvent( name, payload );
    } else {
        analytics.logEvent( name );
    }
};
