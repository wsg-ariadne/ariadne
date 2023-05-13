import { ApiPost } from './request';
import { updateBadgeText } from '../browser/badge';
import { setTransaction } from '../browser/storage';

export const getStats = (tabUrl, successCallback, errorCallback) => {
  ApiPost('/reports/by-url', {'page_url': tabUrl}, (data) => {
    console.log('api/stats: Got stats for URL ' + tabUrl, data);
    setTransaction('stats', {
      url: tabUrl,
      stats: data
    }).then(() => {
      updateBadgeText(data);
      if (successCallback !== undefined) successCallback(data);
    }).catch((e) => errorCallback(e))
  }, errorCallback);
}
