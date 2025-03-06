import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
const user = JSON.parse(localStorage.getItem('user'));
window.Pusher = Pusher
const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  encrypted: true,
  authEndpoint: 'http://127.0.0.1:8000/api/broadcasting/auth',
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  }
});
// echo.private(`App.Models.User.${user.id}`)
//   .listen('.CommentEvent', (e) => {
//     console.log('Received Comment Event:', e);
//   });
// echo.private(`App.Models.User.${user.id}`)
//   .listen('.Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', (e) => {
//     console.log('Notification received:', e);
//   });
export default echo;