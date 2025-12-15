'use client';

import { supabaseAdmin } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

interface NotificationsTabProps {
  userId: string;
}

export async function NotificationsTab({ userId }: NotificationsTabProps) {
  const { data: notifications } = await supabaseAdmin
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (!notifications || notifications.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-4">No notifications</p>
          <p className="text-gray-500">We'll notify you about application updates here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification: any) => (
        <Card key={notification.id} className={notification.read ? 'bg-white' : 'bg-blue-50'}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{notification.title}</h4>
                  {!notification.read && (
                    <Badge variant="secondary" className="text-xs">New</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
