import { renderLoginPage, renderUserPage } from './renderer';
import { firebaseAuth } from './firebase';
import './styles.scss';
import { subscribeToAllTickerChanges, subscribeToTickerChanges } from './services';
import { setUser } from './state';

let unsubscribeTickerChanges;
let unsubscribeAllTickerChanges;

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

        renderLoginPage({ title: 'Landing page', tableData: [] });
        unsubscribeAllTickerChanges = subscribeToAllTickerChanges(stockData => {
            renderLoginPage(
                { title: 'Landing page', tableData: stockData }
            )
        });
    }
});
