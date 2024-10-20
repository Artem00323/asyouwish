import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTheme } from '@/components/theme-provider';

interface Preferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
}

interface PreferencesComponentProps {
  onSave: (preferences: Preferences) => void;
  onCancel: () => void;
}

export function PreferencesComponent({ onSave, onCancel }: PreferencesComponentProps) {
  const { theme, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [language, setLanguage] = React.useState('en');

  const handleSave = () => {
    onSave({
      theme: theme,
      notifications: emailNotifications,
      language: language
    });
  };

  return (
    <Card className='hover:shadow-lg transition-shadow duration-300'>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch
            id="dark-mode"
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
