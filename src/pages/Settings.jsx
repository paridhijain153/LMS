import { useEffect, useMemo, useState } from "react";
import { Save, UserCog } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import "@/styles/pages/settings.css";

function buildSettingsKey(user) {
  if (!user?.name) {
    return "lms_settings_guest";
  }

  const safeName = user.name.trim().toLowerCase().replace(/\s+/g, "_");
  return `lms_settings_${safeName}`;
}

const defaultSettings = {
  emailUpdates: true,
  progressReminders: true,
  compactTables: false,
};

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);
  const settingsKey = useMemo(() => buildSettingsKey(user), [user]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(settingsKey);
      if (!raw) {
        setSettings(defaultSettings);
      } else {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(raw),
        });
      }
    } catch (error) {
      console.error("Failed to load settings", error);
      setSettings(defaultSettings);
      localStorage.removeItem(settingsKey);
    } finally {
      setIsHydrated(true);
    }
  }, [settingsKey]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    localStorage.setItem(settingsKey, JSON.stringify(settings));
  }, [settings, settingsKey, isHydrated]);

  const toggleSetting = (field) => (nextChecked) => {
    setSettings((prev) => ({
      ...prev,
      [field]: nextChecked,
    }));
  };

  const saveSettings = () => {
    toast({ title: "Settings saved", description: "Your preferences were updated." });
  };

  return (
    <DashboardLayout role={user?.role || "student"}>
      <TopBar title="Settings" subtitle="Manage your profile and platform preferences." showSearch={false} />

      <div className="dashboard-content">
        <section className="settings-card">
          <h2 className="settings-card__title"><UserCog /> Profile</h2>
          <div className="settings-grid">
            <div>
              <label className="settings-label" htmlFor="settings-name">Name</label>
              <Input id="settings-name" value={user?.name || "Guest User"} disabled />
            </div>
            <div>
              <label className="settings-label" htmlFor="settings-role">Role</label>
              <Input id="settings-role" value={user?.role || "visitor"} disabled />
            </div>
          </div>
        </section>

        <section className="settings-card">
          <h2 className="settings-card__title">Preferences</h2>
          <div className="settings-toggle-list">
            <label className="settings-toggle-row" htmlFor="setting-email-updates">
              <div>
                <p className="settings-toggle-title">Email updates</p>
                <p className="settings-toggle-desc">Get updates about new content and announcements.</p>
              </div>
              <Switch
                id="setting-email-updates"
                checked={settings.emailUpdates}
                onCheckedChange={toggleSetting("emailUpdates")}
              />
            </label>

            <label className="settings-toggle-row" htmlFor="setting-progress-reminders">
              <div>
                <p className="settings-toggle-title">Progress reminders</p>
                <p className="settings-toggle-desc">Receive reminders to continue your learning streak.</p>
              </div>
              <Switch
                id="setting-progress-reminders"
                checked={settings.progressReminders}
                onCheckedChange={toggleSetting("progressReminders")}
              />
            </label>

            <label className="settings-toggle-row" htmlFor="setting-compact-tables">
              <div>
                <p className="settings-toggle-title">Compact tables</p>
                <p className="settings-toggle-desc">Use denser table rows in admin and instructor screens.</p>
              </div>
              <Switch
                id="setting-compact-tables"
                checked={settings.compactTables}
                onCheckedChange={toggleSetting("compactTables")}
              />
            </label>
          </div>

          <div className="settings-actions">
            <Button type="button" onClick={saveSettings}><Save /> Save preferences</Button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
