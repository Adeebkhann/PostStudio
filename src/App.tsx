import React, { useState, useEffect } from 'react';
import { StudioHeader } from './components/layout/StudioHeader';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { ThoughtInputCard } from './components/studio/ThoughtInputCard';
import { UnfoldingCard } from './components/studio/UnfoldingCard';
import { ArticleInspirationCard } from './components/studio/ArticleInspirationCard';
import { DraftsView } from './components/studio/DraftsView';
import { TechRadarView } from './components/studio/TechRadarView';
import { VisualWorkbench } from './components/workbench/VisualWorkbench';
import { SettingsView } from './components/studio/SettingsView';
import { LoginAccessModal } from './components/auth/LoginAccessModal';
import { useStudioState } from './hooks/useStudioState';
import { geminiService } from './services/geminiService';
import { aiProviderService } from './services/aiProviderService';
import { UserAuthSession } from './types/studio';

export function App() {
  const {
    identity,
    updateIdentity,
    settings,
    updateSettings,
    thought,
    setThought,
    tone,
    setTone,
    isGenerating,
    currentPost,
    drafts,
    activeTab,
    setActiveTab,
    copyFeedback,
    generatePost,
    toggleTag,
    refreshTrendingTags,
    rerollVisual,
    applyCustomVisual,
    updateCopy,
    copyPost,
    saveToDrafts,
    deleteDraft
  } = useStudioState();

  const [authSession, setAuthSession] = useState<UserAuthSession | null>(() => aiProviderService.getAuthSession());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(() => {
    // If no existing session and no gemini key, open login modal on first start
    const session = aiProviderService.getAuthSession();
    const hasKey = geminiService.hasApiKey();
    return !session && !hasKey;
  });

  // Exact date format from screenshot: "SATURDAY, OCTOBER 17 ● POST STUDIO"
  const formattedDate = new Date()
    .toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    })
    .toUpperCase();

  const handleRemixTrend = (suggestedThought: string) => {
    setThought(suggestedThought);
    setActiveTab('studio');
    setTimeout(() => {
      generatePost();
    }, 150);
  };

  const handleApplyWorkbenchToStudio = (dataUrl: string, customHeadline: string) => {
    if (currentPost) {
      applyCustomVisual({
        imageUrl: dataUrl,
        headline: customHeadline,
        subtitle: currentPost.imageSubtitle || 'Executive Visual Blueprint',
        badge: 'WORKBENCH EXPORT',
        style: 'infographic'
      });
    }
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen flex flex-col bg-studio-bg selection:bg-studio-activePill">
      {/* Top Studio Header */}
      <StudioHeader 
        onOpenLogin={() => setIsLoginModalOpen(true)}
        currentSession={authSession}
      />

      {/* Main Studio Body: 3-column layout anchored directly from top */}
      <main className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 md:py-8 flex flex-col lg:flex-row items-start gap-8">
        
        {/* Left Column: YOUR STUDIO & YOUR POINT OF VIEW */}
        <LeftSidebar
          identity={identity}
          onUpdateIdentity={updateIdentity}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          draftsCount={drafts.length}
        />

        {/* Center Stage: Studio / Workbench / Trends / Drafts / Settings */}
        <section className="flex-1 w-full min-w-0 flex flex-col gap-6">
          
          {/* Main Headline Banner matching screenshot placement */}
          <div className="flex flex-col gap-1 pb-1">
            <div className="flex items-center gap-2 text-[11px] font-extrabold tracking-widest text-[#2D483D] uppercase">
              <span>{formattedDate}</span>
              <span className="text-[9px] text-[#2D483D]">●</span>
              <span>POST STUDIO</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold tracking-tight text-studio-text leading-[1.12] mt-1">
              Good ideas start<br />
              with a thought.
            </h1>

            <p className="text-sm md:text-[15px] text-studio-muted font-normal mt-1">
              Current signals, your perspective, then a post that still sounds like you.
            </p>
          </div>

          {activeTab === 'studio' ? (
            <>
              {/* Card 01: What's on your mind today? */}
              <ThoughtInputCard
                thought={thought}
                onChangeThought={setThought}
                tone={tone}
                onSelectTone={setTone}
                onGenerate={generatePost}
                isGenerating={isGenerating}
              />

              {/* Card 02: Inline Unfolding Card directly below Card 01 */}
              <UnfoldingCard
                post={currentPost}
                onUpdateCopy={updateCopy}
                onToggleTag={toggleTag}
                onRefreshTags={refreshTrendingTags}
                onRerollVisual={rerollVisual}
                onApplyCustomVisual={applyCustomVisual}
                onCopyPost={copyPost}
                copyFeedback={copyFeedback}
                onSaveToDrafts={saveToDrafts}
                onOpenWorkbench={() => setActiveTab('workbench')}
              />

              {/* Card 03: Optional Article Inspiration */}
              <ArticleInspirationCard
                role={identity.role}
                onSelectInspiration={(headline) => setThought(headline)}
              />
            </>
          ) : activeTab === 'workbench' ? (
            <VisualWorkbench
              initialThought={thought}
              initialRole={identity.role}
              initialAst={currentPost?.visualAst}
              onApplyToStudio={handleApplyWorkbenchToStudio}
              onClose={() => setActiveTab('studio')}
            />
          ) : activeTab === 'trends' ? (
            <TechRadarView
              onRemixToStudio={handleRemixTrend}
            />
          ) : activeTab === 'drafts' ? (
            <DraftsView
              drafts={drafts}
              onSelectDraft={(draft) => {
                setThought(draft.thought);
                setActiveTab('studio');
              }}
              onDeleteDraft={deleteDraft}
            />
          ) : (
            <SettingsView
              identity={identity}
              onUpdateIdentity={updateIdentity}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
            />
          )}
        </section>

        {/* Right Column: Constellation Art + A Good Reminder (Hidden on Workbench for maximum whiteboard space) */}
        {activeTab !== 'workbench' && (
          <div className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
            {/* Top Right Constellation Graphic matching the screenshot */}
            <div className="hidden lg:flex items-center justify-end relative h-28 select-none pointer-events-none -mt-2">
              <svg viewBox="0 0 160 120" className="w-40 h-28 stroke-[#C8D7C4] fill-none" strokeWidth="1.2">
                <ellipse cx="80" cy="60" rx="60" ry="30" transform="rotate(-15 80 60)" />
                <ellipse cx="80" cy="60" rx="55" ry="38" transform="rotate(22 80 60)" />
                <circle cx="128" cy="85" r="4.5" className="fill-[#E66E43] stroke-none" />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-studio-constellation border border-[#C8D7C4]/60 flex items-center justify-center text-studio-accent text-2xl font-bold">
                ✱
              </div>
            </div>

            {/* Right Sidebar Cards */}
            <RightSidebar
              settings={settings}
              onUpdateSettings={updateSettings}
            />
          </div>
        )}

      </main>

      {/* Login & Multi-Provider Access Gateway Modal */}
      <LoginAccessModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentSession={authSession}
        onSuccess={(session) => {
          setAuthSession(session);
          if (session.userRole) {
            updateIdentity({ role: session.userRole });
          }
        }}
        allowClose={true}
      />
    </div>
  );
}

export default App;
