<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
  public function getAllNotifications()
  {
    return response()->json(auth('api')->user()->notifications);
  }
  public function getUnreadNotifications()
  {
    return response()->json(auth('api')->user()->unreadNotifications);
  }

  public function markNotificationAsRead($id)
  {
    auth('api')->user()->notifications()->where('id', $id)->update(['read_at' => now()]);
    return response()->json(['message' => 'Notification marked as read']);
  }
  public function markAllAsRead()
  {
    auth('api')->user()->unreadNotifications->markAsRead();
    return response()->json(['message' => 'All notifications marked as read']);
  }
  public function deleteNotification($id)
  {
    auth('api')->user()->notifications()->where('id', $id)->delete();
    return response()->json(['message' => 'Notification deleted']);
  }
  public function countUnread()
  {
    return response()->json(['count' => auth('api')->user()->unreadNotifications->count()]);
  }
}
