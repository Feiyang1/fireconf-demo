import { renderLoginPage, renderUserPage } from './renderer';
import { firebaseAuth } from './firebase';

firebaseAuth.onAuthStateChanged(user => {
    if (user) {
        // TODO: data fetching
        console.log('hello', user);
        renderUserPage(/** source for rendering */);
    } else {
        renderLoginPage({ title: 'Landing page'})
    }
});