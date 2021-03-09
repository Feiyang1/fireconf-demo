import { firestore, FirestoreFieldValue } from './firebase';

export async function search(input) {
    const tickers = await firestore.collection('current').get();

    const result = [];
    // firestore doesn't support text search, so we filter on client side instead.
    tickers.forEach(ticker => {
        if (ticker.id.toLowerCase().includes(input.toLowerCase())) {
            result.push(ticker.id);
        }
    });

    return result;
}

export function addToWatchList(ticker, user) {
    return firestore.collection('watchlist').doc(user.uid).set({
        tickers: FirestoreFieldValue.arrayUnion(ticker)
    }, { merge: true });
}

export function subscribeToTickerChanges(callback) {
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
