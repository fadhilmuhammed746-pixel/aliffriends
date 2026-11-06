'use client';

import React, { useState } from 'react';
import {
  Mail,
  Youtube,
  Instagram,
  Send,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [botField, setBotField] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (botField) {
      setSuccess('Message sent successfully.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          bot_field: botField,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to deliver message.');
      }

      setSuccess(
        data.message || 'Your inquiry has been delivered directly to the Alif Friends 12 editorial desk.'
      );
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Error transmitting your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 bg-canvas text-ink">
      {/* Header Masthead */}
      <div className="border-b border-editorial-border pb-8 text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-50 border border-forest-100 text-forest text-xs font-serif uppercase tracking-widest font-semibold">
          <MessageSquare className="w-3.5 h-3.5 text-coral" />
          <span>Editorial Communication Desk</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-forest tracking-tight">
          Contact Alif Friends 12
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed font-sans max-w-2xl mx-auto">
          Direct inquiries, media releases, alumni notes, and submission drafts to our official editorial correspondents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Official Channels Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Official Email Desks */}
          <div className="bg-white border border-editorial-border rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
              <Mail className="w-5 h-5 text-coral" />
              <span>Official Email Desks</span>
            </h2>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              For official correspondence, press inquiries, and archive submissions, contact either of our verified email addresses:
            </p>

            <div className="space-y-3 pt-2">
              <a
                href="mailto:aliffreinds12@gmail.com"
                className="flex items-center justify-between p-4 rounded-xl bg-canvas border border-editorial-border hover:border-forest text-forest transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-coral flex-shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-mono text-ink-muted block font-semibold">Primary Desk</span>
                    <span className="font-mono text-xs sm:text-sm text-forest group-hover:text-coral transition-colors font-medium">
                      aliffreinds12@gmail.com
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-ink-muted group-hover:text-coral transition-colors" />
              </a>

              <a
                href="mailto:aliffriends12@gmail.com"
                className="flex items-center justify-between p-4 rounded-xl bg-canvas border border-editorial-border hover:border-forest text-forest transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-coral flex-shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-mono text-ink-muted block font-semibold">Secondary Desk</span>
                    <span className="font-mono text-xs sm:text-sm text-forest group-hover:text-coral transition-colors font-medium">
                      aliffriends12@gmail.com
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-ink-muted group-hover:text-coral transition-colors" />
              </a>
            </div>
          </div>

          {/* Official Media Channels */}
          <div className="bg-white border border-editorial-border rounded-2xl p-6 sm:p-8 shadow-card space-y-4">
            <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
              <Youtube className="w-5 h-5 text-coral" />
              <span>Official Media Broadcasts</span>
            </h2>
            <p className="text-xs text-ink-muted font-sans leading-relaxed">
              Follow our official media productions, live assembly streams, and photographic chronicles on our verified channels:
            </p>

            <div className="space-y-3 pt-2">
              {/* YouTube Channel Button */}
              <a
                href="https://www.youtube.com/@AlifCreations12"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-canvas border border-editorial-border hover:border-coral transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-coral text-white">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm text-forest block">Alif Creations 12</span>
                    <span className="text-xs font-mono text-coral font-medium">@AlifCreations12 • YouTube</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-coral group-hover:scale-110 transition-transform" />
              </a>

              {/* Instagram Button */}
              <a
                href="https://www.instagram.com/_alif_friends_/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-canvas border border-editorial-border hover:border-coral transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-forest text-white">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm text-forest block">Alif Friends Official</span>
                    <span className="text-xs font-mono text-forest font-medium">@_alif_friends_ • Instagram</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-coral group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form Column (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-editorial-border rounded-2xl p-6 sm:p-10 shadow-card relative">
          <div className="border-b border-editorial-border pb-4 mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
              Transmit an Editorial Dispatch
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 font-sans">
              Submissions are reviewed by the editorial secretary and directed to the appropriate desk.
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-forest-50 border border-forest-100 rounded-xl flex items-center gap-3 text-xs sm:text-sm text-forest font-medium">
              <CheckCircle className="w-5 h-5 text-forest flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-coral-50 border border-coral/30 rounded-xl flex items-center gap-3 text-xs sm:text-sm text-coral font-medium">
              <AlertCircle className="w-5 h-5 text-coral flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot Spam Protection Field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="bot_field">Leave this empty</label>
              <input
                type="text"
                id="bot_field"
                name="bot_field"
                tabIndex={-1}
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-serif tracking-wider text-forest font-bold mb-1.5">
                  Your Full Name <span className="text-coral">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tariq Vance"
                  className="w-full px-4 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-forest transition-colors font-sans"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-serif tracking-wider text-forest font-bold mb-1.5">
                  Email Address <span className="text-coral">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full px-4 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-forest transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-serif tracking-wider text-forest font-bold mb-1.5">
                Subject Matter <span className="text-coral">*</span>
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Inquiry regarding Edition XII or Event RSVP"
                className="w-full px-4 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-forest transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-serif tracking-wider text-forest font-bold mb-1.5">
                Message & Proposal <span className="text-coral">*</span>
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your detailed inquiry or editorial contribution..."
                className="w-full px-4 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-forest transition-colors font-sans leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-forest hover:bg-forest-800 text-white font-serif font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-editorial flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Transmitting Dispatch...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-coral" />
                  <span>Transmit Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
