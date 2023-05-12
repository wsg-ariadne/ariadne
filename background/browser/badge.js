import { getAction } from './getAction';

const action = getAction();

export const toggleBadge = (state) => {
  if (state) {
    action.setBadgeBackgroundColor({
      color: "#B677FA",
    });
  } else {
    action.setBadgeBackgroundColor({
      color: "#2A272A",
    });
  }
}

export const updateBadgeText = (stats) => {
  console.log('browser/badge: Updating badge text with stats:', stats);
    if (stats !== undefined && stats.hasOwnProperty("success") &&
      stats.hasOwnProperty("specific_reports") && stats["success"]) {
      const count = stats.specific_reports.count;
      console.log('browser/badge: Badge count:', count)
      if (count > 0) {
        action.setBadgeText({
          text: count.toString(),
        });
        return;
      }
    }
    action.setBadgeText({
      text: "0",
    });
}
