import { firestore } from './firebase';

export async function search(input) {
    const tickers = await firestore.collection('current').get();

    const result = [];
    // firestore doesn't support text search, so we filter on client side instead.
    tickers.forEach(ticker => {
        if(ticker.id.includes(input)) {
            result.push(ticker.id);
        }
    });

    return result;
}