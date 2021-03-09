import { firestore, FirestoreFieldPath, FirestoreFieldValue } from './firebase';

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

export function subscribeToTickerChanges(user, callback) {

    let unsubscribePrevTickerChanges;
    const unsubscribe = firestore.collection('watchlist').doc(user.uid).onSnapshot(snapshot => {
        const doc = snapshot.data();
        const tickers = doc ? doc.tickers : [];

        if (unsubscribePrevTickerChanges) {
            unsubscribePrevTickerChanges();
        }

        if (tickers.length === 0) {
            callback([]);
        } else {
            unsubscribePrevTickerChanges = firestore
            .collection('current')
            .where(FirestoreFieldPath.documentId(), 'in', tickers)
            .onSnapshot(snapshot => {
                const stocks = formatSDKStocks(snapshot);
                callback(stocks);
            });
        }
    });
    return unsubscribe;
}

export function subscribeToAllTickerChanges(callback) {
    firestore
        .collection('current')
        .onSnapshot(snapshot => {
            const stocks = formatSDKStocks(snapshot);
            callback(stocks);
        });
}

// Format stock data in Firestore format (returned from `onSnapshot()`)
function formatSDKStocks(snapshot) {
    const stocks = [];
    snapshot.forEach(docSnap => {
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
