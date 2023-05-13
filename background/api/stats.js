import { ApiPost } from './request';
import { updateBadgeText } from '../browser/badge';
import { setTransaction } from '../browser/storage';

export const getStats = (tabUrl, successCallback, errorCallback, willUpdateBadge) => {
  ApiPost('/reports/by-url', {'page_url': tabUrl}, (data) => {
    console.log('api/stats: Got stats for URL ' + tabUrl, data);
    setTransaction('stats', {
      url: tabUrl,
      stats: data
    }).then(() => {
      if (willUpdateBadge === true) updateBadgeText(data);
      if (typeof successCallback === 'function') successCallback(data);
    }).catch((e) => {
      if (typeof errorCallback === 'function') errorCallback(e);
    });
  }, errorCallback);
}
