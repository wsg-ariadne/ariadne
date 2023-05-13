import { getTransaction, deleteTransaction } from '../browser/storage';

export default (tabId, _) => {
  console.log('listeners/tabClose: Tab closed', tabId);

  // Delete badge state and Dionysus stats
  deleteTransaction('badgeStates', tabId);
  deleteTransaction('stats', tabId);

  // Get URL of closed tab
  getTransaction('tabUrls', tabId)
    .then((url) => {
      // Delete Calliope and Janus results
      deleteTransaction('calliope', url)
        .catch((err) => console.log('listeners/tabClose: No Calliope results to delete', err));
      deleteTransaction('janus', url)
        .catch((err) => console.log('listeners/tabClose: No Janus results to delete', err));
    })
}
