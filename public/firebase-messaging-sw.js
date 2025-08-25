// firebase-messaging-sw.js
// importScripts('https://www.gstatic.com/firebasejs/8.6.7/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/8.6.7/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

function logNotificationAction(actionType, data) {
  console.log(`Logging action: ${actionType}`, data);

  fetch('https://app.revechat.com/rest/v1/message-log-status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...data,
      statusUpdatedTime: new Date().getTime()
    })
  }).then(response => {
    console.log('API log response:', response.status);
  }).catch(error => {
    console.error('API log failed:', error);
  });
}
// Firebase configuration for revechatwebpush
// const firebaseConfig = {
//   apiKey: "AIzaSyBL5ZN6mBVj7l_pdzS3iMX7gleJK7AJ3TU",
//   authDomain: "revechatwebpush.firebaseapp.com",
//   projectId: "revechatwebpush",
//   storageBucket: "revechatwebpush.firebasestorage.app",
//   messagingSenderId: "778472629703",
//   appId: "1:778472629703:web:abd9dde24992f46a94a5e2",
//   measurementId: "G-2TJ4MD84R9",
// };
const firebaseConfig = {
  apiKey: "AIzaSyCL_Ct4vr3gOssN989DsVDMa3O5HGSoVk0",
  authDomain: "campaign-webpush.firebaseapp.com",
  projectId: "campaign-webpush",
  storageBucket: "campaign-webpush.firebasestorage.app",
  messagingSenderId: "1070142761417",
  appId: "1:1070142761417:web:24859a22505158b9916018",
  measurementId: "G-JWT36G8GMM"
};

 

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

function displayNotification(payload) {
  console.log("Displaying notification for payload:", payload); // Debug log
  const autoHideNotification = payload.data?.autoHideNotification === 'true';
  const expirePushAutomatically = payload.data?.expirePushAutomatically === 'true';
  const expirePushAfter = parseInt(payload.data?.expirePushAfter || '0');
  const expirePushAfterUnit = payload.data?.expirePushAfterUnit || 'seconds';
  const notificationTitle =
    payload.notification?.title || payload.data?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "No Body",
    icon: payload.data?.icon || "/default-icon.png",
    image: payload.notification?.image || payload.data?.image,
    data: payload.data || {},
    actions: [],
  };

  // Add buttons from payload.data
  if (payload.data?.button_1_title && payload.data?.button_1_url) {
    notificationOptions.actions.push({
      action: "button_1",
      title: payload.data.button_1_title,
    });
  }
  if (payload.data?.button_2_title && payload.data?.button_2_url) {
    notificationOptions.actions.push({
      action: "button_2",
      title: payload.data.button_2_title,
    });
  }
  if(!autoHideNotification) {
    notificationOptions.requireInteraction = true; 
  } else {
    notificationOptions.requireInteraction = false; 
  }

  // Show notification with buttons
  console.log("Showing notification:", notificationTitle, notificationOptions); // Debug log
  self.registration.showNotification(notificationTitle, notificationOptions);

  //if(autoHideNotification) {
  //  setTimeout(() => {
  //    self.registration.getNotifications().then(notifications => {
  //    notifications.forEach(notification => {
  //      notification.close();
  //    });
  //  });
  //  }, 5000);
  //}

  if (expirePushAutomatically && expirePushAfter > 0) {
    setTimeout(() => {
      self.registration.getNotifications().then(notifications => {
        notifications.forEach(notification => {
          notification.close();
        });
      });
    }, convertToMilliseconds(expirePushAfter, expirePushAfterUnit));
  }
}
function convertToMilliseconds(value, unit) {
  switch (unit) {
    case 'seconds':
    case 'SECONDS': return value * 1000;
    case 'MINUTES':
    case 'minutes': return value * 60 * 1000;
    case 'HOURS':
    case 'hours': return value * 60 * 60 * 1000;
    case 'DAYS':
    case 'days': return value * 24 * 60 * 60 * 1000;
    default: return value * 1000;
  }
}
// Listen for push events
self.addEventListener("push", (event) => {
    console.log("Event" + JSON.stringify(event));
  console.log("Push event received");
  if (event.data) {
    const payload = event.data.json();
    console.log("Push payload:", payload);
    event.waitUntil(displayNotification(payload));
  } else {
    console.warn("Push event with no data");
  }
  setTimeout(() => {
    logNotificationAction('button_1_click', {
      productType: "WEB_PUSH",
      messageId: event?.data?.json()?.data?.message_id,
      status: "DELIVERED"
    });
  }, 5000);
});


// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked, action:", event.action); // Debug log
  event.notification.close();
  const data = event.notification.data || {};
  // Handle button clicks or body click
  if (event.action === "button_1" && data.button_1_url) {
    event.waitUntil(clients.openWindow(data.button_1_url));
  } else if (event.action === "button_2" && data.button_2_url) {
    event.waitUntil(clients.openWindow(data.button_2_url));
  } else if (data.url) {
    // Fallback to default URL if the notification body is clicked
    event.waitUntil(clients.openWindow(data.url));
  }
  setTimeout(() => {
    logNotificationAction('button_1_click', {
      productType: "WEB_PUSH",
      messageId: event?.notification?.data?.message_id,
      status: "CLICKED"
    });
  }, 5000);
});

// Handle notification closes (when user dismisses it)
self.addEventListener("notificationclose", (event) => {
  console.log("Notification was dismissed by the user.");
  const data = event.notification.data || {};
  console.log("Dismissed notification data:", data);
  
  setTimeout(() => {
    logNotificationAction('button_1_click', {
      productType: "WEB_PUSH",
      messageId: event?.notification?.data?.message_id,
      status: "CLOSED"
    });
  }, 5000);
  
});

 
