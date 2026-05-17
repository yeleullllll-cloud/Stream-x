import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { type Movie } from '../types';

export async function addToWatchlist(movie: Movie) {
  if (!auth.currentUser) return;
  const { uid } = auth.currentUser;
  try {
    const itemRef = doc(db, 'users', uid, 'watchlist', movie.id);
    await setDoc(itemRef, {
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster,
      type: movie.type || 'movie',
      addedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `users/${uid}/watchlist/${movie.id}`);
  }
}

export async function removeFromWatchlist(movieId: string) {
  if (!auth.currentUser) return;
  const { uid } = auth.currentUser;
  try {
    const itemRef = doc(db, 'users', uid, 'watchlist', movieId);
    await deleteDoc(itemRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${uid}/watchlist/${movieId}`);
  }
}

export function subscribeToWatchlist(callback: (movies: Movie[]) => void) {
  if (!auth.currentUser) {
    callback([]);
    return () => {};
  }
  const { uid } = auth.currentUser;
  const listQuery = query(collection(db, 'users', uid, 'watchlist'), orderBy('addedAt', 'desc'));
  
  return onSnapshot(listQuery, (snapshot) => {
    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: data.movieId,
        title: data.title,
        poster: data.poster,
        type: data.type
      } as Movie;
    });
    callback(items);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, `users/${uid}/watchlist`);
  });
}
