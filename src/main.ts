import { renderLoginPage, renderUserPage } from './renderer';
import { firebaseAuth } from './firebase';
import { subscribeToAllTickerChanges, subscribeToTickerChanges } from './services';
import { setUser } from './state';
import './styles.scss';

let unsubscribeTickerChanges: () => void;
let unsubscribeAllTickerChanges: () => void;

firebaseAuth.onAuthStateChanged(user => {

    if (unsubscribeAllTickerChanges) {
        unsubscribeAllTickerChanges();
    }

    if (unsubscribeTickerChanges) {
        unsubscribeTickerChanges();
    }

    if (user) {
        // user page
        // TODO: data fetching
        setUser(user);

        console.log('hello', user);
        unsubscribeTickerChanges = subscribeToTickerChanges(user, stockData => renderUserPage(user, stockData))
    } else {
        // login page
        setUser(null);

        renderLoginPage('Landing page', []);
        unsubscribeAllTickerChanges = subscribeToAllTickerChanges(stockData => {
            renderLoginPage('Landing page', stockData)
        });
    }
});
