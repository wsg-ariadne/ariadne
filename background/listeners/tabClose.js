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
      deleteTransaction('calliope', url);
      deleteTransaction('janus', url);
    })
}
