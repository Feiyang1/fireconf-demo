import { renderLoginPage, renderUserPage } from './renderer';
import { firebaseAuth, firestore } from './firebase';

firebaseAuth.onAuthStateChanged(user => {
    if (user) {
        // TODO: data fetching
        console.log('hello', user);
        renderUserPage(user);
    } else {
        renderLoginPage({ title: 'Landing page', tableData: [] });
        subscribeToFirestore(stockData => {
            renderLoginPage(
                { title: 'Landing page', tableData: stockData }
            )
        });
    }
});

function subscribeToFirestore(renderFn) {
        firestore
        .collection(`current`)
        .onSnapshot(snap => {
            const stocks = formatSDKStocks(snap);
            console
            renderFn(stocks);
        });
}

// Format stock data in Firestore format (returned from `onSnapshot()`)
function formatSDKStocks(snap) {
    const stocks = [];
    snap.forEach(docSnap => {
        if (!docSnap.data()) return;
        const symbol = docSnap.id;
        const {
            closeValue,
            delta,
            timestamp
        } = docSnap.data();
        stocks.push({
            symbol,
            value: closeValue,
            delta,
            timestamp
        });
    });
    return stocks;
}
