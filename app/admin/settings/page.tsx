'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Lock,
  Save,
  CheckCircle,
  AlertCircle,
  Shield,
  Globe,
  Mail,
  Youtube,
  Instagram,
  Eye,
  Sliders,
} from 'lucide-react';
import { WebsiteSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaveSuccess('');
    setSaveError('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings.');
      setSaveSuccess('Website branding, editorial configuration, and channels updated successfully.');
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'Error updating settings.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSuccess('');
    setPwdError('');

    if (newPassword !== confirmNewPassword) {
      setPwdError('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters long.');
      return;
    }

    setPwdLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmNewPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password.');

      setPwdSuccess(data.message || 'Password updated successfully. Session remains secure.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPwdSuccess(''), 5000);
    } catch (err: any) {
      setPwdError(err.message || 'Error changing password.');
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex w-full">
        <AdminSidebar />
        <div className="flex-1 p-8 text-ivory font-serif">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen bg-navy text-ivory">
        <AdminHeader
          title="Settings & Security"
          subtitle="Manage website branding, editorial story, official contact channels, and administrator authentication."
        />

        <div className="p-6 sm:p-8 space-y-10 max-w-5xl">
          {/* SECTION 1: CHANGE PASSWORD */}
          <section className="bg-charcoal border border-gold/30 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="border-b border-gold/15 pb-4 mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-ivory flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gold" />
                  <span>Change Administrator Password</span>
                </h2>
                <p className="text-xs text-muted-light mt-1">
                  Update your server-side hashed credentials. Initial credentials configured: <span className="font-mono text-gold">admin</span> / <span className="font-mono text-gold">alif12</span>.
                </p>
              </div>
              <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-gold/10 text-gold border border-gold/30">
                Salted Hash Active
              </span>
            </div>

            {pwdSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{pwdSuccess}</span>
              </div>
            )}

            {pwdError && (
              <div className="mb-6 p-4 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center gap-2.5 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{pwdError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password (default: alif12)"
                  className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={pwdLoading}
                className="mt-2 px-6 py-2.5 bg-gold hover:bg-gold-light text-navy font-serif font-bold text-xs uppercase tracking-widest rounded-lg transition-colors shadow-gold flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{pwdLoading ? 'Encrypting & Saving...' : 'Update Password'}</span>
              </button>
            </form>
          </section>

          {/* SECTION 2: BRANDING & EDITORIAL SETTINGS */}
          <section className="bg-charcoal border border-gold/30 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="border-b border-gold/15 pb-4 mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-ivory flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gold" />
                  <span>Branding, Editorial Story & Channels</span>
                </h2>
                <p className="text-xs text-muted-light mt-1">
                  Update primary publication metadata, emails, social handles, and public toggles.
                </p>
              </div>
            </div>

            {saveSuccess && (
              <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{saveSuccess}</span>
              </div>
            )}

            {saveError && (
              <div className="mb-6 p-4 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center gap-2.5 text-xs text-red-200">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Basic Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                    Publication Platform Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                    Official Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Hero Section Copy */}
              <div className="space-y-4 border-t border-gold/15 pt-4">
                <h3 className="font-serif text-sm font-bold text-gold uppercase tracking-wider">
                  Homepage Signature Hero
                </h3>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                    Hero Badge
                  </label>
                  <input
                    type="text"
                    value={settings.heroBadge}
                    onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                    className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={settings.heroHeading}
                    onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
                    className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={3}
                    value={settings.heroSubheading}
                    onChange={(e) => setSettings({ ...settings, heroSubheading: e.target.value })}
                    className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                    Hero Cinematic Background Image URL
                  </label>
                  <input
                    type="text"
                    value={settings.heroImage}
                    onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                    className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>

              {/* Official Channels & Exact Emails */}
              <div className="space-y-4 border-t border-gold/15 pt-4">
                <h3 className="font-serif text-sm font-bold text-gold uppercase tracking-wider">
                  Official Channels & Contact Desks
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gold" />
                      <span>Primary Email (Exact)</span>
                    </label>
                    <input
                      type="email"
                      value={settings.emailPrimary}
                      onChange={(e) => setSettings({ ...settings, emailPrimary: e.target.value })}
                      className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gold" />
                      <span>Secondary Email (Exact)</span>
                    </label>
                    <input
                      type="email"
                      value={settings.emailSecondary}
                      onChange={(e) => setSettings({ ...settings, emailSecondary: e.target.value })}
                      className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5 flex items-center gap-1.5">
                      <Youtube className="w-3.5 h-3.5 text-red-400" />
                      <span>Official YouTube URL</span>
                    </label>
                    <input
                      type="url"
                      value={settings.officialYoutube}
                      onChange={(e) => setSettings({ ...settings, officialYoutube: e.target.value })}
                      className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5 flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-pink-400" />
                      <span>Official Instagram URL</span>
                    </label>
                    <input
                      type="url"
                      value={settings.officialInstagram}
                      onChange={(e) => setSettings({ ...settings, officialInstagram: e.target.value })}
                      className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Ticker & Class Member Toggles */}
              <div className="space-y-4 border-t border-gold/15 pt-4">
                <h3 className="font-serif text-sm font-bold text-gold uppercase tracking-wider">
                  Features & Visibility Controls
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-navy border border-gold/15">
                  <div>
                    <span className="font-serif text-sm font-bold text-ivory block">
                      Enable Class Members Section
                    </span>
                    <span className="text-xs text-muted-light font-sans">
                      Toggle whether the public Class Members roster and leadership directory is visible.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.membersSectionEnabled}
                    onChange={(e) =>
                      setSettings({ ...settings, membersSectionEnabled: e.target.checked })
                    }
                    className="w-5 h-5 accent-gold cursor-pointer"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-navy border border-gold/15">
                  <div>
                    <span className="font-serif text-sm font-bold text-ivory block">
                      Show Breaking News Ticker
                    </span>
                    <span className="text-xs text-muted-light font-sans">
                      Display marquee banner across top of public pages.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showBreakingTicker}
                    onChange={(e) =>
                      setSettings({ ...settings, showBreakingTicker: e.target.checked })
                    }
                    className="w-5 h-5 accent-gold cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                    Breaking Ticker Dispatch Text
                  </label>
                  <input
                    type="text"
                    value={settings.breakingTickerText}
                    onChange={(e) =>
                      setSettings({ ...settings, breakingTickerText: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* About Us & Editorial Manifesto */}
              <div className="space-y-4 border-t border-gold/15 pt-4">
                <h3 className="font-serif text-sm font-bold text-gold uppercase tracking-wider">
                  About Us & Class Manifesto
                </h3>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                    Our Class Story
                  </label>
                  <textarea
                    rows={4}
                    value={settings.aboutStory}
                    onChange={(e) => setSettings({ ...settings, aboutStory: e.target.value })}
                    className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                      Mission Statement
                    </label>
                    <textarea
                      rows={3}
                      value={settings.aboutMission}
                      onChange={(e) => setSettings({ ...settings, aboutMission: e.target.value })}
                      className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                      Vision Statement
                    </label>
                    <textarea
                      rows={3}
                      value={settings.aboutVision}
                      onChange={(e) => setSettings({ ...settings, aboutVision: e.target.value })}
                      className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold leading-relaxed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-serif text-ivory/80 mb-1.5">
                    Class Founder / Representative Quote
                  </label>
                  <input
                    type="text"
                    value={settings.founderQuote}
                    onChange={(e) => setSettings({ ...settings, founderQuote: e.target.value })}
                    className="w-full px-4 py-2.5 bg-navy border border-gold/20 rounded-lg text-sm text-ivory focus:outline-none focus:border-gold font-serif italic"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gold/15 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 bg-gold hover:bg-gold-light text-navy font-serif font-bold text-xs uppercase tracking-widest rounded-lg transition-colors shadow-gold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
