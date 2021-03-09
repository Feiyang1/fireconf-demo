import { renderLoginPage, renderUserPage } from './renderer';
import { firebaseAuth } from './firebase';
import './styles.scss';
import { subscribeToTickerChanges } from './stocks';
import { setUser } from './state';

firebaseAuth.onAuthStateChanged(user => {
    if (user) {
        // user page
        // TODO: data fetching
        console.log('hello', user);
        renderUserPage(user);
        setUser(user);
    } else {
        // login page
        renderLoginPage({ title: 'Landing page', tableData: [] });
        subscribeToTickerChanges(stockData => {
            renderLoginPage(
                { title: 'Landing page', tableData: stockData }
            )
        });
        setUser(null);
    }
});
