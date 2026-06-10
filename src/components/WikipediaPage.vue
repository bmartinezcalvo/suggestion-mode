<template>
  <div
    ref="pageRoot"
    :class="[
      isEditMode ? 'edit-mode' : 'read-mode',
      isMinervaSkin ? 'minerva-skin' : 'vector-skin',
      isMinervaSkin && editFullPageImprovedEnabled ? 'minerva-edit-full-page-improved' : '',
      isMinervaSkin && editToolbarImprovementsEnabled ? 'minerva-edit-toolbar-improved' : '',
      isMinervaSkin && isEditMode && showSuggestions && bannerSuggestionCount > 0 && !showMinervaRail ? 'minerva-suggestions-on' : '',
      isMinervaSkin && isEditMode && showMinervaRail ? 'minerva-suggestions-on--rail' : '',
      isMinervaSkin && isEditMode && isMinervaFullPageExpandableRailMode ? 'minerva-expandable-rail-mode' : '',
      isMinervaSkin && isEditMode && isMinervaFullPageExpandableRailOpen ? 'minerva-expandable-rail-open' : '',
      isMinervaSheetOpen ? 'minerva-sheet-open' : '',
      isSuggestionLightFlash ? 'suggestion-light-flash' : '',
      isSuggestionMarkersVisible ? 'suggestion-markers-visible' : '',
      isSuggestionsFadingOut ? 'suggestion-markers-hiding' : '',
      isSuggestionGlowActive ? 'suggestion-glow-active' : ''
    ]"
    :style="suggestionColorStyles"
  >
    <span
      v-if="showMinervaRailToMenuBadgeAnimation"
      class="minerva-rail-to-menu-badge"
      :style="minervaRailToMenuBadgeStyle"
      aria-hidden="true"
    ></span>
    <div
      v-if="shouldShowToasts && showMinervaToggleOffToast"
      class="minerva-toast"
      role="status"
      aria-live="polite"
    >
      Suggestions turned off
    </div>
    <div
      v-if="shouldShowToasts && showMinervaToggleOnToast"
      class="minerva-toast"
      role="status"
      aria-live="polite"
    >
      Suggestions turned on
    </div>
    <div
      v-if="shouldShowToasts && showMinervaZeroSuggestionsToast"
      class="minerva-toast minerva-toast--zero"
      role="status"
      aria-live="polite"
    >
      No suggestions available for now
    </div>
    <div
      v-if="showPaginationNoSuggestionsToast"
      class="minerva-toast minerva-toast--zero"
      role="status"
      aria-live="polite"
    >
      No more suggestions left
    </div>
    <div
      v-if="isMinervaSkin && toastsEnabled && showSuggestionSuccessToast"
      class="minerva-toast minerva-toast--success"
      role="status"
      aria-live="polite"
    >
      <cdx-icon :icon="cdxIconSuccess" size="medium" />
      <span>Thank you for helping to make this section easier for people to read.</span>
    </div>
    <div
      v-if="!isMinervaSkin && toastsEnabled && showSuggestionSuccessToast"
      class="vector-success-toast"
      role="status"
      aria-live="polite"
    >
      <cdx-icon :icon="cdxIconSuccess" size="small" />
      <span>Thank you for helping to make this section easier for people to read.</span>
    </div>
    
    <!-- Page Container -->
    <div class="page-container">
      <!-- Fixed header (Vector22, scroll > 150px, read mode only) -->
      <header
        v-if="!isMinervaSkin && isHeaderFixed && !isEditMode"
        class="fixed-header"
        aria-label="Fixed navigation"
      >
        <button class="menu-button fixed-header__menu" aria-label="Menu" @click="toggleSkinMenu">
          <cdx-icon :icon="cdxIconMenu" size="medium" />
        </button>
        <button class="fixed-header__search-btn" aria-label="Search">
          <cdx-icon :icon="cdxIconSearch" size="medium" />
        </button>
        <div class="fixed-header__divider" aria-hidden="true"></div>
        <span class="fixed-header__title">Audre Lorde</span>
        <div class="fixed-header__end">
          <div class="user-tools">
            <a href="#" class="user-link">User1234</a>
            <button class="icon-btn" aria-label="Notifications"><cdx-icon :icon="cdxIconBell" size="medium" /></button>
            <button class="icon-btn" aria-label="Messages"><cdx-icon :icon="cdxIconTray" size="medium" /></button>
            <button class="icon-btn" aria-label="Watchlist"><cdx-icon :icon="cdxIconWatchlist" size="medium" /></button>
            <button class="user-menu-btn" aria-label="User menu">
              <cdx-icon :icon="cdxIconUserAvatar" size="medium" />
              <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
            </button>
          </div>
        </div>
      </header>

      <!-- Header -->
      <header class="header-section" :class="{ 'header-section--minerva': isMinervaSkin }">
        <div v-if="!isMinervaSkin" class="header">
          <!-- Menu Button -->
          <button class="menu-button" aria-label="Menu" @click="toggleSkinMenu">
            <cdx-icon :icon="cdxIconMenu" size="medium" />
          </button>
          <div v-if="isSkinMenuOpen && !isEditMode" class="menu-popup" role="dialog" aria-label="Settings menu" style="padding: 16px;">
            <cdx-field is-fieldset>
              <template #label>Suggestions entry point</template>
              <cdx-radio v-model="readModeSuggestionsEntry" name="read-mode-entry" input-value="badge">
                Icon's modifier in edit action
              </cdx-radio>
              <cdx-radio v-model="readModeSuggestionsEntry" name="read-mode-entry" input-value="toast">
                Navigable banner
              </cdx-radio>
            </cdx-field>
            <div class="menu-popup__toggle-row">
              <cdx-toggle-switch v-model="articleLockToEdit" />
              <span class="menu-popup__toggle-label">Article lock to edit</span>
            </div>
          </div>

          <!-- Wikipedia Logo -->
          <div class="wikipedia-logo">
            <img
              class="wikipedia-wordmark-img"
              :src="wikipediaWordmark"
              width="120"
              height="18"
              alt="Wikipedia"
            />
            <img
              class="wikipedia-tagline-img"
              src="https://en.wikipedia.org/static/images/mobile/copyright/wikipedia-tagline-en-25.svg"
              width="120"
              height="14"
              alt=""
            />
          </div>

          <!-- Search -->
          <div class="search-container">
            <cdx-typeahead-search
              id="typeahead-search-wikipedia"
              form-action="https://en.wikipedia.org/w/index.php"
              :use-button="true"
              :search-results="searchResults"
              :search-footer-url="searchFooterUrl"
              :show-thumbnail="true"
              :highlight-query="true"
              :auto-expand-width="true"
              placeholder="Search"
              @input="onSearchInput"
              @search-result-click="onSearchResultClick"
              @submit="onSearchSubmit"
            >
              <template #default>
                <input type="hidden" name="language" value="en">
                <input type="hidden" name="title" value="Special:Search">
              </template>
              <template #search-footer-text="{ searchQuery }">
                Search Wikipedia for pages containing
                <strong class="cdx-typeahead-search__search-footer__query">
                  {{ searchQuery }}
                </strong>
              </template>
            </cdx-typeahead-search>
          </div>

          <!-- User Tools -->
          <div class="user-tools">
            <a href="#" class="user-link">User1234</a>
            <button class="icon-btn" aria-label="Notifications">
              <cdx-icon :icon="cdxIconBell" size="medium" />
            </button>
            <button class="icon-btn" aria-label="Messages">
              <cdx-icon :icon="cdxIconTray" size="medium" />
            </button>
            <button class="icon-btn" aria-label="Watchlist">
              <cdx-icon :icon="cdxIconWatchlist" size="medium" />
            </button>
            <button class="user-menu-btn" aria-label="User menu">
              <cdx-icon :icon="cdxIconUserAvatar" size="medium" />
              <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
            </button>
          </div>
        </div>

        <div v-else class="header header--minerva">
          <div class="minerva-header-left">
            <button class="menu-button menu-button--minerva" aria-label="Menu" @click="toggleSkinMenu">
              <cdx-icon :icon="cdxIconMenu" size="medium" />
            </button>
            <div v-if="isSkinMenuOpen && !isEditMode" class="menu-popup menu-popup--minerva" role="dialog" aria-label="Settings menu" style="padding: 16px;">
              <cdx-field is-fieldset>
                <template #label>Suggestions entry point</template>
                <cdx-radio v-model="readModeSuggestionsEntry" name="read-mode-entry-minerva" input-value="badge">
                  Icon's modifier in edit action
                </cdx-radio>
                <cdx-radio v-model="readModeSuggestionsEntry" name="read-mode-entry-minerva" input-value="toast">
                  Navigable banner
                </cdx-radio>
              </cdx-field>
              <div class="menu-popup__toggle-row">
                <cdx-toggle-switch v-model="articleLockToEdit" />
                <span class="menu-popup__toggle-label">Article lock to edit</span>
              </div>
            </div>

            <div class="minerva-brand">
              <img
                class="minerva-wordmark-img"
                :src="wikipediaWordmark"
                alt="Wikipedia"
              />
            </div>
          </div>

          <div class="minerva-header-actions">
            <button class="icon-btn" aria-label="Search">
              <cdx-icon :icon="cdxIconSearch" size="medium" />
            </button>
            <button class="icon-btn" aria-label="Notifications">
              <cdx-icon :icon="cdxIconBell" size="medium" />
            </button>
            <button class="icon-btn" aria-label="User account">
              <cdx-icon :icon="cdxIconUserActive" size="medium" />
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <div
        class="main-content-area"
        :class="{ 'has-suggestions': !isMinervaSkin && showSuggestionsDisplay }"
      >
        
        <!-- Table of Contents (Left Sidebar) - Only visible in Read mode -->
        <aside v-if="!isEditMode" class="toc-sidebar">
          <div class="toc-container">
            <div class="toc-header">
              <h2 class="toc-title">Contents</h2>
              <button class="toc-toggle">hide</button>
            </div>
            
            <nav class="toc-nav">
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link toc-link-bold">(Top)</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Early life</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Career</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Poetry</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Prose</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Film</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Theory</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Lorde and womanism</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Personal life</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Last years</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Honors</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Legacy</a>
              </div>
              
              <div class="toc-item">
                <button class="toc-expand">
                  <cdx-icon :icon="cdxIconNext" size="small" />
                </button>
                <a href="#" class="toc-link">Works</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">See also</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Notes</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">References</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">Further reading</a>
              </div>
              
              <div class="toc-item toc-item-no-chevron">
                <a href="#" class="toc-link">External links</a>
              </div>
            </nav>
          </div>
        </aside>
        <button
          v-if="showVectorHelpButton"
          class="help-button vector-help-button"
          type="button"
          aria-label="Help"
        >
          <cdx-icon :icon="cdxIconHelp" size="medium" />
        </button>
        <div
          v-if="showMinervaBanner || showMinervaHelpButton || showMinervaArrowOnly"
          class="minerva-suggestions-bar"
          :class="{ 'minerva-suggestions-bar--arrow-only': showMinervaArrowOnly }"
        >
          <transition name="banner-reveal" appear>
            <div
              v-if="showMinervaArrowOnly && !showMinervaRail"
              class="suggestions-banner-arrow-buttons"
            >
              <cdx-button
                class="suggestions-banner-arrow-btn"
                action="default"
                weight="quiet"
                size="small"
                :disabled="!showBannerArrowUp"
                aria-label="View previous suggestions"
                @click="showSuggestions ? scrollToSuggestionByDirection('up') : null"
                @keydown="showSuggestions ? handleBannerKeydown($event) : null"
              >
                <cdx-icon :icon="cdxIconCollapse" size="medium" />
              </cdx-button>
              <cdx-button
                class="suggestions-banner-arrow-btn"
                action="default"
                weight="quiet"
                size="small"
                :disabled="!showBannerArrowDown"
                aria-label="View next suggestions"
                @click="showSuggestions ? scrollToSuggestionByDirection('down') : null"
                @keydown="showSuggestions ? handleBannerKeydown($event) : null"
              >
                <cdx-icon :icon="cdxIconExpand" size="medium" />
              </cdx-button>
            </div>
            <div
              v-else-if="showMinervaBanner"
              class="suggestions-banner minerva-suggestions-banner"
              :class="{
                'suggestions-banner--empty': bannerSuggestionCount === 0,
                'suggestions-banner--count-button': activePrototype === 'option-1' && bannerSuggestionCount > 0,
                'suggestions-banner--option-2': isFirstSuggestionNavigationMode && bannerSuggestionCount > 0,
                'suggestions-banner--option-3': activePrototype === 'option-3' && bannerSuggestionCount > 0,
                'suggestions-banner--single-use': isFirstSuggestionNavigationMode,
                'suggestions-banner--contextual-up': showBannerPrimaryArrowUp &&
                  (activePrototype === 'option-1' || isFirstSuggestionNavigationMode),
                'suggestions-banner--hidden': !showSuggestionToggle && !showSuggestions,
                'suggestions-banner--clickable': showSuggestions,
                'suggestions-banner--closing': isBannerClosing,
                'suggestions-banner--opening': isBannerOpening,
                'suggestions-banner--scrolled': isEditToolbarScrolled
              }"
              :role="showSuggestions ? 'button' : undefined"
              :tabindex="showSuggestions ? 0 : undefined"
              @click="showSuggestions ? handleBannerClick() : null"
              @keydown="showSuggestions ? handleBannerKeydown($event) : null"
            >
              <div class="suggestions-banner-center">
                <div
                  v-if="showSuggestionToggle || showSuggestions"
                  class="suggestions-banner-text"
                >
                  <template v-if="bannerSuggestionCount === 0">
                    <span>0 suggestions available</span>
                  </template>
                  <template v-else-if="activePrototype === 'option-1'">
                    <span class="suggestions-banner-arrow-btn suggestions-banner-arrow-btn--display">
                      <cdx-icon :icon="showBannerPrimaryArrowUp ? cdxIconArrowUp : cdxIconArrowDown" size="medium" />
                    </span>
                    <span class="banner-text">
                      <span class="banner-text-bold">{{ bannerSuggestionCount }} suggestions</span>
                    </span>
                  </template>
                  <template v-else>
                    <cdx-button
                      v-if="isFirstSuggestionNavigationMode && !isAutoScrollActive"
                      class="suggestions-banner-arrow-btn"
                      action="progressive"
                      weight="quiet"
                      :aria-label="showBannerPrimaryArrowUp ? 'View previous suggestions' : 'View next suggestions'"
                      @click.stop="showSuggestions ? scrollToSuggestionByDirection(showBannerPrimaryArrowUp ? 'up' : 'down') : null"
                      @keydown="showSuggestions ? handleBannerKeydown($event) : null"
                    >
                      <cdx-icon :icon="showBannerPrimaryArrowUp ? cdxIconArrowUp : cdxIconArrowDown" size="medium" />
                    </cdx-button>
                    <cdx-icon
                      v-else
                      :icon="cdxIconArrowDown"
                      size="medium"
                      :class="{ 'suggestions-banner-icon--up': showBannerPrimaryArrowUp }"
                    />
                    <span>View suggestions</span>
                  </template>
                </div>
              </div>
              <div class="suggestions-banner-actions">
                <span v-if="isFirstSuggestionNavigationMode || activePrototype === 'option-1'" class="suggestions-banner-close-icon-container">
                  <cdx-button
                    class="suggestions-banner-close-btn"
                    size="small"
                    action="progressive"
                    weight="quiet"
                    aria-label="Dismiss suggestions"
                    @click.stop="handleBannerClose()"
                  >
                    <cdx-icon class="suggestions-banner-close-icon" :icon="cdxIconClose" size="small" />
                  </cdx-button>
                </span>
              </div>
            </div>
          </transition>
          <button
            v-if="showMinervaHelpButton"
            class="help-button minerva-help-button"
            type="button"
            aria-label="Help"
          >
            <cdx-icon :icon="cdxIconHelp" size="medium" />
          </button>
        </div>

        <!-- Article Content (Center) -->
        <article class="article">
          <div class="article-chrome">
            <!-- Title and Toolbar -->
            <div v-if="!isMinervaSkin" class="title-toolbar">
              <div class="article-title-section">
                <div class="title-and-language">
                  <button class="toc-toggle-btn" aria-label="Toggle table of contents">
                    <cdx-icon :icon="cdxIconListBullet" size="medium" />
                  </button>
                  <h1 class="article-title">Audre Lorde</h1>
                  <button class="language-button">
                    <cdx-icon :icon="cdxIconLanguage" size="medium" class="language-icon" />
                    <span class="language-text">95 Languages</span>
                    <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-small" />
                  </button>
                </div>
                <div class="title-divider"></div>
              </div>

              <div class="toolbar">
                <div class="tabs">
                  <div class="tabs-start">
                    <div class="tab tab-selected">
                      <span class="tab-text">Article</span>
                      <div class="tab-indicator"></div>
                    </div>
                    <div class="tab">
                      <span class="tab-text tab-link">Talk</span>
                    </div>
                  </div>
                  
                  <div class="tabs-end">
                    <div class="tab" :class="{ 'tab-selected': !isEditMode }" @click="handleReadClick">
                      <span class="tab-text" :class="{ 'tab-link': isEditMode }">Read</span>
                      <div v-if="!isEditMode" class="tab-indicator"></div>
                    </div>
                    <div v-if="!articleLockToEdit" class="tab" :class="{ 'tab-selected': isEditMode }" @click="toggleEditMode">
                      <span class="tab-text" :class="{ 'tab-link': !isEditMode }">Edit</span>
                      <div v-if="isEditMode" class="tab-indicator"></div>
                    </div>
                    <div class="tab">
                      <span class="tab-text tab-link">View history</span>
                    </div>
                    <button class="tab-icon-btn">
                      <cdx-icon :icon="cdxIconStar" size="medium" />
                    </button>
                    <button class="tools-toggle-btn" aria-label="Toggle tools">
                      <span class="tools-toggle-text">Tools</span>
                      <cdx-icon :icon="cdxIconExpand" size="small" />
                    </button>
                  </div>
                </div>
                <div class="toolbar-divider"></div>
              </div>
            </div>

            <div v-else-if="!isEditMode" class="minerva-title-toolbar">
              <div class="minerva-title-row">
                <h1 class="minerva-article-title">Audre Lorde</h1>
                <button class="minerva-language-button" aria-label="Language options">
                  <cdx-icon :icon="cdxIconLanguage" size="medium" />
                </button>
              </div>
              <div class="minerva-tabs">
                <button class="minerva-tab minerva-tab--active">
                  Article
                </button>
                <button class="minerva-tab">
                  Talk
                </button>
              </div>
              <div class="minerva-actions">
                <button class="minerva-action-btn" aria-label="Language">
                  <cdx-icon :icon="cdxIconLanguage" size="medium" />
                </button>
                <button class="minerva-action-btn" aria-label="Watch">
                  <cdx-icon :icon="cdxIconWatchlist" size="medium" />
                </button>
                <button class="minerva-action-btn" aria-label="History">
                  <cdx-icon :icon="cdxIconHistory" size="medium" />
                </button>
                <button v-if="!articleLockToEdit" class="minerva-action-btn" aria-label="Edit" @click="toggleEditMode">
                  <img
                    v-if="readModeSuggestionsEntry === 'badge'"
                    :src="iconEditLightbulb"
                    width="24"
                    height="24"
                    alt=""
                    aria-hidden="true"
                    class="minerva-action-icon-img"
                  />
                  <cdx-icon v-else :icon="cdxIconEdit" size="medium" />
                </button>
                <button class="minerva-action-btn" aria-label="More actions">
                  <cdx-icon :icon="cdxIconEllipsis" size="medium" class="minerva-ellipsis-icon" />
                </button>
              </div>
            </div>

            <p v-if="!isEditMode && !isMinervaSkin" class="article-tagline">From Wikipedia, the free encyclopedia</p>
            <p v-else-if="!isEditMode && isMinervaSkin" class="article-tagline article-tagline--minerva">From Wikipedia, the free encyclopedia</p>
          </div>

          <!-- Article Content -->
          <div v-if="!isEditMode && !isMinervaSkin" class="article-content-section">
            <div class="article-ve-contents">
              <div class="article-content-grid">
                <!-- Main Article Text -->
                <div class="article-text">
                  <div class="intro-text">
                    <p>
                      <strong>Audre Lorde</strong> (<a href="https://en.wikipedia.org/wiki/Help:IPA/English" target="_blank" rel="noopener">/ˈɔːdri ˈlɔːrd/</a> <em>AW-dree LORD</em>; born <strong>Audrey Geraldine Lorde</strong>; February 18, 1934 – November 17, 1992) was an American writer, <a href="https://en.wikipedia.org/wiki/Professor" target="_blank" rel="noopener">professor</a>, <a href="https://en.wikipedia.org/wiki/Philosopher" target="_blank" rel="noopener">philosopher</a>, intersectional <a href="https://en.wikipedia.org/wiki/Feminism" target="_blank" rel="noopener">feminist</a>, <a href="https://en.wikipedia.org/wiki/Poet" target="_blank" rel="noopener">poet</a>, and <a href="https://en.wikipedia.org/wiki/Civil_rights_movement" target="_blank" rel="noopener">civil rights activist</a>.<sup class="citation-marker">[1]</sup> She described herself as a "Black, lesbian, feminist, socialist, mother, warrior, poet" and wrote across poetry, essays, and speeches about racism, sexism, classism, and homophobia.<sup class="citation-marker">[2]</sup>
                    </p>
                    <p>
                      Lorde argued that there could be no hierarchy of oppressions among people committed to liberation, a position that became central to her public work and writing.<sup class="citation-marker">[3]</sup> As a poet, she is known for technical precision and emotional force, and her work frequently addresses civil rights, feminism, lesbian identity, illness, disability, and Black womanhood.<sup class="citation-marker">[4]</sup><sup class="citation-marker">[5]</sup> She also co-founded <a href="https://en.wikipedia.org/wiki/Kitchen_Table:_Women_of_Color_Press" target="_blank" rel="noopener">Kitchen Table: Women of Color Press</a>.<sup class="citation-marker">[6]</sup>
                    </p>
                  </div>

                  <!-- Early Life Section -->
                  <div class="section-heading" data-read-section="early-life">
                    <div class="section-heading-row">
                      <h2 class="heading-text">Early life</h2>
                      <span v-if="!articleLockToEdit" class="section-edit">
                        <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('early-life')">edit</a><span class="section-edit-bracket">]</span>
                        <img
                          v-if="!isEditMode && readModeSuggestionsEntry === 'badge'"
                          :src="iconLightbulb"
                          width="16"
                          height="16"
                          class="section-edit-lightbulb"
                          title="Suggestions available in this section"
                          alt="Suggestions available in this section"
                        />
                      </span>
                    </div>
                    <div class="heading-divider"></div>
                  </div>

                  <div class="body-text">
                    <p>
                      Lorde was born on February 18, 1934, in <a href="https://en.wikipedia.org/wiki/New_York_City" target="_blank" rel="noopener">New York City</a> to Caribbean immigrants Frederick Byron Lorde and Linda Gertrude Belmar Lorde.<sup class="citation-marker">[7]</sup> Her father was born in <a href="https://en.wikipedia.org/wiki/Barbados" target="_blank" rel="noopener">Barbados</a>, and her mother was born on <a href="https://en.wikipedia.org/wiki/Carriacou" target="_blank" rel="noopener">Carriacou</a>, in <a href="https://en.wikipedia.org/wiki/Grenada" target="_blank" rel="noopener">Grenada</a>.<sup class="citation-marker">[8]</sup> Her mother sometimes passed as Spanish for work, while her father's darker skin was a source of tension with the Belmar family.<sup class="citation-marker">[9]</sup>
                    </p>
                    <p>
                      The family settled in <a href="https://en.wikipedia.org/wiki/Harlem" target="_blank" rel="noopener">Harlem</a>, where Lorde grew up as the youngest of three daughters and was <a href="https://en.wikipedia.org/wiki/Myopia" target="_blank" rel="noopener">nearsighted</a> to the point of being legally blind.<sup class="citation-marker">[10]</sup> At age four she learned to read as she was learning to speak, with help from librarian <a href="https://en.wikipedia.org/wiki/Augusta_Braxton_Baker" target="_blank" rel="noopener">Augusta Braxton Baker</a> at the 135th Street branch of the <a href="https://en.wikipedia.org/wiki/New_York_Public_Library" target="_blank" rel="noopener">New York Public Library</a>, and her mother taught her to write soon after.<sup class="citation-marker">[11]</sup>
                    </p>
                    <p>
                      Born Audrey Geraldine Lorde, she dropped the "y" from her first name while still a child, later explaining in <em><a href="https://en.wikipedia.org/wiki/Zami:_A_New_Spelling_of_My_Name" target="_blank" rel="noopener">Zami: A New Spelling of My Name</a></em> that she preferred the visual symmetry of “Audre Lorde.”<sup class="citation-marker">[12]</sup> She attended Catholic schools, later studied at <a href="https://en.wikipedia.org/wiki/Hunter_College_High_School" target="_blank" rel="noopener">Hunter College High School</a>, and published her first poem in <a href="https://en.wikipedia.org/wiki/Seventeen_(American_magazine)" target="_blank" rel="noopener">Seventeen</a> after her school literary journal rejected it.<sup class="citation-marker">[13]</sup><sup class="citation-marker">[14]</sup><sup class="citation-marker">[15]</sup>
                    </p>
                    <p>
                      Lorde later wrote that poetry became an essential way to understand and articulate her feelings, and she described herself as someone who thought in poetry from childhood onward.<sup class="citation-marker">[16]</sup>
                    </p>
                  </div>
                </div>

                <!-- Infobox -->
                <aside class="infobox">
                  <div class="infobox-title">Audre Lorde</div>
                  
                  <div class="infobox-image-section">
                    <div class="infobox-image">
                      <img :src="audreImage" alt="Audre Lorde in 1980" />
                    </div>
                    <div class="infobox-caption">Lorde in 1980</div>
                  </div>

                  <div class="infobox-row">
                    <div class="infobox-label">Born</div>
                    <div class="infobox-value">
                      Audrey Geraldine Lorde<br>
                      February 18, 1934[1]<br>
                      <a href="#">New York City</a>, U.S.
                    </div>
                  </div>

                  <div class="infobox-row infobox-row-faded">
                    <div class="infobox-label">Died</div>
                    <div class="infobox-value">
                      November 17, 1992 (aged 58)<br>
                      <a href="#">Saint Croix, Virgin Islands</a>, U.S.
                    </div>
                  </div>

                  <div class="infobox-row">
                    <div class="infobox-label">Education</div>
                    <div class="infobox-value infobox-value-link">
                      <a href="#">National Autonomous University of Mexico</a><br>
                      <a href="#">Hunter College (BA)</a><br>
                      <a href="#">Columbia University (MLS)</a>
                    </div>
                  </div>

                  <div class="infobox-row">
                    <div class="infobox-label">Genre</div>
                    <div class="infobox-value">
                      Poetry<br>
                      Nonfiction
                    </div>
                  </div>

                  <div class="infobox-row">
                    <div class="infobox-label">Notable works</div>
                    <div class="infobox-value infobox-value-link">
                      The First Cities<br>
                      <a href="#">Zami: A New Spelling of My Name</a><br>
                      <a href="#">The Cancer Journals</a>
                    </div>
                  </div>
                </aside>
              </div>
            </div>

            <!-- Career Section -->
            <div class="section-heading" data-read-section="career">
              <div class="section-heading-row">
                <h2 class="heading-text">Career</h2>
                <span v-if="!articleLockToEdit" class="section-edit">
                  <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('career')">edit</a><span class="section-edit-bracket">]</span>
                  <img
                    v-if="!isEditMode && readModeSuggestionsEntry === 'badge'"
                    :src="iconLightbulb"
                    width="16"
                    height="16"
                    class="section-edit-lightbulb"
                    title="Suggestions available in this section"
                    alt="Suggestions available in this section"
                  />
                </span>
              </div>
              <div class="heading-divider"></div>
            </div>

            <div class="body-text">
              <p>
                In 1954, she spent a pivotal year as a student at the <a href="#">National Autonomous University of Mexico</a>, a period she described as a time of affirmation and renewal. During this time, she confirmed her identity on personal and artistic levels as both a lesbian and a poet. On her return to New York, Lorde attended <a href="#">Hunter College</a>, and graduated in the class of 1959. While there, she worked as a librarian, continued writing, and became an active participant in the <a href="#">gay culture</a> of <a href="#">Greenwich Village</a>. She furthered her education at the <a href="#">Columbia University School of Library Service</a>, earning a master's degree in <a href="#">library science</a> in 1961. During this period, she worked as a public librarian in nearby <a href="#">Mount Vernon, New York</a>.
              </p>
                            <p>
                In 1968 Lorde was writer-in-residence at <a href="#">Tougaloo College</a> in Mississippi. Lorde's time at Tougaloo College, like her year at the <a href="#">National University of Mexico</a>, was a formative experience for her as an artist. She led workshops with her young, black undergraduate students, many of whom were eager to discuss the <a href="#">civil rights</a> issues of that time. Through these discussions with her students, she reaffirmed her desire not only to live out her "crazy and queer" identity, but also to devote attention to the formal aspects of her craft as a poet. Her book of poems, <em>Cables to Rage</em>, came out of her time and experiences at Tougaloo.
              </p>
                            <p>
                From 1972 to 1987, Lorde resided on <a href="#">Staten Island</a>. During that time, in addition to writing and teaching she co-founded <a href="#">Kitchen Table: Women of Color Press</a>.
              </p>
                            <p>
                In 1977, Lorde became an associate of the <a href="#">Women's Institute for Freedom of the Press</a> (WIFP). WIFP is an American nonprofit publishing organization. The organization works to increase communication between women and connect the public with forms of women-based media.
              </p>
                            <p>
                Lorde taught in the Education Department at <a href="#">Lehman College</a> from 1969 to 1970, then as a professor of English at <a href="#">John Jay College of Criminal Justice</a> (both part of the <a href="#">City University of New York</a>, CUNY) from 1970 to 1981. There, she fought for the creation of a <a href="#">black studies</a> department. In 1981, she went on to teach at her alma mater, <a href="#">Hunter College</a> (also CUNY), as the distinguished Thomas Hunter chair. As a queer Black woman, she was an outsider in a <a href="#">white male</a> dominated field and her experiences in this environment deeply influenced her work. New fields such as <a href="#">African American studies</a> and <a href="#">women's studies</a> advanced the topics that scholars were addressing and garnered attention to groups that had previously been rarely discussed. With this newfound <a href="#">academic</a> environment, Lorde was inspired to not only write poetry but also essays and articles about queer, feminist, and African American studies.
              </p>
                            <p>
                In 1980, together with <a href="#">Barbara Smith</a> and <a href="#">Cherríe Moraga</a>, she co-founded <a href="#">Kitchen Table: Women of Color Press</a>, the first U.S. publisher for women of color.
              </p>
                            <p>
                In 1981, Lorde was among the founders of the Women's Coalition of St. Croix, an organization dedicated to assisting women who have survived sexual abuse and <a href="#">intimate partner violence</a>. In the late 1980s, she also helped establish Sisterhood in Support of Sisters (SISA) in South Africa to benefit black women who were affected by <a href="#">apartheid</a> and other forms of injustice.
              </p>
                            <p>
                In 1985, Audre Lorde was a part of a delegation of <a href="#">black women</a> writers who had been invited to <a href="#">Cuba</a>. The trip was sponsored by <em>The Black Scholar</em> and the Union of Cuban Writers. She embraced the shared sisterhood as black women writers. They visited Cuban poets <a href="#">Nancy Morejón</a> and <a href="#">Nicolas Guillén</a>. They discussed whether the Cuban revolution had truly changed racism and the status of lesbians and gays there.
              </p>
            </div>

            <!-- Poetry Section -->
            <div class="section-heading" data-read-section="poetry">
              <div class="section-heading-row">
                <h2 class="heading-text">Poetry</h2>
                <span v-if="!articleLockToEdit" class="section-edit">
                  <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('poetry')">edit</a><span class="section-edit-bracket">]</span>
                  <img
                    v-if="!isEditMode && readModeSuggestionsEntry === 'badge'"
                    :src="iconLightbulb"
                    width="16"
                    height="16"
                    class="section-edit-lightbulb"
                    title="Suggestions available in this section"
                    alt="Suggestions available in this section"
                  />
                </span>
              </div>
              <div class="heading-divider"></div>
            </div>

            <div class="body-text">
              <p>
                Lorde focused her discussion of difference not only on differences between groups of women but between conflicting differences within the individual. "I am defined as other in every group I'm part of," she declared. "Yet without community," Lorde wrote, "there is certainly no liberation, no future, only the most vulnerable and temporary armistice between me and my oppression". She described herself both as a part of a "continuum of women" and a "concert of voices" within herself.
              </p>
                            <p>
                Her conception of her many layers of selfhood is replicated in the multi-genres of her work. Critic Carmen Birkle wrote: "Her multicultural self is thus reflected in a multicultural text, in multi-genres, in which the individual cultures are no longer separate and autonomous entities but melt into a larger whole without losing their individual importance." Her refusal to be placed in a particular category, whether social or literary, was characteristic of her determination to come across as an individual rather than a stereotype. Lorde considered herself a "lesbian, mother, warrior, poet" and used poetry to get this message across.
              </p>
                            <h3 class="subsection-title">Early works</h3>
                            <p>
                Lorde's poetry was published very regularly during the 1960s - in Langston Hughes' 1962 New Negro Poets, USA; in several foreign anthologies; and in black literary magazines. During this time, she was also politically active in civil rights, anti-war, and feminist movements.
              </p>
                            <p>
                In 1968, Lorde published The First Cities, her first volume of poems. It was edited by Diane di Prima, a former classmate and friend from Hunter College High School. The First Cities has been described as a "quiet, introspective book", and Dudley Randall, a poet and critic, asserted in his review of the book that Lorde "does not wave a black flag, but her Blackness is there, implicit, in the bone".
              </p>
                            <p>
                Her second volume, Cables to Rage (1970), which was mainly written during her tenure as poet-in-residence at Tougaloo College in Mississippi, addressed themes of love, betrayal, childbirth, and the complexities of raising children. It is particularly noteworthy for the poem "Martha", in which Lorde openly confirms her homosexuality for the first time in her writing: "[W]e shall love each other here if ever at all".
              </p>
                            <p>
                Nominated for the National Book Award for poetry in 1974, From a Land Where Other People Live (Broadside Press) shows Lorde's personal struggles with identity and anger at social injustice. The volume deals with themes of anger, loneliness, and injustice, as well as what it means to be a black woman, mother, friend, and lover.
              </p>
                            <p>
                1974 saw the release of New York Head Shop and Museum, which gives a picture of Lorde's New York through the lenses of both the civil rights movement and her own restricted childhood: stricken with poverty and neglect and, in Lorde's opinion, in need of political action.
              </p>
                            <h3 class="subsection-title">Wider recognition</h3>
                            <p>
                Despite the success of these volumes, it was the release of Coal in 1976 that established Lorde as an influential voice in the Black Arts Movement, and the large publishing house behind it - Norton - helped introduce her to a wider audience. The volume includes poems from both The First Cities and Cables to Rage, and it unites many of the themes Lorde would become known for throughout her career: her rage at racial injustice, her celebration of her black identity, and her call for an intersectional consideration of women's experiences. Lorde followed Coal up with Between Our Selves (also in 1976) and Hanging Fire (1978).
              </p>
                            <p>
                In Lorde's volume The Black Unicorn (1978), she describes her identity within the mythos of African female deities of creation, fertility, and warrior strength. This reclamation of African female identity both builds and challenges existing Black Arts ideas about pan-Africanism. While writers like Amiri Baraka and Ishmael Reed utilized African cosmology in a way that "furnished a repertoire of bold male gods capable of forging and defending an aboriginal Black universe," in Lorde's writing "that warrior ethos is transferred to a female vanguard capable equally of force and fertility".
              </p>
                            <p>
                Lorde's poetry became more open and personal as she grew older and became more confident in her sexuality. In Sister Outsider: Essays and Speeches, Lorde states, "Poetry is the way we help give name to the nameless so it can be thought... As they become known to and accepted by us, our feelings and the honest exploration of them become sanctuaries and spawning grounds for the most radical and daring ideas." Sister Outsider also elaborates Lorde's challenge to European-American traditions.
              </p>
            </div>

            <!-- Prose Section -->
            <div class="section-heading" data-read-section="prose">
              <div class="section-heading-row">
                <h2 class="heading-text">Prose</h2>
                <span v-if="!articleLockToEdit" class="section-edit">
                  <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('prose')">edit</a><span class="section-edit-bracket">]</span>
                </span>
              </div>
              <div class="heading-divider"></div>
            </div>

            <div class="body-text">
              <p>
                The Cancer Journals (1980) and A Burst of Light (1988) both use non-fiction prose, including essays and journal entries, to bear witness to, explore, and reflect on Lorde's diagnosis, treatment, recovery from breast cancer, and ultimately fatal recurrence with liver metastases. In both works, Lorde deals with Western notions of illness, disability, treatment, cancer and sexuality, and physical beauty and prosthesis, as well as themes of death, fear of mortality, survival, emotional healing, and inner power.
              </p>
                            <p>
                Lorde's deeply personal book Zami: A New Spelling of My Name (1982), subtitled a "biomythography", chronicles her childhood and adulthood. The narrative deals with the evolution of Lorde's sexuality and self-awareness.
              </p>
                            <h3 class="subsection-title">Sister Outsider</h3>
                            <p>
                In Sister Outsider: Essays and Speeches (1984), Lorde asserts the necessity of communicating the experience of marginalized groups to make their struggles visible in a repressive society. She emphasizes the need for different groups of people (particularly white women and African-American women) to find common ground in their experiences in life, but also to face difference directly, and use it as a source of strength rather than alienation. She repeatedly emphasizes the need for community in the struggle to build a better world. How to constructively channel the anger and rage incited by oppression is another prominent theme throughout her works, and in this collection in particular.
              </p>
                            <p>
                Her most famous essay, "The Master's Tools Will Never Dismantle the Master's House", is included in Sister Outsider. Lorde questions the scope and ability for change to be instigated when examining problems through a racist, patriarchal lens. She insists that women see differences between other women not as something to be tolerated, but something that is necessary to generate power and to actively "be" in the world. This will create a community that embraces differences, which will ultimately lead to liberation. Lorde elucidates, "Divide and conquer, in our world, must become define and empower." Also, people must educate themselves about the oppression of others because expecting a marginalized group to educate the oppressors is the continuation of racist, patriarchal thought. She explains that this is a major tool utilized by oppressors to keep the oppressed occupied with the master's concerns. She concludes that to bring about real change, we cannot work within the racist, patriarchal framework because change brought about in that will not remain.
              </p>
                            <p>
                Also in Sister Outsider is the essay, "The Transformation of Silence into Language and Action". Lorde discusses the importance of speaking, even when afraid, because otherwise silence immobilizes and chokes us. Many people fear to speak the truth because of the real risks of retaliation, but Lorde warns, "Your silence does not protect you." Lorde emphasizes that "the transformation of silence into language and action is a self-revelation, and that always seems fraught with danger." People are afraid of others' reactions for speaking, but mostly for demanding visibility, which is essential to live. Lorde adds, "We can sit in our corners mute forever while our sisters and ourselves are wasted, while our children are distorted and destroyed, while our earth is poisoned; we can sit in our safe corners mute as bottles, and we will still be no less afraid." "People are taught to respect their fear of speaking more than silence, but ultimately, the silence will choke us anyway, so we might as well speak the truth." Lorde writes that we can learn to speak even when we are afraid.
              </p>
                            <p>
                In "Age, Race, Class, and Sex: Women Redefining Difference", Lorde emphasizes the importance of educating others. However, she stresses that in order to educate others, one must first be educated. Empowering people who are doing the work does not mean using privilege to overstep and overpower such groups; but rather, privilege must be used to hold door open for other allies. Lorde describes the inherent problems within society by saying, "racism, the belief in the inherent superiority of one race over all others and thereby the right to dominance. Sexism, the belief in the inherent superiority of one sex over the other and thereby the right to dominance. Ageism. Heterosexism. Elitism. Classism." Lorde finds herself among some of these "deviant" groups in society, which set the tone for the status quo and what "not to be" in society. Lorde argues that women feel pressure to conform to their "oneness" before recognizing the separation among them due to their "manyness", or aspects of their identity. She stresses that this behavior is exactly what "explains feminists' inability to forge the kind of alliances necessary to create a better world".
              </p>
                            <p>
                In relation to non-intersectional feminism in the United States, Lorde famously said:
              </p>
                            <p>
                Those of us who stand outside the circle of this society's definition of acceptable women; those of us who have been forged in the crucibles of difference -- those of us who are poor, who are lesbians, who are Black, who are older -- know that survival is not an academic skill. It is learning how to take our differences and make them strengths. For the master's tools will never dismantle the master's house. They may allow us temporarily to beat him at his own game, but they will never enable us to bring about genuine change. And this fact is only threatening to those women who still define the master's house as their only source of support.
              </p>
                            <p>
                — Audre Lorde, The Master's Tools Will Never Dismantle the Master's House, Sister Outsider: Essays and Speeches (1984)
              </p>
            </div>

            <!-- Film Section -->
            <div class="section-heading" data-read-section="film">
              <div class="section-heading-row">
                <h2 class="heading-text">Film</h2>
                <span v-if="!articleLockToEdit" class="section-edit">
                  <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('film')">edit</a><span class="section-edit-bracket">]</span>
                </span>
              </div>
              <div class="heading-divider"></div>
            </div>

            <div class="body-text">
              <p>
                Lorde had several films that highlighted her journey as an <a href="https://en.wikipedia.org/wiki/Activism" target="_blank" rel="noopener">activist</a> in the 1980s and 1990s.<sup class="citation-marker">[50]</sup>
              </p>
              <h3 class="subsection-title">The Berlin years</h3>
              <p>
                <em>The Berlin Years: 1984–1992</em> documented Lorde's time in Germany as she led <a href="https://en.wikipedia.org/wiki/Afro-Germans" target="_blank" rel="noopener">Afro-Germans</a> in a movement that would allow black people to establish identities for themselves outside of stereotypes and discrimination. After a long history of systemic racism in Germany, Lorde introduced a new sense of empowerment for minorities. As seen in the film, she walks through the streets with pride despite stares and words of discouragement. Including moments like these in a documentary was important for people to see during that time. It inspired them to take charge of their identities and discover who they are outside of the labels put on them by society. The film also educates people on the history of racism in Germany. This enables viewers to understand how Germany reached this point in history and how the society developed. Through her promotion of the study of history and her example of taking her experiences in her stride, she influenced people of many different backgrounds.<sup class="citation-marker">[51]</sup>
              </p>
              <p>
                The film documents Lorde's efforts to empower and encourage women to start the Afro-German movement. What began as a few friends meeting in a friend's home to get to know other black people, turned into what is now known as the Afro-German movement. Lorde inspired black women to refute the designation of "<a href="https://en.wikipedia.org/wiki/Mulatto" target="_blank" rel="noopener">Mulatto</a>", a label which was imposed on them, and switch to the newly coined, self-given "<a href="https://en.wikipedia.org/wiki/Afro-Germans" target="_blank" rel="noopener">Afro-German</a>", a term that conveyed a sense of pride. Lorde inspired Afro-German women to create a community of like-minded people. Some Afro-German women, such as <a href="https://en.wikipedia.org/wiki/Ika_H%C3%BCgel-Marshall" target="_blank" rel="noopener">Ika Hügel-Marshall</a>, had never met another black person and the meetings offered opportunities to express thoughts and feelings.<sup class="citation-marker">[52]</sup>
              </p>
              <p>
                <em>Body of a Poet: 1995</em> was written as a tribute biopic written to honor Lorde. The film centers on the efforts of a young group of lesbians of color. The film celebrates the life and work of Audre Lorde from her birth to her death.<sup class="citation-marker">[53]</sup>
              </p>
            </div>

            <!-- Theory Section -->
            <div class="section-heading" data-read-section="theory">
              <div class="section-heading-row">
                <h2 class="heading-text">Theory</h2>
                <span v-if="!articleLockToEdit" class="section-edit">
                  <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('theory')">edit</a><span class="section-edit-bracket">]</span>
                </span>
              </div>
              <div class="heading-divider"></div>
            </div>

            <div class="body-text">
              <p>
                Her writings are based on the "theory of difference", the idea that the binary opposition between men and women is overly simplistic; although feminists have found it necessary to present the illusion of a solid, unified whole, the category of women itself is full of subdivisions.<sup class="citation-marker">[61]</sup>
              </p>
              <p>
                Lorde identified issues of race, class, age and ageism, sex and sexuality and, later in her life, chronic illness and disability; the latter becoming more prominent in her later years as she lived with cancer. She wrote of all of these factors as fundamental to her experience of being a woman. She argued that, although differences in gender have received all the focus, it is essential that these other differences are also recognized and addressed. "Lorde," writes <a href="https://de.wikipedia.org/wiki/Carmen_Birkle" target="_blank" rel="noopener">Carmen Birkle</a>, "puts her emphasis on the authenticity of experience. She wants her difference acknowledged but not judged; she does not want to be subsumed into the one general category of 'woman.'"<sup class="citation-marker">[62]</sup> This theory is today known as <a href="https://en.wikipedia.org/wiki/Intersectionality" target="_blank" rel="noopener">intersectionality</a>.<sup class="citation-marker">[63]</sup>
              </p>
              <p>
                While acknowledging that the differences between women are wide and varied, most of Lorde's works are concerned with two subsets that concerned her primarily – race and sexuality. In <a href="https://en.wikipedia.org/wiki/A_Litany_for_Survival:_The_Life_and_Work_of_Audre_Lorde" target="_blank" rel="noopener">Ada Gay Griffin and Michelle Parkerson's documentary <em>A Litany for Survival: The Life and Work of Audre Lorde</em></a>, Lorde says, "Let me tell you first about what it was like being a Black woman poet in the '60s, from jump. It meant being invisible. It meant being really invisible. It meant being doubly invisible as a Black feminist woman and it meant being triply invisible as a Black lesbian and feminist".<sup class="citation-marker">[64]</sup>
              </p>
              <p>
                <em>Front cover art for the 1984 publication of the book <a href="https://en.wikipedia.org/wiki/Sister_Outsider" target="_blank" rel="noopener">Sister Outsider</a> by Audre Lorde.</em>
              </p>
              <p>
                In her essay "The Erotic as Power", written in 1978 and collected in <a href="https://en.wikipedia.org/wiki/Sister_Outsider" target="_blank" rel="noopener">Sister Outsider</a>, Lorde theorizes the Erotic as a site of power for women only when they learn to release it from its suppression and embrace it, without the sexualized meaning it often holds in mainstream society. She proposes that the Erotic needs to be explored and experienced wholeheartedly, because it exists not only in reference to sexuality and the sexual, but also as a feeling of enjoyment, love, and thrill that is felt towards any task or experience that satisfies women in their lives, be it reading a book or loving one's job.<sup class="citation-marker">[65]</sup> She dismisses "the false belief that only by the suppression of the erotic within our lives and consciousness can women be truly strong. But that strength is illusory, for it is fashioned within the context of male models of power".<sup class="citation-marker">[66]</sup> She explains how patriarchal society has misnamed it and used it against women, causing women to fear it. Women also fear it because the erotic is powerful and a deep feeling. Women must share each other's power rather than use it without consent, which is abuse. They should do it as a method to connect everyone in their differences and similarities. Utilizing the erotic as power allows women to use their knowledge and power to face the issues of racism, patriarchy, and our anti-erotic society.<sup class="citation-marker">[65]</sup> She claims that the erotic can be used as a source of power for women to live with passion in all areas of their life. With the erotic guiding life, Lorde encourages women to use the erotic as a compass to identify what holds value in women's lives. Furthermore, Lorde criticizes the idea of <a href="https://en.wikipedia.org/wiki/Compulsory_heterosexuality" target="_blank" rel="noopener">compulsory heterosexuality</a> and the idea that women's happiness will come through marriage, god, or religion. The idea of the erotic will empower women to not settle for what is conventionally expected or safe leaning into the idea of resisting patriarchal values put in place over women and their sexuality. Lorde sees the suppression of the erotic or conformity to heterosexual norms as a form of control over women. In order to assume control over oneself, she urges women to reclaim the erotic and assert control. She erases the erotic differences that lie between varying sexualities in order to promote these desires as a creative force for revolutionary change.<sup class="citation-marker">[65]</sup> While rejecting compulsory heterosexuality, this is a prevalent motif in Uses of the Erotic, and it still carries some heteronormative undertones. The erotic Lorde proposes both promotes this ideal, as "the aim of each thing which we do is to make our lives and the lives of our children richer and more possible. Within the celebration of the erotic in all our endeavours, my work becomes a conscious decision - a longed-for bed which I enter gratefully and from which I rise up empowered," explaining how wielding the erotic as preserving the future for women and children alike.<sup class="citation-marker">[67]</sup> Another feminist philosopher, <a href="https://en.wikipedia.org/wiki/Lee_Edelman" target="_blank" rel="noopener">Lee Edelman</a>, discusses the culture of heteronormativity as a structure upheld through reproduction and the perception of children as the future which relates to this quote as lending to heteronormative culture, despite her rejection of it. Lorde also lends to this reproductive theory by her establishing the root of the erotic as a, "deeply female and spiritual plane, firmly rooted in the power of our unexpressed or unrecognized feeling," imbuing to women that it is inherent to their womanhood. This supports a binary reality by asserting an essentialist view of gender and sex. Essentialism is debated among third-wave feminists and illustrated how intersectionality in third-wave feminism is approached differently than that of fourth-wave feminism.
              </p>
              <h3 class="subsection-title theory-subheading">Feminist thought</h3>
              <p>
                Lorde set out to confront issues of racism in feminist thought. She maintained that a great deal of the scholarship of White feminists served to augment the oppression of black women, a conviction that led to angry confrontation, most notably in a blunt open letter addressed to the fellow radical lesbian feminist <a href="https://en.wikipedia.org/wiki/Mary_Daly" target="_blank" rel="noopener">Mary Daly</a>, to which Lorde claimed she received no reply.<sup class="citation-marker">[68]</sup> Daly's reply letter to Lorde,<sup class="citation-marker">[69]</sup> dated four months later, was found in 2003 in Lorde's files after she died.<sup class="citation-marker">[70]</sup>
              </p>
              <p>
                This fervent disagreement with notable White feminists furthered Lorde's persona as an outsider: "In the institutional milieu of black feminist and black lesbian feminist scholars ... and within the context of conferences sponsored by White feminist academics, Lorde stood out as an angry, accusatory, isolated black feminist lesbian voice".<sup class="citation-marker">[71]</sup>
              </p>
              <p>
                The criticism was not one-sided: many White feminists were angered by Lorde's brand of feminism. In her 1984 essay "The Master's Tools Will Never Dismantle the Master's House",<sup class="citation-marker">[72]</sup> Lorde attacked what she believed was underlying racism within feminism, describing it as unrecognized dependence on the patriarchy. She argued that, by denying difference in the category of women, White feminists merely furthered old systems of oppression and that, in so doing, they were preventing any real, lasting change. Her argument aligned White feminists who did not recognize race as a feminist issue with White male slave-masters, describing both as "agents of oppression".<sup class="citation-marker">[73]</sup>
              </p>
              <h3 class="subsection-title theory-subheading">Lorde's comments on feminism</h3>
              <p>
                Lorde held that the key tenets of feminism were that all forms of oppression were interrelated; creating change required taking a public stand; differences should not be used to divide; revolution is a process; feelings are a form of self-knowledge that can inform and enrich activism; and acknowledging and experiencing pain helps women to transcend it.<sup class="citation-marker">[74]</sup>
              </p>
              <p>
                In Lorde's "Age, Race, Class, and Sex: Women Redefining Difference", she writes: "Certainly there are very real differences between us of race, age, and sex. But it is not those differences between us that are separating us. It is rather our refusal to recognize those differences, and to examine the distortions which result from our misnaming them and their effects upon human behavior and expectation." More specifically she states: "As White women ignore their built-in privilege of Whiteness and define woman in terms of their own experience alone, then women of color become 'other'."<sup class="citation-marker">[75]</sup> Self-identified as "a forty-nine-year-old Black lesbian feminist socialist mother of two,<sup class="citation-marker">[75]</sup> Lorde is considered as "other, deviant, inferior, or just plain wrong"<sup class="citation-marker">[75]</sup> in the eyes of the normative "White male heterosexual capitalist" social hierarchy. "We speak not of human difference, but of human deviance,"<sup class="citation-marker">[75]</sup> she writes. In this respect, her ideology coincides with <a href="https://en.wikipedia.org/wiki/Womanism" target="_blank" rel="noopener">womanism</a>, which "allows Black women to affirm and celebrate their color and culture in a way that feminism does not."
              </p>
              <p>
                Lorde defines racism, sexism, ageism, heterosexism, elitism and classism altogether and explains that an "ism" is an idea that what is being privileged is superior and has the right to govern anything else.<sup class="citation-marker">[76]</sup> Lorde argues that a mythical norm is what all bodies should be. According to Lorde, the mythical norm of US culture is White, thin, male, young, heterosexual, Christian, financially secure.<sup class="citation-marker">[75]</sup>
              </p>
              <h3 class="subsection-title theory-subheading">Influences on black feminism</h3>
              <p>
                Lorde's work on black feminism continues to be examined by scholars today. Jennifer C. Nash examines how black feminists acknowledge their identities and find love for themselves through those differences.<sup class="citation-marker">[77]</sup> Nash cites Lorde, who writes: "I urge each one of us here to reach down into that deep place of knowledge inside herself and touch that terror and loathing of any difference that lives there. See whose face it wears. Then the personal as the political can begin to illuminate all our choices."<sup class="citation-marker">[77]</sup> Nash explains that Lorde is urging black feminists to embrace politics rather than fear it, which will lead to an improvement in society for them. Lorde adds, "Black women sharing close ties with each other, politically or emotionally, are not the enemies of Black men. Too frequently, however, some Black men attempt to rule by fear those Black women who are more ally than enemy."<sup class="citation-marker">[78]</sup>
              </p>
              <p>
                Lorde's 1979 essay "Sexism: An American Disease in Blackface" is a sort of rallying cry to confront sexism in the black community in order to eradicate the violence within it.<sup class="citation-marker">[6]</sup> Lorde insists that the fight between black women and men must end to end racist politics.
              </p>
              <p>
                In 1981, Lorde and a fellow writer friend, Barbara Smith founded <a href="https://en.wikipedia.org/wiki/Kitchen_Table:_Women_of_Color_Press" target="_blank" rel="noopener">Kitchen Table: Women of Color Press</a> which was dedicated to helping other black feminist writers by provided resources, guidance and encouragement. Lorde encouraged those around her to celebrate their differences such as race, sexuality or class instead of dwelling upon them, and wanted everyone to have similar opportunities.<sup class="citation-marker">[79]</sup>
              </p>
              <h3 class="subsection-title theory-subheading">Personal identity</h3>
              <p>
                Throughout Lorde's career she included the idea of a collective identity in many of her poems and books. She did not just identify with one category but she wanted to celebrate all parts of herself equally.<sup class="citation-marker">[80]</sup>
              </p>
              <p>
                She was known to describe herself as black, lesbian, political activist, feminist, poet, mother, etc. In her novel <em>Zami: A New Spelling of My Name</em>, Lorde focuses on how her many different identities shape her life and the different experiences she has because of them. She shows us that personal identity is found within the connections between seemingly different parts of one's life, based on experiences, and that one's authority to speak comes from these experiences. Personal identity is often associated with the visual aspect of a person, but as Lies Xhonneux theorizes when identity is singled down to just what you see, some people, even within minority groups, can become invisible.<sup class="citation-marker">[81]</sup>
              </p>
              <p>
                Lorde's work also focused on the importance of acknowledging, respecting and celebrating our differences as well as our commonalities in defining identity. In <em>The Master's Tools</em>, she wrote that many people choose to pretend the differences between us do not exist, or that these differences are insurmountable, adding, "Difference must be not merely tolerated, but seen as a fund of necessary polarities between which our creativity can spark like a dialectic."<sup class="citation-marker">[82]</sup>
              </p>
              <p>
                Lorde urged her readers to delve into and discover these differences, discussing how ignoring differences can lead to ignoring any bias and prejudice that might come with these differences, while acknowledging them can enrich our visions and our joint struggles. She wrote that we need to constructively deal with the differences between people and recognize that unity does not equal identicality. In <em>I Am Your Sister</em>, she urged activists to take responsibility for learning this, even if it meant self-teaching, "...which might be better used in redefining ourselves and devising realistic scenarios for altering the present and constructing the future".<sup class="citation-marker">[83]</sup>
              </p>
              <p>
                In <em>The Cancer Journals</em> she wrote "If I didn't define myself for myself, I would be crunched into other people's fantasies for me and eaten alive." She stressed the idea of personal identity being more than just what people see or think of a person, but something that must be defined by the individual, based on the person's experiences. "The House of Difference" is a phrase that originates in Lorde's identity theories. Her idea was that everyone is different from each other and it is these collective differences that make us who we are, instead of one small aspect in isolation. Focusing on all of the aspects of one's identity brings people together more than choosing one small piece to identify with.<sup class="citation-marker">[84]</sup>
              </p>
              <p>
                Lorde's works <em>Coal</em> and <em>The Black Unicorn</em> are two examples of poetry that encapsulates her black, feminist identity.<sup class="citation-marker">[85]</sup><sup class="citation-marker">[86]</sup> Each poem focuses on the idea of identity, and how identity itself is not straightforward. Many literary critics assumed that "Coal" was Lorde's way of shaping race in terms of coal and diamonds. Lorde herself stated that those interpretations were incorrect because identity was not so simply defined and her poems were not to be oversimplified.
              </p>
              <p>
                While highlighting Lorde's intersectional points through a lens that focuses on race, gender, socioeconomic status/class and so on, we must also embrace one of her salient identities; Lorde was not afraid to assert her differences, such as skin color and sexual orientation, but used her own identity against toxic black male masculinity. Lorde used those identities within her work and used her own life to teach others the importance of being different. She was not ashamed to claim her identity and used it to her own creative advantages.
              </p>
              <p>
                While highlighting Lorde's intersectional points through a lens that focuses on race, gender, socioeconomic status/class and so on, we must also embrace one of her salient identities, lesbianism. She was a lesbian and navigated spaces interlocking her womanhood, gayness and blackness in ways that trumped White feminism, predominantly White gay spaces and black male masculinity. Lorde used those identities within her work and ultimately it guided her to create pieces that embodied lesbianism in a light that educated people of many social classes and identities on the issues black lesbian women face in society.
              </p>
              <h3 class="subsection-title theory-subheading">Contributions to the third-wave feminist discourse</h3>
              <p>
                Around the 1960s, <a href="https://en.wikipedia.org/wiki/Second-wave_feminism" target="_blank" rel="noopener">second-wave feminism</a> became centered around discussions and debates about capitalism as a "biased, discriminatory, and unfair"<sup class="citation-marker">[87]</sup> institution, especially within the context of the rise of <a href="https://en.wikipedia.org/wiki/Globalization" target="_blank" rel="noopener">globalization</a>.
              </p>
              <p>
                <a href="https://en.wikipedia.org/wiki/Third-wave_feminism" target="_blank" rel="noopener">Third-wave feminism</a> emerged in the 1990s after calls for "a more differentiated feminism" by first-world women of color and women in developing nations, such as Audre Lorde, who maintained her critiques of first-world feminism for tending to veer toward "third-world homogenization". This term was coined by radical dependency theorist, <a href="https://en.wikipedia.org/wiki/Andre_Gunder_Frank" target="_blank" rel="noopener">Andre Gunder Frank</a>, to describe the inconsideration of the unique histories of developing countries (in the process of forming development agendas).<sup class="citation-marker">[87]</sup> Audre Lorde was critical of the first-world feminist movement "for downplaying sexual, racial, and class differences" and the unique power structures and cultural factors which vary by region, nation, community, etc.<sup class="citation-marker">[88]</sup>
              </p>
              <p>
                Other feminist scholars of this period, like <a href="https://en.wikipedia.org/wiki/Chandra_Talpade_Mohanty" target="_blank" rel="noopener">Chandra Talpade Mohanty</a>, echoed Lorde's sentiments. Collectively they called for a "feminist politics of location, which theorized that women were subject to particular assemblies of oppression, and therefore that all women emerged with particular rather than generic identities".<sup class="citation-marker">[88]</sup> While they encouraged a global community of women, Audre Lorde, in particular, felt the cultural homogenization of third-world women could only lead to a disguised form of oppression with its own forms of "othering" women in developing nations into figures of deviance and non-actors in theories of their own development.
              </p>
              <h4 class="subsection-title theory-subheading theory-subheading--level4">Essay</h4>
              <p>
                Originally published in <a href="https://en.wikipedia.org/wiki/Sister_Outsider" target="_blank" rel="noopener">Sister Outsider</a>, a collection of essays and speeches, Audre Lorde cautioned against the "institutionalized rejection of difference" in her essay, "Age, Race, Class, and Sex: Women Redefining Difference", fearing that when "we do not develop tools for using human difference as a springboard for creative change within our lives[,] we speak not of human difference, but of human deviance".<sup class="citation-marker">[50]</sup> Lorde saw this already happening with the lack of inclusion of literature from women of color in the second-wave feminist discourse. Poetry, considered lesser than prose and more common among lower class and working people, was rejected from women's magazine collectives which Lorde claims have robbed "women of each other's energy and creative insight". She found that "the literature of women of Color [was] seldom included in women's literature courses and almost never in other literature courses, nor in women's studies as a whole"<sup class="citation-marker">[50]</sup> and pointed to the "othering" of women of color and women in developing nations as the reason. By homogenizing these communities and ignoring their difference, "women of Color become 'other,' the outside whose experiences and tradition is too 'alien' to comprehend",<sup class="citation-marker">[50]</sup> and thus, seemingly unworthy of scholarly attention and differentiated scholarship. Lorde expands on this idea of rejecting the other saying that it is a product of our capitalistic society. Psychologically, people have been trained to react to discontentment by ignoring it. When ignoring a problem does not work, they are forced to either conform or destroy. She contends that people have reacted in this matter to differences in sex, race, and gender: ignore, conform, or destroy. Instead, she states that differences should be approached with curiosity or understanding. Lorde denounces the concept of having to choose a superior and an inferior when comparing two things. In the case of people, expression, and identity, she claims that there should be a third option of equality. However, Lorde emphasizes in her essay that differences should not be squashed or unacknowledged. There is no denying the difference in experience of black women and White women, as shown through example in Lorde's essay, but Lorde fights against the premise that difference is bad.
              </p>
              <p>
                Audre Lorde called for the embracing of these differences. In the same essay, she proclaimed, "now we must recognize difference among women who are our equals, neither inferior nor superior, and devise ways to use each other's difference to enrich our visions and our joint struggles"<sup class="citation-marker">[50]</sup> Doing so would lead to more inclusive and thus, more effective global feminist goals. Lorde writes that women must "develop new definitions of power and new patterns of relating across difference. The old definitions have not served us". By unification, Lorde writes that women can reverse the oppression that they face and create better communities for themselves and loved ones. Lorde theorized that true development in third-world communities would and even "the future of our earth may depend upon the ability of all women to identify and develop new definitions of power and new patterns of relating across differences."<sup class="citation-marker">[50]</sup> In other words, the individual voices and concerns of women and color and women in developing nations would be the first step in attaining the autonomy with the potential to develop and transform their communities effectively in the age (and future) of globalization.
              </p>
              <h4 class="subsection-title theory-subheading theory-subheading--level4">Speeches</h4>
              <p>
                In a keynote speech at the National Third-World Gay and Lesbian Conference on October 13, 1979, titled, "When will the ignorance end?" Lorde reminded and cautioned the attendees, "There is a wonderful diversity of groups within this conference, and a wonderful diversity between us within those groups. That diversity can be a generative force, a source of energy fueling our visions of action for the future. We must not let diversity be used to tear us apart from each other, nor from our communities that is the mistake they made about us. I do not want us to make it ourselves... and we must never forget those lessons: that we cannot separate our oppressions, nor yet are they the same".<sup class="citation-marker">[89]</sup> In other words, while common experiences in racism, sexism, and homophobia had brought the group together and that commonality could not be ignored, there must still be a recognition of their individualized humanity.
              </p>
              <p>
                Years later, on August 27, 1983, Audre Lorde delivered an address as part of the "Litany of Commitment" at the <a href="https://en.wikipedia.org/wiki/March_on_Washington_for_Jobs_and_Freedom" target="_blank" rel="noopener">March on Washington for Jobs and Freedom</a>. "Today we march," she said, "lesbians and gay men and our children, standing in our own names together with all our struggling sisters and brothers here and around the world, in the Middle East, in Central America, in the Caribbean and South Africa, sharing our commitment to work for a joint livable future. We know we do not have to become copies of each other to be able to work together. We know that when we join hands across the table of our difference, our diversity gives us great power. When we can arm ourselves with the strength and vision from all of our diverse communities, then we will in truth all be free at last."<sup class="citation-marker">[89]</sup>
              </p>
              <h4 class="subsection-title theory-subheading theory-subheading--level4">Interview</h4>
              <p>
                Afro-German feminist scholar and author <a href="https://en.wikipedia.org/wiki/Marion_Kraft" target="_blank" rel="noopener">Dr. Marion Kraft</a> interviewed Audre Lorde in 1986 to discuss a number of her literary works and poems. In this interview, Audre Lorde articulated hope for the next wave of feminist scholarship and discourse. When asked by Kraft, "Do you see any development of the awareness about the importance of differences within the White feminist movement?" Lorde replied with both critiques and hope:<sup class="citation-marker">[90]</sup>
              </p>
              <p>
                Well, the feminist movement, the White feminist movement, has been notoriously slow to recognize that racism is a feminist concern, not one that is altruistic, but one that is part and parcel of feminist consciousness... I think, in fact, though, that things are slowly changing and that there are White women now who recognize that in the interest of genuine coalition, they must see that we are not the same. Black feminism is not White feminism in Blackface. It is an intricate movement coming out of the lives, aspirations, and realities of Black women. We share some things with White women, and there are other things we do not share. We must be able to come together around those things we share.
              </p>
              <p>
                Miriam Kraft summarized Lorde's position when reflecting on the interview; "Yes, we have different historical, social, and cultural backgrounds, different sexual orientations; different aspirations and visions; different skin colors and ages. But we share common experiences and a common goal. Our experiences are rooted in the oppressive forces of racism in various societies, and our goal is our mutual concern to work toward 'a future which has not yet been' in Audre's words."<sup class="citation-marker">[90]</sup>
              </p>
            </div>
          </div>

          <div v-else-if="!isEditMode && isMinervaSkin" class="article-content-section minerva-article-content">
            <div class="minerva-first-section">
              <div class="minerva-intro">
                <p>
                  <strong>Audre Lorde</strong> (<a href="https://en.wikipedia.org/wiki/Help:IPA/English" target="_blank" rel="noopener">/ˈɔːdri ˈlɔːrd/</a> <em>AW-dree LORD</em>; born <strong>Audrey Geraldine Lorde</strong>; February 18, 1934 – November 17, 1992) was an American writer, <a href="https://en.wikipedia.org/wiki/Professor" target="_blank" rel="noopener">professor</a>, <a href="https://en.wikipedia.org/wiki/Philosopher" target="_blank" rel="noopener">philosopher</a>, intersectional <a href="https://en.wikipedia.org/wiki/Feminism" target="_blank" rel="noopener">feminist</a>, <a href="https://en.wikipedia.org/wiki/Poet" target="_blank" rel="noopener">poet</a>, and <a href="https://en.wikipedia.org/wiki/Civil_rights_movement" target="_blank" rel="noopener">civil rights activist</a>.<sup class="citation-marker">[1]</sup> She described herself as a "Black, lesbian, feminist, socialist, mother, warrior, poet" and wrote across poetry, essays, and speeches about racism, sexism, classism, and homophobia.<sup class="citation-marker">[2]</sup>
                </p>
                <p>
                  Lorde argued that there could be no hierarchy of oppressions among people committed to liberation, a position that became central to her public work and writing.<sup class="citation-marker">[3]</sup> As a poet, she is known for technical precision and emotional force, and her work frequently addresses civil rights, feminism, lesbian identity, illness, disability, and Black womanhood.<sup class="citation-marker">[4]</sup><sup class="citation-marker">[5]</sup> She also co-founded <a href="https://en.wikipedia.org/wiki/Kitchen_Table:_Women_of_Color_Press" target="_blank" rel="noopener">Kitchen Table: Women of Color Press</a>.<sup class="citation-marker">[6]</sup>
                </p>
              </div>

              <aside class="infobox">
                <div class="infobox-title">Audre Lorde</div>
                
                <div class="infobox-image-section">
                  <div class="infobox-image">
                    <img :src="audreImage" alt="Audre Lorde in 1980" />
                  </div>
                  <div class="infobox-caption">Lorde in 1980</div>
                </div>

                <div class="infobox-row">
                  <div class="infobox-label">Born</div>
                  <div class="infobox-value">
                    Audrey Geraldine Lorde<br>
                    February 18, 1934[1]<br>
                    <a href="#">New York City</a>, U.S.
                  </div>
                </div>

                <div class="infobox-row infobox-row-faded">
                  <div class="infobox-label">Died</div>
                  <div class="infobox-value">
                    November 17, 1992 (aged 58)<br>
                    <a href="#">Saint Croix, Virgin Islands</a>, U.S.
                  </div>
                </div>

                <div class="infobox-row">
                  <div class="infobox-label">Education</div>
                  <div class="infobox-value infobox-value-link">
                    <a href="#">National Autonomous University of Mexico</a><br>
                    <a href="#">Hunter College (BA)</a><br>
                    <a href="#">Columbia University (MLS)</a>
                  </div>
                </div>

                <div class="infobox-row">
                  <div class="infobox-label">Genre</div>
                  <div class="infobox-value">
                    Poetry<br>
                    Nonfiction
                  </div>
                </div>

                <div class="infobox-row">
                  <div class="infobox-label">Notable works</div>
                  <div class="infobox-value infobox-value-link">
                    The First Cities<br>
                    <a href="#">Zami: A New Spelling of My Name</a><br>
                    <a href="#">The Cancer Journals</a>
                  </div>
                </div>
              </aside>
            </div>

            <div class="minerva-accordion">
              <div class="minerva-accordion-item" data-read-section="early-life">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('early-life')" :aria-expanded="isMinervaSectionOpen('early-life')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('early-life') }" />
                    <span>Early life</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('early-life') && !articleLockToEdit" class="minerva-accordion-edit minerva-accordion-edit--entry" aria-label="Edit section" @click.stop="openEditAtSection('early-life')">
                    <img
                      v-if="readModeSuggestionsEntry === 'badge'"
                      :src="iconEditLightbulb"
                      width="20"
                      height="20"
                      alt=""
                      aria-hidden="true"
                      class="minerva-action-icon-img"
                    />
                    <cdx-icon v-else :icon="cdxIconEdit" size="medium" />
                  </button>
                </div>
                <div v-if="isMinervaSectionOpen('early-life')" class="minerva-accordion-panel">
                  <div class="body-text">
                    <p>
                      Lorde was born on February 18, 1934, in <a href="https://en.wikipedia.org/wiki/New_York_City" target="_blank" rel="noopener">New York City</a> to Caribbean immigrants Frederick Byron Lorde and Linda Gertrude Belmar Lorde.<sup class="citation-marker">[7]</sup> Her father was born in <a href="https://en.wikipedia.org/wiki/Barbados" target="_blank" rel="noopener">Barbados</a>, and her mother was born on <a href="https://en.wikipedia.org/wiki/Carriacou" target="_blank" rel="noopener">Carriacou</a>, in <a href="https://en.wikipedia.org/wiki/Grenada" target="_blank" rel="noopener">Grenada</a>.<sup class="citation-marker">[8]</sup> Her mother sometimes passed as Spanish for work, while her father's darker skin was a source of tension with the Belmar family.<sup class="citation-marker">[9]</sup>
                    </p>
                    <p>
                      The family settled in <a href="https://en.wikipedia.org/wiki/Harlem" target="_blank" rel="noopener">Harlem</a>, where Lorde grew up as the youngest of three daughters and was <a href="https://en.wikipedia.org/wiki/Myopia" target="_blank" rel="noopener">nearsighted</a> to the point of being legally blind.<sup class="citation-marker">[10]</sup> At age four she learned to read as she was learning to speak, with help from librarian <a href="https://en.wikipedia.org/wiki/Augusta_Braxton_Baker" target="_blank" rel="noopener">Augusta Braxton Baker</a> at the 135th Street branch of the <a href="https://en.wikipedia.org/wiki/New_York_Public_Library" target="_blank" rel="noopener">New York Public Library</a>, and her mother taught her to write soon after.<sup class="citation-marker">[11]</sup>
                    </p>
                    <p>
                      Born Audrey Geraldine Lorde, she dropped the "y" from her first name while still a child, later explaining in <em><a href="https://en.wikipedia.org/wiki/Zami:_A_New_Spelling_of_My_Name" target="_blank" rel="noopener">Zami: A New Spelling of My Name</a></em> that she preferred the visual symmetry of “Audre Lorde.”<sup class="citation-marker">[12]</sup> She attended Catholic schools, later studied at <a href="https://en.wikipedia.org/wiki/Hunter_College_High_School" target="_blank" rel="noopener">Hunter College High School</a>, and published her first poem in <a href="https://en.wikipedia.org/wiki/Seventeen_(American_magazine)" target="_blank" rel="noopener">Seventeen</a> after her school literary journal rejected it.<sup class="citation-marker">[13]</sup><sup class="citation-marker">[14]</sup><sup class="citation-marker">[15]</sup>
                    </p>
                    <p>
                      Lorde later wrote that poetry became an essential way to understand and articulate her feelings, and she described herself as someone who thought in poetry from childhood onward.<sup class="citation-marker">[16]</sup>
                    </p>
                  </div>
                </div>
              </div>

              <div class="minerva-accordion-item" data-read-section="career">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('career')" :aria-expanded="isMinervaSectionOpen('career')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('career') }" />
                    <span>Career</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('career') && !articleLockToEdit" class="minerva-accordion-edit minerva-accordion-edit--entry" aria-label="Edit section" @click.stop="openEditAtSection('career')">
                    <img
                      v-if="readModeSuggestionsEntry === 'badge'"
                      :src="iconEditLightbulb"
                      width="20"
                      height="20"
                      alt=""
                      aria-hidden="true"
                      class="minerva-action-icon-img"
                    />
                    <cdx-icon v-else :icon="cdxIconEdit" size="medium" />
                  </button>
                </div>
                <div v-if="isMinervaSectionOpen('career')" class="minerva-accordion-panel">
                  <div class="body-text">
                    <p>
                      In 1954, she spent a pivotal year as a student at the <a href="#">National Autonomous University of Mexico</a>, a period she described as a time of affirmation and renewal. During this time, she confirmed her identity on personal and artistic levels as both a lesbian and a poet. On her return to New York, Lorde attended <a href="#">Hunter College</a>, and graduated in the class of 1959. While there, she worked as a librarian, continued writing, and became an active participant in the <a href="#">gay culture</a> of <a href="#">Greenwich Village</a>. She furthered her education at the <a href="#">Columbia University School of Library Service</a>, earning a master's degree in <a href="#">library science</a> in 1961. During this period, she worked as a public librarian in nearby <a href="#">Mount Vernon, New York</a>.
                    </p>
                                        <p>
                      In 1968 Lorde was writer-in-residence at <a href="#">Tougaloo College</a> in Mississippi. Lorde's time at Tougaloo College, like her year at the <a href="#">National University of Mexico</a>, was a formative experience for her as an artist. She led workshops with her young, black undergraduate students, many of whom were eager to discuss the <a href="#">civil rights</a> issues of that time. Through these discussions with her students, she reaffirmed her desire not only to live out her "crazy and queer" identity, but also to devote attention to the formal aspects of her craft as a poet. Her book of poems, <em>Cables to Rage</em>, came out of her time and experiences at Tougaloo.
                    </p>
                                        <p>
                      From 1972 to 1987, Lorde resided on <a href="#">Staten Island</a>. During that time, in addition to writing and teaching she co-founded <a href="#">Kitchen Table: Women of Color Press</a>.
                    </p>
                                        <p>
                      In 1977, Lorde became an associate of the <a href="#">Women's Institute for Freedom of the Press</a> (WIFP). WIFP is an American nonprofit publishing organization. The organization works to increase communication between women and connect the public with forms of women-based media.
                    </p>
                                        <p>
                      Lorde taught in the Education Department at <a href="#">Lehman College</a> from 1969 to 1970, then as a professor of English at <a href="#">John Jay College of Criminal Justice</a> (both part of the <a href="#">City University of New York</a>, CUNY) from 1970 to 1981. There, she fought for the creation of a <a href="#">black studies</a> department. In 1981, she went on to teach at her alma mater, <a href="#">Hunter College</a> (also CUNY), as the distinguished Thomas Hunter chair. As a queer Black woman, she was an outsider in a <a href="#">white male</a> dominated field and her experiences in this environment deeply influenced her work. New fields such as <a href="#">African American studies</a> and <a href="#">women's studies</a> advanced the topics that scholars were addressing and garnered attention to groups that had previously been rarely discussed. With this newfound <a href="#">academic</a> environment, Lorde was inspired to not only write poetry but also essays and articles about queer, feminist, and African American studies.
                    </p>
                                        <p>
                      In 1980, together with <a href="#">Barbara Smith</a> and <a href="#">Cherríe Moraga</a>, she co-founded <a href="#">Kitchen Table: Women of Color Press</a>, the first U.S. publisher for women of color.
                    </p>
                                        <p>
                      In 1981, Lorde was among the founders of the Women's Coalition of St. Croix, an organization dedicated to assisting women who have survived sexual abuse and <a href="#">intimate partner violence</a>. In the late 1980s, she also helped establish Sisterhood in Support of Sisters (SISA) in South Africa to benefit black women who were affected by <a href="#">apartheid</a> and other forms of injustice.
                    </p>
                                        <p>
                      In 1985, Audre Lorde was a part of a delegation of <a href="#">black women</a> writers who had been invited to <a href="#">Cuba</a>. The trip was sponsored by <em>The Black Scholar</em> and the Union of Cuban Writers. She embraced the shared sisterhood as black women writers. They visited Cuban poets <a href="#">Nancy Morejón</a> and <a href="#">Nicolas Guillén</a>. They discussed whether the Cuban revolution had truly changed racism and the status of lesbians and gays there.
                    </p>
                  </div>
                </div>
              </div>

              <div class="minerva-accordion-item" data-read-section="poetry">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('poetry')" :aria-expanded="isMinervaSectionOpen('poetry')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('poetry') }" />
                    <span>Poetry</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('poetry') && !articleLockToEdit" class="minerva-accordion-edit minerva-accordion-edit--entry" aria-label="Edit section" @click.stop="openEditAtSection('poetry')">
                    <img
                      v-if="readModeSuggestionsEntry === 'badge'"
                      :src="iconEditLightbulb"
                      width="20"
                      height="20"
                      alt=""
                      aria-hidden="true"
                      class="minerva-action-icon-img"
                    />
                    <cdx-icon v-else :icon="cdxIconEdit" size="medium" />
                  </button>
                </div>
                <div v-if="isMinervaSectionOpen('poetry')" class="minerva-accordion-panel">
                  <div class="body-text">
                    <p>
                      Lorde focused her discussion of difference not only on differences between groups of women but between conflicting differences within the individual. "I am defined as other in every group I'm part of," she declared. "Yet without community," Lorde wrote, "there is certainly no liberation, no future, only the most vulnerable and temporary armistice between me and my oppression". She described herself both as a part of a "continuum of women" and a "concert of voices" within herself.
                    </p>
                                        <p>
                      Her conception of her many layers of selfhood is replicated in the multi-genres of her work. Critic Carmen Birkle wrote: "Her multicultural self is thus reflected in a multicultural text, in multi-genres, in which the individual cultures are no longer separate and autonomous entities but melt into a larger whole without losing their individual importance." Her refusal to be placed in a particular category, whether social or literary, was characteristic of her determination to come across as an individual rather than a stereotype. Lorde considered herself a "lesbian, mother, warrior, poet" and used poetry to get this message across.
                    </p>
                                        <p><strong>Early works</strong></p>
                                        <p>
                      Lorde's poetry was published very regularly during the 1960s - in Langston Hughes' 1962 New Negro Poets, USA; in several foreign anthologies; and in black literary magazines. During this time, she was also politically active in civil rights, anti-war, and feminist movements.
                    </p>
                                        <p>
                      In 1968, Lorde published The First Cities, her first volume of poems. It was edited by Diane di Prima, a former classmate and friend from Hunter College High School. The First Cities has been described as a "quiet, introspective book", and Dudley Randall, a poet and critic, asserted in his review of the book that Lorde "does not wave a black flag, but her Blackness is there, implicit, in the bone".
                    </p>
                                        <p>
                      Her second volume, Cables to Rage (1970), which was mainly written during her tenure as poet-in-residence at Tougaloo College in Mississippi, addressed themes of love, betrayal, childbirth, and the complexities of raising children. It is particularly noteworthy for the poem "Martha", in which Lorde openly confirms her homosexuality for the first time in her writing: "[W]e shall love each other here if ever at all".
                    </p>
                                        <p>
                      Nominated for the National Book Award for poetry in 1974, From a Land Where Other People Live (Broadside Press) shows Lorde's personal struggles with identity and anger at social injustice. The volume deals with themes of anger, loneliness, and injustice, as well as what it means to be a black woman, mother, friend, and lover.
                    </p>
                                        <p>
                      1974 saw the release of New York Head Shop and Museum, which gives a picture of Lorde's New York through the lenses of both the civil rights movement and her own restricted childhood: stricken with poverty and neglect and, in Lorde's opinion, in need of political action.
                    </p>
                                        <p><strong>Wider recognition</strong></p>
                                        <p>
                      Despite the success of these volumes, it was the release of Coal in 1976 that established Lorde as an influential voice in the Black Arts Movement, and the large publishing house behind it - Norton - helped introduce her to a wider audience. The volume includes poems from both The First Cities and Cables to Rage, and it unites many of the themes Lorde would become known for throughout her career: her rage at racial injustice, her celebration of her black identity, and her call for an intersectional consideration of women's experiences. Lorde followed Coal up with Between Our Selves (also in 1976) and Hanging Fire (1978).
                    </p>
                                        <p>
                      In Lorde's volume The Black Unicorn (1978), she describes her identity within the mythos of African female deities of creation, fertility, and warrior strength. This reclamation of African female identity both builds and challenges existing Black Arts ideas about pan-Africanism. While writers like Amiri Baraka and Ishmael Reed utilized African cosmology in a way that "furnished a repertoire of bold male gods capable of forging and defending an aboriginal Black universe," in Lorde's writing "that warrior ethos is transferred to a female vanguard capable equally of force and fertility".
                    </p>
                                        <p>
                      Lorde's poetry became more open and personal as she grew older and became more confident in her sexuality. In Sister Outsider: Essays and Speeches, Lorde states, "Poetry is the way we help give name to the nameless so it can be thought... As they become known to and accepted by us, our feelings and the honest exploration of them become sanctuaries and spawning grounds for the most radical and daring ideas." Sister Outsider also elaborates Lorde's challenge to European-American traditions.
                    </p>
                  </div>
                </div>
              </div>

              <div class="minerva-accordion-item" data-read-section="prose">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('prose')" :aria-expanded="isMinervaSectionOpen('prose')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('prose') }" />
                    <span>Prose</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('prose') && !articleLockToEdit" class="minerva-accordion-edit minerva-accordion-edit--entry" aria-label="Edit section" @click.stop="openEditAtSection('prose')">
                    <cdx-icon :icon="cdxIconEdit" size="medium" />
                  </button>
                </div>
                <div v-if="isMinervaSectionOpen('prose')" class="minerva-accordion-panel">
                  <div class="body-text">
                    <p>
                      The Cancer Journals (1980) and A Burst of Light (1988) both use non-fiction prose, including essays and journal entries, to bear witness to, explore, and reflect on Lorde's diagnosis, treatment, recovery from breast cancer, and ultimately fatal recurrence with liver metastases. In both works, Lorde deals with Western notions of illness, disability, treatment, cancer and sexuality, and physical beauty and prosthesis, as well as themes of death, fear of mortality, survival, emotional healing, and inner power.
                    </p>
                                        <p>
                      Lorde's deeply personal book Zami: A New Spelling of My Name (1982), subtitled a "biomythography", chronicles her childhood and adulthood. The narrative deals with the evolution of Lorde's sexuality and self-awareness.
                    </p>
                                        <p><strong>Sister Outsider</strong></p>
                                        <p>
                      In Sister Outsider: Essays and Speeches (1984), Lorde asserts the necessity of communicating the experience of marginalized groups to make their struggles visible in a repressive society. She emphasizes the need for different groups of people (particularly white women and African-American women) to find common ground in their experiences in life, but also to face difference directly, and use it as a source of strength rather than alienation. She repeatedly emphasizes the need for community in the struggle to build a better world. How to constructively channel the anger and rage incited by oppression is another prominent theme throughout her works, and in this collection in particular.
                    </p>
                                        <p>
                      Her most famous essay, "The Master's Tools Will Never Dismantle the Master's House", is included in Sister Outsider. Lorde questions the scope and ability for change to be instigated when examining problems through a racist, patriarchal lens. She insists that women see differences between other women not as something to be tolerated, but something that is necessary to generate power and to actively "be" in the world. This will create a community that embraces differences, which will ultimately lead to liberation. Lorde elucidates, "Divide and conquer, in our world, must become define and empower." Also, people must educate themselves about the oppression of others because expecting a marginalized group to educate the oppressors is the continuation of racist, patriarchal thought. She explains that this is a major tool utilized by oppressors to keep the oppressed occupied with the master's concerns. She concludes that to bring about real change, we cannot work within the racist, patriarchal framework because change brought about in that will not remain.
                    </p>
                                        <p>
                      Also in Sister Outsider is the essay, "The Transformation of Silence into Language and Action". Lorde discusses the importance of speaking, even when afraid, because otherwise silence immobilizes and chokes us. Many people fear to speak the truth because of the real risks of retaliation, but Lorde warns, "Your silence does not protect you." Lorde emphasizes that "the transformation of silence into language and action is a self-revelation, and that always seems fraught with danger." People are afraid of others' reactions for speaking, but mostly for demanding visibility, which is essential to live. Lorde adds, "We can sit in our corners mute forever while our sisters and ourselves are wasted, while our children are distorted and destroyed, while our earth is poisoned; we can sit in our safe corners mute as bottles, and we will still be no less afraid." "People are taught to respect their fear of speaking more than silence, but ultimately, the silence will choke us anyway, so we might as well speak the truth." Lorde writes that we can learn to speak even when we are afraid.
                    </p>
                                        <p>
                      In "Age, Race, Class, and Sex: Women Redefining Difference", Lorde emphasizes the importance of educating others. However, she stresses that in order to educate others, one must first be educated. Empowering people who are doing the work does not mean using privilege to overstep and overpower such groups; but rather, privilege must be used to hold door open for other allies. Lorde describes the inherent problems within society by saying, "racism, the belief in the inherent superiority of one race over all others and thereby the right to dominance. Sexism, the belief in the inherent superiority of one sex over the other and thereby the right to dominance. Ageism. Heterosexism. Elitism. Classism." Lorde finds herself among some of these "deviant" groups in society, which set the tone for the status quo and what "not to be" in society. Lorde argues that women feel pressure to conform to their "oneness" before recognizing the separation among them due to their "manyness", or aspects of their identity. She stresses that this behavior is exactly what "explains feminists' inability to forge the kind of alliances necessary to create a better world".
                    </p>
                                        <p>
                      In relation to non-intersectional feminism in the United States, Lorde famously said:
                    </p>
                                        <p>
                      Those of us who stand outside the circle of this society's definition of acceptable women; those of us who have been forged in the crucibles of difference -- those of us who are poor, who are lesbians, who are Black, who are older -- know that survival is not an academic skill. It is learning how to take our differences and make them strengths. For the master's tools will never dismantle the master's house. They may allow us temporarily to beat him at his own game, but they will never enable us to bring about genuine change. And this fact is only threatening to those women who still define the master's house as their only source of support.
                    </p>
                                        <p>
                      — Audre Lorde, The Master's Tools Will Never Dismantle the Master's House, Sister Outsider: Essays and Speeches (1984)
                    </p>
                  </div>
                </div>
              </div>

              <div class="minerva-accordion-item" data-read-section="film">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('film')" :aria-expanded="isMinervaSectionOpen('film')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('film') }" />
                    <span>Film</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('film') && !articleLockToEdit" class="minerva-accordion-edit minerva-accordion-edit--entry" aria-label="Edit section" @click.stop="openEditAtSection('film')">
                    <cdx-icon :icon="cdxIconEdit" size="medium" />
                  </button>
                </div>
                <div v-if="isMinervaSectionOpen('film')" class="minerva-accordion-panel">
                  <div class="body-text">
                    <p>
                      Lorde had several films that highlighted her journey as an <a href="https://en.wikipedia.org/wiki/Activism" target="_blank" rel="noopener">activist</a> in the 1980s and 1990s.<sup class="citation-marker">[50]</sup>
                    </p>
                    <p>
                      <em>The Berlin Years: 1984–1992</em> documented Lorde's time in Germany as she led <a href="https://en.wikipedia.org/wiki/Afro-Germans" target="_blank" rel="noopener">Afro-Germans</a> in a movement that would allow black people to establish identities for themselves outside of stereotypes and discrimination. After a long history of systemic racism in Germany, Lorde introduced a new sense of empowerment for minorities. As seen in the film, she walks through the streets with pride despite stares and words of discouragement. Including moments like these in a documentary was important for people to see during that time. It inspired them to take charge of their identities and discover who they are outside of the labels put on them by society. The film also educates people on the history of racism in Germany. This enables viewers to understand how Germany reached this point in history and how the society developed. Through her promotion of the study of history and her example of taking her experiences in her stride, she influenced people of many different backgrounds.<sup class="citation-marker">[51]</sup>
                    </p>
                    <p>
                      The film documents Lorde's efforts to empower and encourage women to start the Afro-German movement. What began as a few friends meeting in a friend's home to get to know other black people, turned into what is now known as the Afro-German movement. Lorde inspired black women to refute the designation of "<a href="https://en.wikipedia.org/wiki/Mulatto" target="_blank" rel="noopener">Mulatto</a>", a label which was imposed on them, and switch to the newly coined, self-given "<a href="https://en.wikipedia.org/wiki/Afro-Germans" target="_blank" rel="noopener">Afro-German</a>", a term that conveyed a sense of pride. Lorde inspired Afro-German women to create a community of like-minded people. Some Afro-German women, such as <a href="https://en.wikipedia.org/wiki/Ika_H%C3%BCgel-Marshall" target="_blank" rel="noopener">Ika Hügel-Marshall</a>, had never met another black person and the meetings offered opportunities to express thoughts and feelings.<sup class="citation-marker">[52]</sup>
                    </p>
                    <p>
                      <em>Body of a Poet: 1995</em> was written as a tribute biopic written to honor Lorde. The film centers on the efforts of a young group of lesbians of color. The film celebrates the life and work of Audre Lorde from her birth to her death.<sup class="citation-marker">[53]</sup>
                    </p>
                  </div>
                </div>
              </div>

              <div class="minerva-accordion-item" data-read-section="theory">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('theory')" :aria-expanded="isMinervaSectionOpen('theory')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('theory') }" />
                    <span>Theory</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('theory') && !articleLockToEdit" class="minerva-accordion-edit minerva-accordion-edit--entry" aria-label="Edit section" @click.stop="openEditAtSection('theory')">
                    <cdx-icon :icon="cdxIconEdit" size="medium" />
                  </button>
                </div>
                <div v-if="isMinervaSectionOpen('theory')" class="minerva-accordion-panel">
                  <div class="body-text">
                    <p>
                      Her writings are based on the "theory of difference", the idea that the binary opposition between men and women is overly simplistic; although feminists have found it necessary to present the illusion of a solid, unified whole, the category of women itself is full of subdivisions.<sup class="citation-marker">[61]</sup>
                    </p>
                    <p>
                      Lorde identified issues of race, class, age and ageism, sex and sexuality and, later in her life, chronic illness and disability; the latter becoming more prominent in her later years as she lived with cancer. She wrote of all of these factors as fundamental to her experience of being a woman. She argued that, although differences in gender have received all the focus, it is essential that these other differences are also recognized and addressed. "Lorde," writes <a href="https://de.wikipedia.org/wiki/Carmen_Birkle" target="_blank" rel="noopener">Carmen Birkle</a>, "puts her emphasis on the authenticity of experience. She wants her difference acknowledged but not judged; she does not want to be subsumed into the one general category of 'woman.'"<sup class="citation-marker">[62]</sup> This theory is today known as <a href="https://en.wikipedia.org/wiki/Intersectionality" target="_blank" rel="noopener">intersectionality</a>.<sup class="citation-marker">[63]</sup>
                    </p>
                    <p>
                      While acknowledging that the differences between women are wide and varied, most of Lorde's works are concerned with two subsets that concerned her primarily – race and sexuality. In <a href="https://en.wikipedia.org/wiki/A_Litany_for_Survival:_The_Life_and_Work_of_Audre_Lorde" target="_blank" rel="noopener">Ada Gay Griffin and Michelle Parkerson's documentary <em>A Litany for Survival: The Life and Work of Audre Lorde</em></a>, Lorde says, "Let me tell you first about what it was like being a Black woman poet in the '60s, from jump. It meant being invisible. It meant being really invisible. It meant being doubly invisible as a Black feminist woman and it meant being triply invisible as a Black lesbian and feminist".<sup class="citation-marker">[64]</sup>
                    </p>
                    <p>
                      <em>Front cover art for the 1984 publication of the book <a href="https://en.wikipedia.org/wiki/Sister_Outsider" target="_blank" rel="noopener">Sister Outsider</a> by Audre Lorde.</em>
                    </p>
                    <p>
                      In her essay "The Erotic as Power", written in 1978 and collected in <a href="https://en.wikipedia.org/wiki/Sister_Outsider" target="_blank" rel="noopener">Sister Outsider</a>, Lorde theorizes the Erotic as a site of power for women only when they learn to release it from its suppression and embrace it, without the sexualized meaning it often holds in mainstream society. She proposes that the Erotic needs to be explored and experienced wholeheartedly, because it exists not only in reference to sexuality and the sexual, but also as a feeling of enjoyment, love, and thrill that is felt towards any task or experience that satisfies women in their lives, be it reading a book or loving one's job.<sup class="citation-marker">[65]</sup> She dismisses "the false belief that only by the suppression of the erotic within our lives and consciousness can women be truly strong. But that strength is illusory, for it is fashioned within the context of male models of power".<sup class="citation-marker">[66]</sup> She explains how patriarchal society has misnamed it and used it against women, causing women to fear it. Women also fear it because the erotic is powerful and a deep feeling. Women must share each other's power rather than use it without consent, which is abuse. They should do it as a method to connect everyone in their differences and similarities. Utilizing the erotic as power allows women to use their knowledge and power to face the issues of racism, patriarchy, and our anti-erotic society.<sup class="citation-marker">[65]</sup> She claims that the erotic can be used as a source of power for women to live with passion in all areas of their life. With the erotic guiding life, Lorde encourages women to use the erotic as a compass to identify what holds value in women's lives. Furthermore, Lorde criticizes the idea of <a href="https://en.wikipedia.org/wiki/Compulsory_heterosexuality" target="_blank" rel="noopener">compulsory heterosexuality</a> and the idea that women's happiness will come through marriage, god, or religion. The idea of the erotic will empower women to not settle for what is conventionally expected or safe leaning into the idea of resisting patriarchal values put in place over women and their sexuality. Lorde sees the suppression of the erotic or conformity to heterosexual norms as a form of control over women. In order to assume control over oneself, she urges women to reclaim the erotic and assert control. She erases the erotic differences that lie between varying sexualities in order to promote these desires as a creative force for revolutionary change.<sup class="citation-marker">[65]</sup> While rejecting compulsory heterosexuality, this is a prevalent motif in Uses of the Erotic, and it still carries some heteronormative undertones. The erotic Lorde proposes both promotes this ideal, as "the aim of each thing which we do is to make our lives and the lives of our children richer and more possible. Within the celebration of the erotic in all our endeavours, my work becomes a conscious decision - a longed-for bed which I enter gratefully and from which I rise up empowered," explaining how wielding the erotic as preserving the future for women and children alike.<sup class="citation-marker">[67]</sup> Another feminist philosopher, <a href="https://en.wikipedia.org/wiki/Lee_Edelman" target="_blank" rel="noopener">Lee Edelman</a>, discusses the culture of heteronormativity as a structure upheld through reproduction and the perception of children as the future which relates to this quote as lending to heteronormative culture, despite her rejection of it. Lorde also lends to this reproductive theory by her establishing the root of the erotic as a, "deeply female and spiritual plane, firmly rooted in the power of our unexpressed or unrecognized feeling," imbuing to women that it is inherent to their womanhood. This supports a binary reality by asserting an essentialist view of gender and sex. Essentialism is debated among third-wave feminists and illustrated how intersectionality in third-wave feminism is approached differently than that of fourth-wave feminism.
                    </p>
                    <h3 class="subsection-title theory-subheading">Feminist thought</h3>
                    <p>
                      Lorde set out to confront issues of racism in feminist thought. She maintained that a great deal of the scholarship of White feminists served to augment the oppression of black women, a conviction that led to angry confrontation, most notably in a blunt open letter addressed to the fellow radical lesbian feminist <a href="https://en.wikipedia.org/wiki/Mary_Daly" target="_blank" rel="noopener">Mary Daly</a>, to which Lorde claimed she received no reply.<sup class="citation-marker">[68]</sup> Daly's reply letter to Lorde,<sup class="citation-marker">[69]</sup> dated four months later, was found in 2003 in Lorde's files after she died.<sup class="citation-marker">[70]</sup>
                    </p>
                    <p>
                      This fervent disagreement with notable White feminists furthered Lorde's persona as an outsider: "In the institutional milieu of black feminist and black lesbian feminist scholars ... and within the context of conferences sponsored by White feminist academics, Lorde stood out as an angry, accusatory, isolated black feminist lesbian voice".<sup class="citation-marker">[71]</sup>
                    </p>
                    <p>
                      The criticism was not one-sided: many White feminists were angered by Lorde's brand of feminism. In her 1984 essay "The Master's Tools Will Never Dismantle the Master's House",<sup class="citation-marker">[72]</sup> Lorde attacked what she believed was underlying racism within feminism, describing it as unrecognized dependence on the patriarchy. She argued that, by denying difference in the category of women, White feminists merely furthered old systems of oppression and that, in so doing, they were preventing any real, lasting change. Her argument aligned White feminists who did not recognize race as a feminist issue with White male slave-masters, describing both as "agents of oppression".<sup class="citation-marker">[73]</sup>
                    </p>
                    <h3 class="subsection-title theory-subheading">Lorde's comments on feminism</h3>
                    <p>
                      Lorde held that the key tenets of feminism were that all forms of oppression were interrelated; creating change required taking a public stand; differences should not be used to divide; revolution is a process; feelings are a form of self-knowledge that can inform and enrich activism; and acknowledging and experiencing pain helps women to transcend it.<sup class="citation-marker">[74]</sup>
                    </p>
                    <p>
                      In Lorde's "Age, Race, Class, and Sex: Women Redefining Difference", she writes: "Certainly there are very real differences between us of race, age, and sex. But it is not those differences between us that are separating us. It is rather our refusal to recognize those differences, and to examine the distortions which result from our misnaming them and their effects upon human behavior and expectation." More specifically she states: "As White women ignore their built-in privilege of Whiteness and define woman in terms of their own experience alone, then women of color become 'other'."<sup class="citation-marker">[75]</sup> Self-identified as "a forty-nine-year-old Black lesbian feminist socialist mother of two,<sup class="citation-marker">[75]</sup> Lorde is considered as "other, deviant, inferior, or just plain wrong"<sup class="citation-marker">[75]</sup> in the eyes of the normative "White male heterosexual capitalist" social hierarchy. "We speak not of human difference, but of human deviance,"<sup class="citation-marker">[75]</sup> she writes. In this respect, her ideology coincides with <span
                        v-if="isSuggestion5Pending || isSuccessHighlightActive(5)"
                        ref="highlightedTextRef5"
                        class="suggestion-target suggestion-target--inline"
                        :class="{
                          [nonSelectedHighlightClass]: showSuggestions,
                          'highlighted-text-wrapper--hover': isSuggestion5Pending && isHovered5 && showSuggestions && !isCardExpanded5,
                          'highlighted-text-wrapper--selected': isSuggestion5Pending && isCardExpanded5 && showSuggestions,
                          'highlighted-text-wrapper--success': isSuccessHighlightActive(5),
                          'suggestion-dismiss-right': dismissedSuggestionId === 5
                        }"
                        @mouseenter.stop="isTextHovered5 = true"
                        @mouseleave.stop="isTextHovered5 = false"
                        @click.stop="isSuggestion5Pending ? (isMinervaSkin ? openMinervaSuggestion(5) : (isCardExpanded5 = true)) : null"
                      ><span class="highlighted-text-content"><span class="highlighted-text-annotation"><a href="https://en.wikipedia.org/wiki/Womanism" target="_blank" rel="noopener">womanism</a></span></span></span><template v-else><a href="https://en.wikipedia.org/wiki/Womanism" target="_blank" rel="noopener">womanism</a></template>, which "allows Black women to affirm and celebrate their color and culture in a way that feminism does not."
                    </p>
                    <p>
                      Lorde defines racism, sexism, ageism, heterosexism, elitism and classism altogether and explains that an "ism" is an idea that what is being privileged is superior and has the right to govern anything else.<sup class="citation-marker">[76]</sup> Lorde argues that a mythical norm is what all bodies should be. According to Lorde, the mythical norm of US culture is White, thin, male, young, heterosexual, Christian, financially secure.<sup class="citation-marker">[75]</sup>
                    </p>
                    <h3 class="subsection-title theory-subheading">Influences on black feminism</h3>
                    <p>
                      Lorde's work on black feminism continues to be examined by scholars today. Jennifer C. Nash examines how black feminists acknowledge their identities and find love for themselves through those differences.<sup class="citation-marker">[77]</sup> Nash cites Lorde, who writes: "I urge each one of us here to reach down into that deep place of knowledge inside herself and touch that terror and loathing of any difference that lives there. See whose face it wears. Then the personal as the political can begin to illuminate all our choices."<sup class="citation-marker">[77]</sup> Nash explains that Lorde is urging black feminists to embrace politics rather than fear it, which will lead to an improvement in society for them. Lorde adds, "Black women sharing close ties with each other, politically or emotionally, are not the enemies of Black men. Too frequently, however, some Black men attempt to rule by fear those Black women who are more ally than enemy."<sup class="citation-marker">[78]</sup>
                    </p>
                    <p>
                      Lorde's 1979 essay "Sexism: An American Disease in Blackface" is a sort of rallying cry to confront sexism in the black community in order to eradicate the violence within it.<sup class="citation-marker">[6]</sup> Lorde insists that the fight between black women and men must end to end racist politics.
                    </p>
                    <p>
                      In 1981, Lorde and a fellow writer friend, Barbara Smith founded <a href="https://en.wikipedia.org/wiki/Kitchen_Table:_Women_of_Color_Press" target="_blank" rel="noopener">Kitchen Table: Women of Color Press</a> which was dedicated to helping other black feminist writers by provided resources, guidance and encouragement. Lorde encouraged those around her to celebrate their differences such as race, sexuality or class instead of dwelling upon them, and wanted everyone to have similar opportunities.<sup class="citation-marker">[79]</sup>
                    </p>
                    <h3 class="subsection-title theory-subheading">Personal identity</h3>
                    <p>
                      Throughout Lorde's career she included the idea of a collective identity in many of her poems and books. She did not just identify with one category but she wanted to celebrate all parts of herself equally.<sup class="citation-marker">[80]</sup>
                    </p>
                    <p>
                      She was known to describe herself as black, lesbian, political activist, feminist, poet, mother, etc. In her novel <em>Zami: A New Spelling of My Name</em>, Lorde focuses on how her many different identities shape her life and the different experiences she has because of them. She shows us that personal identity is found within the connections between seemingly different parts of one's life, based on experiences, and that one's authority to speak comes from these experiences. Personal identity is often associated with the visual aspect of a person, but as Lies Xhonneux theorizes when identity is singled down to just what you see, some people, even within minority groups, can become invisible.<sup class="citation-marker">[81]</sup>
                    </p>
                    <p>
                      Lorde's work also focused on the importance of acknowledging, respecting and celebrating our differences as well as our commonalities in defining identity. In <em>The Master's Tools</em>, she wrote that many people choose to pretend the differences between us do not exist, or that these differences are insurmountable, adding, "Difference must be not merely tolerated, but seen as a fund of necessary polarities between which our creativity can spark like a dialectic."<sup class="citation-marker">[82]</sup>
                    </p>
                    <p>
                      Lorde urged her readers to delve into and discover these differences, discussing how ignoring differences can lead to ignoring any bias and prejudice that might come with these differences, while acknowledging them can enrich our visions and our joint struggles. She wrote that we need to constructively deal with the differences between people and recognize that unity does not equal identicality. In <em>I Am Your Sister</em>, she urged activists to take responsibility for learning this, even if it meant self-teaching, "...which might be better used in redefining ourselves and devising realistic scenarios for altering the present and constructing the future".<sup class="citation-marker">[83]</sup>
                    </p>
                    <p>
                      In <em>The Cancer Journals</em> she wrote "If I didn't define myself for myself, I would be crunched into other people's fantasies for me and eaten alive." She stressed the idea of personal identity being more than just what people see or think of a person, but something that must be defined by the individual, based on the person's experiences. "The House of Difference" is a phrase that originates in Lorde's identity theories. Her idea was that everyone is different from each other and it is these collective differences that make us who we are, instead of one small aspect in isolation. Focusing on all of the aspects of one's identity brings people together more than choosing one small piece to identify with.<sup class="citation-marker">[84]</sup>
                    </p>
                    <p>
                      Lorde's works <em>Coal</em> and <em>The Black Unicorn</em> are two examples of poetry that encapsulates her black, feminist identity.<sup class="citation-marker">[85]</sup><sup class="citation-marker">[86]</sup> Each poem focuses on the idea of identity, and how identity itself is not straightforward. Many literary critics assumed that "Coal" was Lorde's way of shaping race in terms of coal and diamonds. Lorde herself stated that those interpretations were incorrect because identity was not so simply defined and her poems were not to be oversimplified.
                    </p>
                    <p>
                      While highlighting Lorde's intersectional points through a lens that focuses on race, gender, socioeconomic status/class and so on, we must also embrace one of her salient identities; Lorde was not afraid to assert her differences, such as skin color and sexual orientation, but used her own identity against toxic black male masculinity. Lorde used those identities within her work and used her own life to teach others the importance of being different. She was not ashamed to claim her identity and used it to her own creative advantages.
                    </p>
                    <p>
                      While highlighting Lorde's intersectional points through a lens that focuses on race, gender, socioeconomic status/class and so on, we must also embrace one of her salient identities, lesbianism. She was a lesbian and navigated spaces interlocking her womanhood, gayness and blackness in ways that trumped White feminism, predominantly White gay spaces and black male masculinity. Lorde used those identities within her work and ultimately it guided her to create pieces that embodied lesbianism in a light that educated people of many social classes and identities on the issues black lesbian women face in society.
                    </p>
                    <h3 class="subsection-title theory-subheading">Contributions to the third-wave feminist discourse</h3>
                    <p>
                      Around the 1960s, <a href="https://en.wikipedia.org/wiki/Second-wave_feminism" target="_blank" rel="noopener">second-wave feminism</a> became centered around discussions and debates about capitalism as a "biased, discriminatory, and unfair"<sup class="citation-marker">[87]</sup> institution, especially within the context of the rise of <a href="https://en.wikipedia.org/wiki/Globalization" target="_blank" rel="noopener">globalization</a>.
                    </p>
                    <p>
                      <a href="https://en.wikipedia.org/wiki/Third-wave_feminism" target="_blank" rel="noopener">Third-wave feminism</a> emerged in the 1990s after calls for "a more differentiated feminism" by first-world women of color and women in developing nations, such as Audre Lorde, who maintained her critiques of first-world feminism for tending to veer toward "third-world homogenization". This term was coined by radical dependency theorist, <a href="https://en.wikipedia.org/wiki/Andre_Gunder_Frank" target="_blank" rel="noopener">Andre Gunder Frank</a>, to describe the inconsideration of the unique histories of developing countries (in the process of forming development agendas).<sup class="citation-marker">[87]</sup> Audre Lorde was critical of the first-world feminist movement "for downplaying sexual, racial, and class differences" and the unique power structures and cultural factors which vary by region, nation, community, etc.<sup class="citation-marker">[88]</sup>
                    </p>
                    <p>
                      Other feminist scholars of this period, like <a href="https://en.wikipedia.org/wiki/Chandra_Talpade_Mohanty" target="_blank" rel="noopener">Chandra Talpade Mohanty</a>, echoed Lorde's sentiments. Collectively they called for a "feminist politics of location, which theorized that women were subject to particular assemblies of oppression, and therefore that all women emerged with particular rather than generic identities".<sup class="citation-marker">[88]</sup> While they encouraged a global community of women, Audre Lorde, in particular, felt the cultural homogenization of third-world women could only lead to a disguised form of oppression with its own forms of "othering" women in developing nations into figures of deviance and non-actors in theories of their own development.
                    </p>
                    <h4 class="subsection-title theory-subheading theory-subheading--level4">Essay</h4>
                    <p>
                      Originally published in <a href="https://en.wikipedia.org/wiki/Sister_Outsider" target="_blank" rel="noopener">Sister Outsider</a>, a collection of essays and speeches, Audre Lorde cautioned against the "institutionalized rejection of difference" in her essay, "Age, Race, Class, and Sex: Women Redefining Difference", fearing that when "we do not develop tools for using human difference as a springboard for creative change within our lives[,] we speak not of human difference, but of human deviance".<sup class="citation-marker">[50]</sup> Lorde saw this already happening with the lack of inclusion of literature from women of color in the second-wave feminist discourse. Poetry, considered lesser than prose and more common among lower class and working people, was rejected from women's magazine collectives which Lorde claims have robbed "women of each other's energy and creative insight". She found that "the literature of women of Color [was] seldom included in women's literature courses and almost never in other literature courses, nor in women's studies as a whole"<sup class="citation-marker">[50]</sup> and pointed to the "othering" of women of color and women in developing nations as the reason. By homogenizing these communities and ignoring their difference, "women of Color become 'other,' the outside whose experiences and tradition is too 'alien' to comprehend",<sup class="citation-marker">[50]</sup> and thus, seemingly unworthy of scholarly attention and differentiated scholarship. Lorde expands on this idea of rejecting the other saying that it is a product of our capitalistic society. Psychologically, people have been trained to react to discontentment by ignoring it. When ignoring a problem does not work, they are forced to either conform or destroy. She contends that people have reacted in this matter to differences in sex, race, and gender: ignore, conform, or destroy. Instead, she states that differences should be approached with curiosity or understanding. Lorde denounces the concept of having to choose a superior and an inferior when comparing two things. In the case of people, expression, and identity, she claims that there should be a third option of equality. However, Lorde emphasizes in her essay that differences should not be squashed or unacknowledged. There is no denying the difference in experience of black women and White women, as shown through example in Lorde's essay, but Lorde fights against the premise that difference is bad.
                    </p>
                    <p>
                      Audre Lorde called for the embracing of these differences. In the same essay, she proclaimed, "now we must recognize difference among women who are our equals, neither inferior nor superior, and devise ways to use each other's difference to enrich our visions and our joint struggles"<sup class="citation-marker">[50]</sup> Doing so would lead to more inclusive and thus, more effective global feminist goals. Lorde writes that women must "develop new definitions of power and new patterns of relating across difference. The old definitions have not served us". By unification, Lorde writes that women can reverse the oppression that they face and create better communities for themselves and loved ones. Lorde theorized that true development in third-world communities would and even "the future of our earth may depend upon the ability of all women to identify and develop new definitions of power and new patterns of relating across differences."<sup class="citation-marker">[50]</sup> In other words, the individual voices and concerns of women and color and women in developing nations would be the first step in attaining the autonomy with the potential to develop and transform their communities effectively in the age (and future) of globalization.
                    </p>
                    <h4 class="subsection-title theory-subheading theory-subheading--level4">Speeches</h4>
                    <p>
                      In a keynote speech at the National Third-World Gay and Lesbian Conference on October 13, 1979, titled, "When will the ignorance end?" Lorde reminded and cautioned the attendees, "There is a wonderful diversity of groups within this conference, and a wonderful diversity between us within those groups. That diversity can be a generative force, a source of energy fueling our visions of action for the future. We must not let diversity be used to tear us apart from each other, nor from our communities that is the mistake they made about us. I do not want us to make it ourselves... and we must never forget those lessons: that we cannot separate our oppressions, nor yet are they the same".<sup class="citation-marker">[89]</sup> In other words, while common experiences in racism, sexism, and homophobia had brought the group together and that commonality could not be ignored, there must still be a recognition of their individualized humanity.
                    </p>
                    <p>
                      Years later, on August 27, 1983, Audre Lorde delivered an address as part of the "Litany of Commitment" at the <a href="https://en.wikipedia.org/wiki/March_on_Washington_for_Jobs_and_Freedom" target="_blank" rel="noopener">March on Washington for Jobs and Freedom</a>. "Today we march," she said, "lesbians and gay men and our children, standing in our own names together with all our struggling sisters and brothers here and around the world, in the Middle East, in Central America, in the Caribbean and South Africa, sharing our commitment to work for a joint livable future. We know we do not have to become copies of each other to be able to work together. We know that when we join hands across the table of our difference, our diversity gives us great power. When we can arm ourselves with the strength and vision from all of our diverse communities, then we will in truth all be free at last."<sup class="citation-marker">[89]</sup>
                    </p>
                    <h4 class="subsection-title theory-subheading theory-subheading--level4">Interview</h4>
                    <p>
                      Afro-German feminist scholar and author <a href="https://en.wikipedia.org/wiki/Marion_Kraft" target="_blank" rel="noopener">Dr. Marion Kraft</a> interviewed Audre Lorde in 1986 to discuss a number of her literary works and poems. In this interview, Audre Lorde articulated hope for the next wave of feminist scholarship and discourse. When asked by Kraft, "Do you see any development of the awareness about the importance of differences within the White feminist movement?" Lorde replied with both critiques and hope:<sup class="citation-marker">[90]</sup>
                    </p>
                    <p>
                      Well, the feminist movement, the White feminist movement, has been notoriously slow to recognize that racism is a feminist concern, not one that is altruistic, but one that is part and parcel of feminist consciousness... I think, in fact, though, that things are slowly changing and that there are White women now who recognize that in the interest of genuine coalition, they must see that we are not the same. Black feminism is not White feminism in Blackface. It is an intricate movement coming out of the lives, aspirations, and realities of Black women. We share some things with White women, and there are other things we do not share. We must be able to come together around those things we share.
                    </p>
                    <p>
                      Miriam Kraft summarized Lorde's position when reflecting on the interview; "Yes, we have different historical, social, and cultural backgrounds, different sexual orientations; different aspirations and visions; different skin colors and ages. But we share common experiences and a common goal. Our experiences are rooted in the oppressive forces of racism in various societies, and our goal is our mutual concern to work toward 'a future which has not yet been' in Audre's words."<sup class="citation-marker">[90]</sup>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="minerva-last-edited">
              <cdx-icon :icon="cdxIconClock" size="small" />
              <div class="minerva-last-edited-text">
                <div class="minerva-last-edited-title">Last edited 1 month ago</div>
                <div class="minerva-last-edited-subtitle">Unreviewed</div>
              </div>
              <cdx-icon :icon="cdxIconNext" size="small" class="minerva-last-edited-arrow" />
            </div>

            <div class="minerva-related">
              <div class="minerva-related-title">RELATED PAGES</div>
              <div class="minerva-related-list">
                <div class="minerva-related-card">
                  <cdx-icon :icon="cdxIconArticle" size="small" />
                  <div class="minerva-related-content">
                    <div class="minerva-related-name">Article title (max 2 lines)</div>
                    <div class="minerva-related-meta">Wikipedia article (more) 1 mo</div>
                  </div>
                </div>
                <div class="minerva-related-card">
                  <cdx-icon :icon="cdxIconArticle" size="small" />
                  <div class="minerva-related-content">
                    <div class="minerva-related-name">Article title (max 2 lines)</div>
                    <div class="minerva-related-meta">Wikipedia article (more) 1 mo</div>
                  </div>
                </div>
                <div class="minerva-related-card">
                  <cdx-icon :icon="cdxIconArticle" size="small" />
                  <div class="minerva-related-content">
                    <div class="minerva-related-name">Article title (max 2 lines)</div>
                    <div class="minerva-related-meta">Wikipedia article (more) 1 mo</div>
                  </div>
                </div>
              </div>
            </div>

            <footer class="minerva-footer">
              <div class="minerva-footer-brand">Wikipedia</div>
              <div class="minerva-footer-meta">
                Content is available under <a href="#">CC BY-SA 4.0</a> unless otherwise noted.
              </div>
            </footer>
          </div>

          <!-- Edit Mode Content -->
          <div v-else class="edit-mode-content">
            <!-- Editor Toolbar -->
            <div
              v-if="isMinervaSkin && editToolbarImprovementsEnabled"
              class="editor-toolbar editor-toolbar--minerva editor-toolbar--minerva-improved"
              :class="{ 'editor-toolbar--scrolled': isEditToolbarScrolled }"
              @mousedown="handleToolbarMouseDown"
              @touchstart="handleToolbarMouseDown"
              @click="handleToolbarClick"
              @touchend="handleToolbarClick"
            >
              <button class="toolbar-btn toolbar-btn-icon-only minerva-toolbar-fixed" aria-label="Close" @click="toggleEditMode">
                <cdx-icon :icon="cdxIconClose" size="medium" />
              </button>
              <div
                ref="minervaToolbarScrollAreaRef"
                class="minerva-toolbar-scroll-area"
                :class="{ 'minerva-toolbar-scroll-area--overflowing': minervaToolbarOverflowing }"
              >
                <button
                  class="toolbar-btn toolbar-btn-icon-only minerva-toolbar-fill"
                  :class="{ 'toolbar-btn-disabled': !hasUnsavedChanges }"
                  :disabled="!hasUnsavedChanges"
                  aria-label="Undo"
                  @click="undoEdits"
                >
                  <cdx-icon :icon="cdxIconUndo" size="medium" />
                </button>
                <button
                  v-if="showMinervaRedoButton"
                  class="toolbar-btn toolbar-btn-icon-only minerva-toolbar-fill"
                  :class="{ 'toolbar-btn-disabled': !editRedoStack.length }"
                  :disabled="!editRedoStack.length"
                  aria-label="Redo"
                  @click="handleMinervaRedo"
                >
                  <cdx-icon :icon="cdxIconRedo" size="medium" />
                </button>
                <div class="toolbar-btn toolbar-btn-icon-only minerva-toolbar-fill text-style-menu">
                  <button
                    class="text-style-menu-trigger"
                    :class="{ 'text-style-menu-trigger--active': isTextStyleMenuOpen }"
                    aria-label="Text styles"
                    ref="textStyleMenuTriggerRef"
                    @click.stop="toggleTextStyleMenu"
                  >
                    <cdx-icon :icon="cdxIconTextStyle" size="medium" />
                  </button>
                  <div
                    v-if="isTextStyleMenuOpen"
                    ref="textStyleMenuPanelRef"
                    class="text-style-menu-panel text-style-menu-panel--minerva"
                    :class="{ 'text-style-menu-panel--expanded': isTextStyleMenuExpanded }"
                  >
                    <ul class="text-style-menu-list" role="menu">
                      <template v-for="item in visibleMinervaTextStyleMenuItems" :key="item.value">
                        <li v-if="item.type === 'divider'" class="text-style-menu-divider" role="separator"></li>
                        <li v-else class="text-style-menu-item" role="none">
                          <button
                            type="button"
                            class="text-style-menu-button"
                            :class="{ 'text-style-menu-button--selected': isInlineTextStyleActive(item.value) }"
                            role="menuitem"
                            :aria-pressed="isTrackedInlineTextStyle(item.value) ? isInlineTextStyleActive(item.value) : undefined"
                            @click="handleTextStyleItemSelect(item.value)"
                          >
                            <cdx-icon :icon="item.icon" size="medium" />
                            <span>{{ item.label }}</span>
                          </button>
                        </li>
                      </template>
                      <li v-if="showMinervaTextStyleMenuToggle" class="text-style-menu-divider" role="separator"></li>
                      <li v-if="showMinervaTextStyleMenuToggle" class="text-style-menu-item" role="none">
                        <button type="button" class="text-style-menu-button text-style-menu-button--toggle" role="menuitem" @click="toggleTextStyleMenuExpanded">
                          <cdx-icon :icon="isTextStyleMenuExpanded ? cdxIconCollapse : cdxIconExpand" size="medium" />
                          <span>{{ isTextStyleMenuExpanded ? 'Fewer' : 'More' }}</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <button v-if="showMinervaResponsiveTopLevelLink" class="toolbar-btn toolbar-btn-icon-only minerva-toolbar-fill" aria-label="Link">
                  <cdx-icon :icon="cdxIconLink" size="medium" />
                </button>
                <button v-if="showMinervaResponsiveTopLevelCite" class="toolbar-btn toolbar-btn-icon-only minerva-toolbar-fill" aria-label="Cite">
                  <cdx-icon :icon="cdxIconQuotes" size="medium" />
                </button>
                <div class="toolbar-btn toolbar-btn-icon-only minerva-add-menu minerva-toolbar-fill">
                  <button
                    class="minerva-add-menu-trigger"
                    :class="{ 'minerva-add-menu-trigger--active': isMinervaAddMenuOpen }"
                    aria-label="Add"
                    ref="minervaAddMenuTriggerRef"
                    @click.stop="toggleMinervaAddMenu"
                  >
                    <cdx-icon :icon="cdxIconAdd" size="medium" />
                  </button>
                  <div
                    v-if="isMinervaAddMenuOpen"
                    ref="minervaAddMenuPanelRef"
                    class="minerva-add-menu-panel"
                  >
                    <ul class="minerva-add-menu-list" role="menu">
                      <template v-for="item in visibleMinervaAddMenuItems" :key="item.value">
                        <li v-if="item.type === 'divider'" class="minerva-edit-menu-divider" role="separator"></li>
                        <li
                          v-else
                          class="minerva-add-menu-item"
                          role="none"
                        >
                        <button type="button" class="minerva-add-menu-button" role="menuitem" @click="handleMinervaAddItem(item.value)">
                          <cdx-icon :icon="item.icon" size="medium" />
                          <span>{{ item.label }}</span>
                        </button>
                      </li>
                      </template>
                    </ul>
                  </div>
                </div>
                <cdx-toggle-button
                  v-if="minervaToolbarToggleEnabled && (showSuggestionToggle || (!showSuggestionToggle && !showSuggestions))"
                  v-model="showSuggestions"
                  quiet
                  aria-label="Toggle suggestions"
                  class="toolbar-btn toolbar-btn-icon-only minerva-toolbar-toggle minerva-toolbar-fill"
                  :class="{ 'minerva-toolbar-toggle--active': showSuggestions }"
                >
                  <span class="lightbulb-icon-wrapper">
                    <span v-if="showSuggestions" class="bulb-rays">
                      <span class="ray ray-1"></span>
                      <span class="ray ray-2"></span>
                      <span class="ray ray-3"></span>
                      <span class="ray ray-4"></span>
                      <span class="ray ray-5"></span>
                    </span>
                    <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    <span
                      v-if="showToggleBadge"
                      class="suggestions-badge"
                      :class="{ 'suggestions-badge--zero': showToggleBadgeZero, 'suggestions-badge--pulse': badgePulse }"
                    >
                      {{ toggleBadgeCount }}
                    </span>
                  </span>
                </cdx-toggle-button>
                <div class="toolbar-btn toolbar-btn-icon-only minerva-edit-menu minerva-toolbar-fill">
                  <button
                    class="minerva-edit-menu-trigger minerva-edit-menu-trigger--overflow"
                    :class="{ 'minerva-edit-menu-trigger--active': isMinervaEditMenuOpen }"
                    aria-label="More options"
                    ref="minervaEditMenuTriggerRef"
                    @click.stop="toggleMinervaEditMenu"
                  >
                    <span ref="minervaEditMenuEllipsisRef" class="minerva-edit-menu-ellipsis-wrapper">
                      <cdx-icon :icon="cdxIconEllipsis" size="medium" class="minerva-edit-menu-ellipsis-icon" />
                      <span v-if="showMinervaEditMenuTriggerDotBadge" class="minerva-edit-menu-trigger-badge-dot"></span>
                    </span>
                  </button>
                  <div
                    v-if="isMinervaEditMenuOpen"
                    ref="minervaEditMenuPanelRef"
                    class="minerva-edit-menu-panel"
                  >
                    <ul class="minerva-edit-menu-list" role="menu">
                      <template v-if="minervaMenuToggleEnabled">
                        <li class="minerva-edit-menu-item" role="none">
                          <div
                            class="minerva-edit-menu-button minerva-edit-menu-button--switch-row"
                          >
                            <cdx-icon :icon="cdxIconWikiText" size="medium" />
                            <span>Source editing</span>
                            <button
                              type="button"
                              class="minerva-edit-menu-switch"
                              :class="{ 'minerva-edit-menu-switch--checked': minervaSourceEditingEnabled }"
                              aria-label="Source editing enabled"
                              role="switch"
                              :aria-checked="minervaSourceEditingEnabled"
                              @click.stop="handleMinervaEditMenuSwitchChange('source-editing', !minervaSourceEditingEnabled)"
                            >
                              <span class="minerva-edit-menu-switch__track">
                                <span class="minerva-edit-menu-switch__grip"></span>
                              </span>
                            </button>
                          </div>
                        </li>
                        <li class="minerva-edit-menu-item" role="none">
                          <div
                            class="minerva-edit-menu-button minerva-edit-menu-button--switch-row"
                          >
                            <span class="lightbulb-icon-wrapper minerva-edit-menu-lightbulb">
                              <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                              <span
                                v-if="showToggleBadge"
                                class="suggestions-badge"
                              >
                                {{ toggleBadgeCount }}
                              </span>
                            </span>
                            <span>Suggestions</span>
                            <button
                              type="button"
                              class="minerva-edit-menu-switch"
                              :class="{ 'minerva-edit-menu-switch--checked': showSuggestions }"
                              aria-label="Suggestions enabled"
                              role="switch"
                              :aria-checked="showSuggestions"
                              @click.stop="handleMinervaEditMenuSwitchChange('suggestion-mode', !showSuggestions)"
                            >
                              <span class="minerva-edit-menu-switch__track">
                                <span class="minerva-edit-menu-switch__grip"></span>
                              </span>
                            </button>
                          </div>
                        </li>
                      </template>
                      <template v-else>
                        <li class="minerva-edit-menu-item" role="none">
                          <button type="button" class="minerva-edit-menu-button minerva-edit-menu-button--active" role="menuitem" @click="handleMinervaEditMenuItem('visual')">
                            <cdx-icon :icon="cdxIconEye" size="medium" />
                            <span>Visual editing</span>
                          </button>
                        </li>
                        <li class="minerva-edit-menu-item" role="none">
                          <button type="button" class="minerva-edit-menu-button" role="menuitem" @click="handleMinervaEditMenuItem('source')">
                            <cdx-icon :icon="cdxIconWikiText" size="medium" />
                            <span>Source editing</span>
                          </button>
                        </li>
                      </template>
                    </ul>
                  </div>
                </div>
              </div>
              <button
                class="toolbar-btn toolbar-btn-icon-only toolbar-btn-primary minerva-toolbar-fixed"
                :class="{ 'toolbar-btn-primary--disabled': !hasUnsavedChanges }"
                :disabled="!hasUnsavedChanges"
              aria-label="Publish"
            >
                <cdx-icon :icon="cdxIconCheck" size="medium" />
              </button>
            </div>
            <div
              v-else-if="isMinervaSkin && (activePrototype === 'option-1' || isArrowOnceMode)"
              class="editor-toolbar editor-toolbar--minerva editor-toolbar--minerva-spaced"
              :class="{ 'editor-toolbar--scrolled': isEditToolbarScrolled }"
              @mousedown="handleToolbarMouseDown"
              @touchstart="handleToolbarMouseDown"
              @click="handleToolbarClick"
              @touchend="handleToolbarClick"
            >
              <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Close" @click="toggleEditMode">
                <cdx-icon :icon="cdxIconClose" size="medium" />
              </button>
              <button
                class="toolbar-btn toolbar-btn-icon-only"
                :class="{ 'toolbar-btn-disabled': !hasUnsavedChanges }"
                :disabled="!hasUnsavedChanges"
                aria-label="Undo"
                @click="undoEdits"
              >
                <cdx-icon :icon="cdxIconUndo" size="medium" />
              </button>
              <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Text styles">
                <cdx-icon :icon="cdxIconTextStyle" size="medium" />
                <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
              </button>
              <div v-if="minervaToolbarToggleEnabled" class="toolbar-btn toolbar-btn-icon-only minerva-add-menu">
                <button
                  class="minerva-add-menu-trigger"
                  :class="{ 'minerva-add-menu-trigger--active': isMinervaAddMenuOpen }"
                  aria-label="Add"
                  ref="minervaAddMenuTriggerRef"
                  @click.stop="toggleMinervaAddMenu"
                >
                  <cdx-icon :icon="cdxIconAdd" size="medium" />
                </button>
                <div
                  v-if="isMinervaAddMenuOpen"
                  ref="minervaAddMenuPanelRef"
                  class="minerva-add-menu-panel"
                >
                  <ul class="minerva-add-menu-list" role="menu">
                    <li
                      v-for="item in minervaAddMenuItems"
                      :key="item.value"
                      class="minerva-add-menu-item"
                      role="none"
                    >
                      <button type="button" class="minerva-add-menu-button" role="menuitem" @click="handleMinervaAddItem(item.value)">
                        <cdx-icon :icon="item.icon" size="medium" />
                        <span>{{ item.label }}</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <template v-if="!minervaToolbarToggleEnabled">
                <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Cite">
                  <cdx-icon :icon="cdxIconQuotes" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Link">
                  <cdx-icon :icon="cdxIconLink" size="medium" />
                </button>
              </template>
              <cdx-toggle-button
                v-if="minervaToolbarToggleEnabled && (showSuggestionToggle || (!showSuggestionToggle && !showSuggestions))"
                v-model="showSuggestions"
                quiet
                aria-label="Toggle suggestions"
                class="toolbar-btn toolbar-btn-icon-only minerva-toolbar-toggle"
                :class="{ 'minerva-toolbar-toggle--active': showSuggestions }"
              >
                <span class="lightbulb-icon-wrapper">
                  <span v-if="showSuggestions" class="bulb-rays">
                    <span class="ray ray-1"></span>
                    <span class="ray ray-2"></span>
                    <span class="ray ray-3"></span>
                    <span class="ray ray-4"></span>
                    <span class="ray ray-5"></span>
                  </span>
                  <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                  <span
                    v-if="showToggleBadge"
                    class="suggestions-badge"
                    :class="{ 'suggestions-badge--zero': showToggleBadgeZero, 'suggestions-badge--pulse': badgePulse }"
                  >
                    {{ toggleBadgeCount }}
                  </span>
                </span>
              </cdx-toggle-button>
              <div class="toolbar-btn toolbar-btn-icon-only minerva-edit-menu">
                <button
                  class="minerva-edit-menu-trigger"
                  :class="{
                    'minerva-edit-menu-trigger--active': isMinervaEditMenuOpen,
                    'minerva-edit-menu-trigger--overflow': minervaMenuToggleEnabled
                  }"
                  :aria-label="minervaMenuToggleEnabled ? 'More options' : 'Edit options'"
                  ref="minervaEditMenuTriggerRef"
                  @click.stop="toggleMinervaEditMenu"
                >
                  <span v-if="minervaMenuToggleEnabled" ref="minervaEditMenuEllipsisRef" class="minerva-edit-menu-ellipsis-wrapper">
                    <cdx-icon :icon="cdxIconEllipsis" size="medium" class="minerva-edit-menu-ellipsis-icon" />
                    <span v-if="showMinervaEditMenuTriggerDotBadge" class="minerva-edit-menu-trigger-badge-dot"></span>
                  </span>
                  <template v-else>
                    <cdx-icon :icon="cdxIconEdit" size="medium" />
                    <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                  </template>
                </button>
                <div
                  v-if="isMinervaEditMenuOpen"
                  ref="minervaEditMenuPanelRef"
                  class="minerva-edit-menu-panel"
                >
                  <ul class="minerva-edit-menu-list" role="menu">
                    <template v-if="minervaMenuToggleEnabled">
                      <li class="minerva-edit-menu-item" role="none">
                        <div
                          class="minerva-edit-menu-button minerva-edit-menu-button--switch-row"
                        >
                          <cdx-icon :icon="cdxIconWikiText" size="medium" />
                          <span>Source editing</span>
                          <button
                            type="button"
                            class="minerva-edit-menu-switch"
                            :class="{ 'minerva-edit-menu-switch--checked': minervaSourceEditingEnabled }"
                            aria-label="Source editing enabled"
                            role="switch"
                            :aria-checked="minervaSourceEditingEnabled"
                            @click.stop="handleMinervaEditMenuSwitchChange('source-editing', !minervaSourceEditingEnabled)"
                          >
                            <span class="minerva-edit-menu-switch__track">
                              <span class="minerva-edit-menu-switch__grip"></span>
                            </span>
                          </button>
                        </div>
                      </li>
                      <li class="minerva-edit-menu-item" role="none">
                        <div
                          class="minerva-edit-menu-button minerva-edit-menu-button--switch-row"
                        >
                          <span class="lightbulb-icon-wrapper minerva-edit-menu-lightbulb">
                            <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                            <span
                              v-if="showToggleBadge"
                              class="suggestions-badge"
                            >
                              {{ toggleBadgeCount }}
                            </span>
                          </span>
                          <span>Suggestions</span>
                          <button
                            type="button"
                            class="minerva-edit-menu-switch"
                            :class="{ 'minerva-edit-menu-switch--checked': showSuggestions }"
                            aria-label="Suggestions enabled"
                            role="switch"
                            :aria-checked="showSuggestions"
                            @click.stop="handleMinervaEditMenuSwitchChange('suggestion-mode', !showSuggestions)"
                          >
                            <span class="minerva-edit-menu-switch__track">
                              <span class="minerva-edit-menu-switch__grip"></span>
                            </span>
                          </button>
                        </div>
                      </li>
                    </template>
                    <template v-else>
                      <li class="minerva-edit-menu-item" role="none">
                        <button type="button" class="minerva-edit-menu-button minerva-edit-menu-button--active" role="menuitem" @click="handleMinervaEditMenuItem('visual')">
                          <cdx-icon :icon="cdxIconEye" size="medium" />
                          <span>Visual editing</span>
                        </button>
                      </li>
                      <li class="minerva-edit-menu-item" role="none">
                        <button type="button" class="minerva-edit-menu-button" role="menuitem" @click="handleMinervaEditMenuItem('source')">
                          <cdx-icon :icon="cdxIconWikiText" size="medium" />
                          <span>Source editing</span>
                        </button>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
              <button
                class="toolbar-btn toolbar-btn-icon-only toolbar-btn-primary"
                :class="{ 'toolbar-btn-primary--disabled': !hasUnsavedChanges }"
                :disabled="!hasUnsavedChanges"
                aria-label="Publish"
              >
                <cdx-icon :icon="cdxIconNext" size="medium" />
              </button>
            </div>
            <div
              v-else-if="isMinervaSkin"
              class="editor-toolbar editor-toolbar--minerva"
              :class="{ 'editor-toolbar--scrolled': isEditToolbarScrolled }"
              @mousedown="handleToolbarMouseDown"
              @touchstart="handleToolbarMouseDown"
              @click="handleToolbarClick"
              @touchend="handleToolbarClick"
            >
              <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Close" @click="toggleEditMode">
                <cdx-icon :icon="cdxIconClose" size="medium" />
              </button>
              <button
                class="toolbar-btn toolbar-btn-icon-only"
                :class="{ 'toolbar-btn-disabled': !hasUnsavedChanges }"
                :disabled="!hasUnsavedChanges"
                aria-label="Undo"
                @click="undoEdits"
              >
                <cdx-icon :icon="cdxIconUndo" size="medium" />
              </button>
              <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Text styles">
                <cdx-icon :icon="cdxIconTextStyle" size="medium" />
                <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
              </button>
              <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Cite">
                <cdx-icon :icon="cdxIconQuotes" size="medium" />
              </button>
              <button class="toolbar-btn toolbar-btn-icon-only" aria-label="Link">
                <cdx-icon :icon="cdxIconLink" size="medium" />
              </button>
              <div class="toolbar-btn toolbar-btn-icon-only minerva-edit-menu">
                <button
                  class="minerva-edit-menu-trigger"
                  :class="{
                    'minerva-edit-menu-trigger--active': isMinervaEditMenuOpen,
                    'minerva-edit-menu-trigger--overflow': minervaMenuToggleEnabled
                  }"
                  :aria-label="minervaMenuToggleEnabled ? 'More options' : 'Edit options'"
                  ref="minervaEditMenuTriggerRef"
                  @click.stop="toggleMinervaEditMenu"
                >
                  <span v-if="minervaMenuToggleEnabled" ref="minervaEditMenuEllipsisRef" class="minerva-edit-menu-ellipsis-wrapper">
                    <cdx-icon :icon="cdxIconEllipsis" size="medium" class="minerva-edit-menu-ellipsis-icon" />
                    <span v-if="showMinervaEditMenuTriggerDotBadge" class="minerva-edit-menu-trigger-badge-dot"></span>
                  </span>
                  <template v-else>
                    <cdx-icon :icon="cdxIconEdit" size="medium" />
                    <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                  </template>
                </button>
                <div
                  v-if="isMinervaEditMenuOpen"
                  ref="minervaEditMenuPanelRef"
                  class="minerva-edit-menu-panel"
                >
                  <ul class="minerva-edit-menu-list" role="menu">
                    <template v-if="minervaMenuToggleEnabled">
                      <li class="minerva-edit-menu-item" role="none">
                        <div
                          class="minerva-edit-menu-button minerva-edit-menu-button--switch-row"
                        >
                          <cdx-icon :icon="cdxIconWikiText" size="medium" />
                          <span>Source editing</span>
                          <button
                            type="button"
                            class="minerva-edit-menu-switch"
                            :class="{ 'minerva-edit-menu-switch--checked': minervaSourceEditingEnabled }"
                            aria-label="Source editing enabled"
                            role="switch"
                            :aria-checked="minervaSourceEditingEnabled"
                            @click.stop="handleMinervaEditMenuSwitchChange('source-editing', !minervaSourceEditingEnabled)"
                          >
                            <span class="minerva-edit-menu-switch__track">
                              <span class="minerva-edit-menu-switch__grip"></span>
                            </span>
                          </button>
                        </div>
                      </li>
                      <li class="minerva-edit-menu-item" role="none">
                        <div
                          class="minerva-edit-menu-button minerva-edit-menu-button--switch-row"
                        >
                          <span class="lightbulb-icon-wrapper minerva-edit-menu-lightbulb">
                            <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                            <span
                              v-if="showToggleBadge"
                              class="suggestions-badge"
                            >
                              {{ toggleBadgeCount }}
                            </span>
                          </span>
                          <span>Suggestions</span>
                          <button
                            type="button"
                            class="minerva-edit-menu-switch"
                            :class="{ 'minerva-edit-menu-switch--checked': showSuggestions }"
                            aria-label="Suggestions enabled"
                            role="switch"
                            :aria-checked="showSuggestions"
                            @click.stop="handleMinervaEditMenuSwitchChange('suggestion-mode', !showSuggestions)"
                          >
                            <span class="minerva-edit-menu-switch__track">
                              <span class="minerva-edit-menu-switch__grip"></span>
                            </span>
                          </button>
                        </div>
                      </li>
                    </template>
                    <template v-else>
                      <li class="minerva-edit-menu-item" role="none">
                        <button type="button" class="minerva-edit-menu-button minerva-edit-menu-button--active" role="menuitem" @click="handleMinervaEditMenuItem('visual')">
                          <cdx-icon :icon="cdxIconEye" size="medium" />
                          <span>Visual editing</span>
                        </button>
                      </li>
                      <li class="minerva-edit-menu-item" role="none">
                        <button type="button" class="minerva-edit-menu-button" role="menuitem" @click="handleMinervaEditMenuItem('source')">
                          <cdx-icon :icon="cdxIconWikiText" size="medium" />
                          <span>Source editing</span>
                        </button>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
              <button
                class="toolbar-btn toolbar-btn-icon-only toolbar-btn-primary"
                :class="{ 'toolbar-btn-primary--disabled': !hasUnsavedChanges }"
                :disabled="!hasUnsavedChanges"
                aria-label="Publish"
              >
                <cdx-icon :icon="cdxIconNext" size="medium" />
              </button>
            </div>
            <div
              v-else
              class="editor-toolbar"
              :class="{ 'editor-toolbar--scrolled': isEditToolbarScrolled }"
              @mousedown="handleToolbarMouseDown"
              @touchstart="handleToolbarMouseDown"
              @click="handleToolbarClick"
              @touchend="handleToolbarClick"
            >
              <div class="editor-toolbar-left">
                <button
                  class="toolbar-btn toolbar-btn-icon-only"
                  :class="{ 'toolbar-btn-disabled': !hasUnsavedChanges }"
                  :disabled="!hasUnsavedChanges"
                  @click="undoEdits"
                >
                  <cdx-icon :icon="cdxIconUndo" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only toolbar-btn-disabled" disabled>
                  <cdx-icon :icon="cdxIconRedo" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <span class="toolbar-btn-text">Paragraph</span>
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <cdx-icon :icon="cdxIconTextStyle" size="medium" />
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconLink" size="medium" />
                </button>
                <button class="toolbar-btn">
                  <cdx-icon :icon="cdxIconQuotes" size="medium" />
                  <span class="toolbar-btn-text">Cite</span>
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <cdx-icon :icon="cdxIconListBullet" size="medium" />
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <span class="toolbar-btn-text">Insert</span>
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconSpecialCharacter" size="medium" />
                </button>
              </div>
              <div class="editor-toolbar-right">
                <cdx-toggle-button 
                  v-if="showToolbarToggle"
                  v-model="showSuggestions"
                  quiet
                  aria-label="Toggle suggestions"
                  class="suggestions-toggle-btn"
                  :class="{ 'suggestions-toggle-btn--active': showSuggestions }"
                >
                  <span class="lightbulb-icon-wrapper">
                    <span v-if="showSuggestions" class="bulb-rays">
                      <span class="ray ray-1"></span>
                      <span class="ray ray-2"></span>
                      <span class="ray ray-3"></span>
                      <span class="ray ray-4"></span>
                      <span class="ray ray-5"></span>
                    </span>
                    <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    <span
                      v-if="showToggleBadge"
                      class="suggestions-badge"
                      :class="{ 'suggestions-badge--zero': showToggleBadgeZero, 'suggestions-badge--pulse': badgePulse }"
                    >
                      {{ toggleBadgeCount }}
                    </span>
                  </span>
                </cdx-toggle-button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconHelp" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconAlert" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-icon-only">
                  <cdx-icon :icon="cdxIconMenu" size="medium" />
                </button>
                <button class="toolbar-btn toolbar-btn-dropdown">
                  <cdx-icon :icon="cdxIconEdit" size="medium" />
                  <cdx-icon :icon="cdxIconExpand" size="small" class="dropdown-icon" />
                </button>
                <button class="toolbar-btn-primary" :class="{ 'toolbar-btn-primary--disabled': !hasUnsavedChanges }" :disabled="!hasUnsavedChanges">
                  Publish changes...
                </button>
              </div>
            </div>

            <div
              v-if="showMinervaFullPageTocFloatingButtonUi"
              class="minerva-full-page-toc"
              :style="{ top: minervaFullPageTocTopOffset }"
              @mouseenter="handleMinervaFullPageTocInteraction"
              @mousemove="handleMinervaFullPageTocInteraction"
              @touchstart.passive="handleMinervaFullPageTocInteraction"
            >
              <cdx-button
                ref="minervaFullPageTocButtonRef"
                class="minerva-full-page-toc-trigger"
                action="default"
                weight="normal"
                size="medium"
                aria-label="Open table of contents"
                @click.stop="toggleMinervaFullPageToc"
              >
                <cdx-icon :icon="cdxIconListBullet" size="medium" />
              </cdx-button>
            </div>

            <div
              v-if="showMinervaFullPageTocDrawerUi"
              class="minerva-full-page-toc-overlay"
              @click="hideMinervaFullPageTocUi"
            ></div>

            <div
              v-if="showMinervaFullPageTocDrawerUi"
              ref="minervaFullPageTocPanelRef"
              class="minerva-full-page-toc-panel minerva-full-page-toc-panel--drawer"
              :style="{ top: minervaFullPageTocDrawerTopOffset }"
              @click.stop
            >
              <div class="minerva-full-page-toc-header">
                <span class="minerva-full-page-toc-title">Contents</span>
                <cdx-button
                  class="minerva-full-page-toc-close"
                  action="default"
                  weight="quiet"
                  aria-label="Close table of contents"
                  @click.stop="hideMinervaFullPageTocUi"
                >
                  <cdx-icon :icon="cdxIconArrowNext" size="medium" />
                </cdx-button>
              </div>
              <div class="minerva-full-page-toc-list">
                <div
                  v-for="item in minervaFullPageTocItems"
                  :key="item.id"
                  class="minerva-full-page-toc-node"
                >
                  <div
                    class="minerva-full-page-toc-item"
                    :class="{ 'minerva-full-page-toc-item--active': activeMinervaFullPageTocSectionId === item.id }"
                  >
                    <button
                      v-if="item.children?.length"
                      type="button"
                      class="minerva-full-page-toc-chevron"
                      :aria-label="isMinervaFullPageTocItemOpen(item.id) ? 'Collapse section' : 'Expand section'"
                      @click.stop="toggleMinervaFullPageTocItem(item.id)"
                    >
                      <cdx-icon
                        :icon="cdxIconNext"
                        size="small"
                        class="minerva-full-page-toc-chevron-icon"
                        :class="{ 'minerva-full-page-toc-chevron-icon--open': isMinervaFullPageTocItemOpen(item.id) }"
                      />
                    </button>
                    <span v-else class="minerva-full-page-toc-chevron-spacer"></span>
                    <button
                      type="button"
                      class="minerva-full-page-toc-link"
                      :class="{ 'minerva-full-page-toc-link--top': item.id === 'top' }"
                      @click="handleMinervaFullPageTocItemClick(item)"
                    >
                      {{ item.label }}
                    </button>
                    <span
                      v-if="item.hasEditCheck"
                      class="minerva-full-page-toc-item-warning"
                      title="Section has edit check"
                    >
                      <cdx-icon :icon="cdxIconAlert" size="small" />
                    </span>
                  </div>
                  <div
                    v-if="item.children?.length && isMinervaFullPageTocItemOpen(item.id)"
                    class="minerva-full-page-toc-children"
                  >
                    <div
                      v-for="child in item.children"
                      :key="child.id"
                      class="minerva-full-page-toc-item minerva-full-page-toc-item--child"
                      :class="{ 'minerva-full-page-toc-item--active': activeMinervaFullPageTocSectionId === child.id }"
                    >
                      <span class="minerva-full-page-toc-chevron-spacer minerva-full-page-toc-chevron-spacer--child"></span>
                      <button
                        type="button"
                        class="minerva-full-page-toc-link minerva-full-page-toc-link--child"
                        @click="handleMinervaFullPageTocItemClick(child)"
                      >
                        {{ child.label }}
                      </button>
                      <span
                        v-if="child.hasEditCheck"
                        class="minerva-full-page-toc-item-warning"
                        title="Section has edit check"
                      >
                        <cdx-icon :icon="cdxIconAlert" size="small" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="showMinervaFullPageSectionsButtonUi && isMinervaFullPageTocOpen"
              class="minerva-full-page-sections-overlay"
              @click="hideMinervaFullPageTocUi"
            ></div>

            <div
              v-if="showMinervaFullPageSectionsButtonUi"
              class="minerva-full-page-sections-nav"
              :style="{ top: minervaFullPageSectionsNavTopOffset }"
              @mouseenter="handleMinervaFullPageSectionsPanelInteraction"
              @mousemove="handleMinervaFullPageSectionsPanelInteraction"
              @touchstart.passive="handleMinervaFullPageSectionsPanelInteraction"
            >
              <div
                v-if="isMinervaFullPageTocOpen"
                ref="minervaFullPageSectionsPanelRef"
                class="minerva-full-page-sections-panel"
                :style="{ top: minervaFullPageSectionsPanelTopOffset }"
              >
                <div
                  v-for="item in minervaFullPageSectionItems"
                  :key="item.id"
                  class="minerva-full-page-sections-item"
                  :class="{
                    'minerva-full-page-sections-item--active': minervaFullPageTocActivePathIds.includes(item.id),
                    'minerva-full-page-sections-item--child': item.level > 0
                  }"
                >
                  <button
                    type="button"
                    class="minerva-full-page-sections-link"
                    @click="handleMinervaFullPageTocItemClick(item)"
                  >
                    {{ item.label }}
                  </button>
                  <span
                    v-if="item.count > 0"
                    class="minerva-full-page-sections-badge"
                    :title="`${item.count} suggestion${item.count === 1 ? '' : 's'}`"
                  >
                    {{ item.count }}
                  </span>
                  <span
                    v-if="item.hasEditCheck"
                    class="minerva-full-page-sections-warning"
                    title="Section has edit check"
                  >
                    <cdx-icon :icon="cdxIconAlert" size="medium" />
                  </span>
                </div>
              </div>
              <cdx-button
                ref="minervaFullPageSectionsButtonRef"
                class="minerva-full-page-sections-trigger"
                :style="{ top: minervaFullPageSectionsButtonTopOffset }"
                action="default"
                weight="quiet"
                aria-label="Open sections navigation"
                @pointerdown.stop.prevent="handleMinervaFullPageSectionsButtonPointerDown"
                @click.stop="handleMinervaFullPageSectionsButtonClick"
              >
                <img :src="minervaScrollIcon" alt="" class="minerva-full-page-sections-trigger-icon">
              </cdx-button>
            </div>

            <div
              v-if="showMinervaFullPageExpandableRailUi"
              ref="minervaFullPageTocPanelRef"
              class="minerva-expandable-rail-panel"
              @click.stop
            >
              <div class="minerva-expandable-rail-header">
                <cdx-button
                  class="minerva-expandable-rail-close"
                  action="default"
                  weight="quiet"
                  aria-label="Close table of contents"
                  @click.stop="hideMinervaFullPageTocUi"
                >
                  <cdx-icon :icon="cdxIconPrevious" size="medium" />
                </cdx-button>
                <span class="minerva-expandable-rail-title">Contents</span>
              </div>
              <div class="minerva-expandable-rail-list">
                <div
                  v-for="item in minervaExpandableRailItems"
                  :key="item.id"
                  class="minerva-expandable-rail-item"
                  :class="{ 'minerva-expandable-rail-item--active': minervaFullPageTocActivePathIds.includes(item.id) }"
                >
                  <button
                    type="button"
                    class="minerva-expandable-rail-link"
                    @click="handleMinervaExpandableRailItemClick(item)"
                  >
                    {{ item.id === 'top' ? 'Top' : item.label }}
                  </button>
                  <div
                    v-if="minervaFullPageTocActivePathIds.includes(item.id) && (item.count > 0 || item.checkCount > 0)"
                    class="minerva-expandable-rail-meta"
                  >
                    <div v-if="item.count > 0" class="minerva-expandable-rail-meta-row minerva-expandable-rail-meta-row--suggestions">
                      <cdx-icon :icon="cdxIconLightbulb" size="small" />
                      <span>{{ item.count }} {{ item.count === 1 ? 'suggestion' : 'suggestions' }}</span>
                    </div>
                    <div v-if="item.checkCount > 0" class="minerva-expandable-rail-meta-row minerva-expandable-rail-meta-row--checks">
                      <cdx-icon :icon="cdxIconAlert" size="small" />
                      <span>{{ item.checkCount }} {{ item.checkCount === 1 ? 'check' : 'checks' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading Overlay (only covers content below toolbar) -->
            <div v-if="isLoading" class="loading-overlay"></div>

            <!-- ProgressBar (centered, 32px below toolbar) -->
            <div v-if="isLoading" class="loading-progress">
              <cdx-progress-bar aria-label="Loading edit mode" />
            </div>

            <!-- Article Content Edit -->
            <div
              class="article-content-edit"
              :class="{ 'article-content-edit--section-only': isMinervaSkin && minervaEditSectionOnly }"
            >
              <!-- Tagline + Short description -->
              <div
                v-if="isMinervaSkin && showSuggestionInfo && isMinervaInfoSheetOpen"
                class="minerva-info-sheet"
                role="dialog"
                aria-label="About suggestions"
              >
                <div class="minerva-info-sheet-content">
                  <div class="suggestions-info-header">
                    <cdx-icon :icon="cdxIconInfo" size="small" />
                    <div class="suggestions-info-title">About suggestions</div>
                  </div>
                  <ul class="suggestions-info-list">
                    <li>Suggestions highlight optional improvements from previous edits.</li>
                    <li>You can review, skip, or turn them off.</li>
                    <li>Use the lightbulb toggle to show or hide suggestions anytime.</li>
                  </ul>
                  <div class="suggestions-info-footer">
                    <cdx-checkbox v-model="dontShowSuggestionInfo">
                      Don't show again
                    </cdx-checkbox>
                    <cdx-button action="progressive" weight="primary" @click="dismissSuggestionInfo">
                      Got it
                    </cdx-button>
                  </div>
                </div>
              </div>
              <div
                v-if="isMinervaSkin && showSuggestionInfo && isMinervaInfoSheetOpen"
                class="minerva-info-sheet-backdrop"
                @click="isMinervaInfoSheetOpen = false"
              ></div>
        <div v-if="!isMinervaSkin || !minervaEditSectionOnly" class="edit-header">
          <p class="tagline-edit">From Wikipedia, the free encyclopedia</p>
                
                <div class="short-description-section">
                  <button class="short-description-btn">
                    <cdx-icon :icon="cdxIconPuzzle" size="medium" class="short-description-icon" />
                    <span class="short-description-text">Short description</span>
                  </button>
                </div>
              </div>
              <div class="article-main-edit">
                <!-- First Section with Infobox -->
                <div
                  v-if="!isMinervaSkin || !minervaEditSectionOnly"
                  class="article-first-section"
                  ref="articleFirstSectionRef"
                >
                  <div class="article-text-block">
                    <div contenteditable="true" @input="markArticleEdited" @keydown="handleToneCheckKeydown" @paste="handlePaste" class="article-text-editable">
                      <p>
                        <strong>Audre Lorde</strong> (<a href="https://en.wikipedia.org/wiki/Help:IPA/English" target="_blank" rel="noopener">/ˈɔːdri ˈlɔːrd/</a>; born <strong>Audrey Geraldine Lorde</strong>; February 18, 1934 – November 17, 1992) was an American writer, <a href="https://en.wikipedia.org/wiki/Professor" target="_blank" rel="noopener">professor</a>, <a href="https://en.wikipedia.org/wiki/Philosopher" target="_blank" rel="noopener">philosopher</a>, <a href="https://en.wikipedia.org/wiki/Intersectionality" target="_blank" rel="noopener">intersectional feminist</a>, <a href="https://en.wikipedia.org/wiki/Poet" target="_blank" rel="noopener">poet</a>, and <a href="https://en.wikipedia.org/wiki/Civil_rights_movement" target="_blank" rel="noopener">civil rights</a> activist.<sup class="citation-marker">[1]</sup> She described herself as a “Black, lesbian, feminist, socialist, mother, warrior, poet” and framed her work as a response to injustice and oppression in multiple forms.<sup class="citation-marker">[2]</sup>
                      </p>
                      <p>
                        Lorde argued that there could be no hierarchy of oppressions among people working toward liberation, and she returned to that idea across her essays, speeches, and poems.<sup class="citation-marker">[3]</sup> As a poet, she is especially known for combining technical control with emotional force and for writing directly about anger, solidarity, and structural inequality.<sup class="citation-marker">[4]</sup>
                      </p>
                      <p>
                        She also received national and international recognition and helped found <a href="https://en.wikipedia.org/wiki/Kitchen_Table:_Women_of_Color_Press" target="_blank" rel="noopener">Kitchen Table: Women of Color Press</a>.<sup class="citation-marker">[5]</sup> As a <a href="https://en.wikipedia.org/wiki/Spoken_word" target="_blank" rel="noopener">spoken word</a> artist, her delivery has been described by the <a href="https://www.poetryfoundation.org/" target="_blank" rel="noopener">Poetry Foundation</a> as powerful, melodic, and intense, while her poetry and prose frequently address civil rights, feminism, lesbian identity, illness, disability, and Black womanhood.<sup class="citation-marker">[6]</sup><sup class="citation-marker">[7]</sup><sup class="citation-marker">[8]</sup>
                      </p>
                    </div>
                  </div>
                  
                  <aside class="infobox">
                    <div class="infobox-title">Audre Lorde</div>
                    
                    <div class="infobox-image-section">
                      <div class="infobox-image">
                        <img :src="audreImage" alt="Audre Lorde in 1980" />
                      </div>
                      <div class="infobox-caption">Lorde in 1980</div>
                    </div>

                    <div class="infobox-row">
                      <div class="infobox-label">Born</div>
                      <div class="infobox-value">
                        Audrey Geraldine Lorde<br>
                        February 18, 1934[1]<br>
                        <a href="#">New York City</a>, U.S.
                      </div>
                    </div>

                    <div class="infobox-row infobox-row-faded">
                      <div class="infobox-label">Died</div>
                      <div class="infobox-value">
                        November 17, 1992 (aged 58)<br>
                        <a href="#">Saint Croix, Virgin Islands</a>, U.S.
                      </div>
                    </div>

                    <div class="infobox-row">
                      <div class="infobox-label">Education</div>
                      <div class="infobox-value infobox-value-link">
                        <a href="#">National Autonomous University of Mexico</a><br>
                        <a href="#">Hunter College (BA)</a><br>
                        <a href="#">Columbia University (MLS)</a>
                      </div>
                    </div>

                    <div class="infobox-row">
                      <div class="infobox-label">Genre</div>
                      <div class="infobox-value">
                        Poetry<br>
                        Nonfiction
                      </div>
                    </div>

                    <div class="infobox-row">
                      <div class="infobox-label">Notable works</div>
                      <div class="infobox-value infobox-value-link">
                        The First Cities<br>
                        <a href="#">Zami: A New Spelling of My Name</a><br>
                        <a href="#">The Cancer Journals</a>
                      </div>
                    </div>
                  </aside>
                </div>

                <!-- Early Life Section -->
                <div v-if="shouldRenderSection('early-life')" class="minerva-edit-section" data-section="early-life">
                <div class="edit-full-page-btn-wrapper">
                  <cdx-button
                    v-if="showEditFullPageButtons('early-life')"
                    class="edit-full-page-btn"
                    :class="{ 'edit-full-page-btn--improved': editFullPageImprovedEnabled && isMinervaSkin }"
                    action="default"
                    :weight="editFullPageImprovedEnabled && isMinervaSkin ? 'quiet' : 'normal'"
                    :size="editFullPageImprovedEnabled && isMinervaSkin ? 'small' : undefined"
                    @click="showFullPageEdit($event)"
                  ><span class="edit-full-page-btn-content">
                        <cdx-icon v-if="editFullPageImprovedEnabled && isMinervaSkin" :icon="cdxIconEdit" size="small" class="edit-full-page-start-icon" />
                        <span>Edit full page</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-separator">|</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-indicator">
                          <cdx-icon :icon="cdxIconLightbulb" size="small" class="edit-full-page-icon" />
                          <span class="edit-full-page-badge-dot"></span>
                        </span>
                      </span>
                    </cdx-button>
                </div>
                  <div class="section-heading-edit" ref="editSectionEarlyLife">
                    <h2 class="heading-text-edit">Early life</h2>
                    <div class="heading-divider"></div>
                  </div>
                  
                  <div contenteditable="true" @input="markArticleEdited" @keydown="handleToneCheckKeydown" @paste="handlePaste" class="article-text-editable">
                    <p>
                      Lorde was born in New York City. Her father, Byron Lorde, was born in <a href="https://en.wikipedia.org/wiki/Barbados" target="_blank" rel="noopener">Barbados</a>, and her mother, Linda Gertrude Belmar Lorde, was born on <a href="https://en.wikipedia.org/wiki/Carriacou" target="_blank" rel="noopener">Carriacou</a>, in <a href="https://en.wikipedia.org/wiki/Grenada" target="_blank" rel="noopener">Grenada</a>.<sup class="citation-marker">[9]</sup> Her mother was a light-skinned Black woman who at times passed as Spanish for employment opportunities, while Byron Lorde was darker than the Belmar family preferred.<sup class="citation-marker">[10]</sup><sup class="citation-marker">[11]</sup>
                    </p>
                    <p>
                      After immigrating, the family settled in <a href="https://en.wikipedia.org/wiki/Harlem" target="_blank" rel="noopener">Harlem</a>, where Lorde grew up as the youngest of three daughters and was <a href="https://en.wikipedia.org/wiki/Myopia" target="_blank" rel="noopener">nearsighted</a> to the point of being legally blind.<sup class="citation-marker">[12]</sup> At age four she learned to read at the same time that she learned to speak, with help from librarian <a href="https://en.wikipedia.org/wiki/Augusta_Braxton_Baker" target="_blank" rel="noopener">Augusta Braxton Baker</a> at the 135th Street branch of the <a href="https://en.wikipedia.org/wiki/New_York_Public_Library" target="_blank" rel="noopener">New York Public Library</a>, and her mother taught her to write soon afterward.<sup class="citation-marker">[13]</sup>
                    </p>
                    <p>
                      Born Audrey Geraldine Lorde, she dropped the “y” from her first name while still a child because she preferred the visual symmetry of “Audre Lorde.”<sup class="citation-marker">[14]</sup><sup class="citation-marker">[15]</sup> She later wrote about a difficult relationship with her parents, discovered poetry as a crucial form of expression, attended Catholic schools and then <a href="https://en.wikipedia.org/wiki/Hunter_College_High_School" target="_blank" rel="noopener">Hunter College High School</a>, and published her first poem in <a href="https://en.wikipedia.org/wiki/Seventeen_(American_magazine)" target="_blank" rel="noopener">Seventeen</a> after her school literary journal rejected it.<sup class="citation-marker">[16]</sup><sup class="citation-marker">[17]</sup><sup class="citation-marker">[18]</sup><sup class="citation-marker">[19]</sup><sup class="citation-marker">[20]</sup><sup class="citation-marker">[21]</sup>
                    </p>
                  </div>
                  <div class="edit-full-page-btn-wrapper">
                    <cdx-button
                      v-if="showEditFullPageButtons('early-life')"
                      class="edit-full-page-btn"
                      :class="{ 'edit-full-page-btn--improved': editFullPageImprovedEnabled && isMinervaSkin }"
                      action="default"
                      :weight="editFullPageImprovedEnabled && isMinervaSkin ? 'quiet' : 'normal'"
                      :size="editFullPageImprovedEnabled && isMinervaSkin ? 'small' : undefined"
                      @click="showFullPageEdit($event)"
                    ><span class="edit-full-page-btn-content">
                        <cdx-icon v-if="editFullPageImprovedEnabled && isMinervaSkin" :icon="cdxIconEdit" size="small" class="edit-full-page-start-icon" />
                        <span>Edit full page</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-separator">|</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-indicator">
                          <cdx-icon :icon="cdxIconLightbulb" size="small" class="edit-full-page-icon" />
                          <span class="edit-full-page-badge-dot"></span>
                        </span>
                      </span>
                    </cdx-button>
                  </div>
                </div>

                <!-- Career Section -->
                <div v-if="shouldRenderSection('career')" class="minerva-edit-section" data-section="career">
                  <div class="edit-full-page-btn-wrapper">
                    <cdx-button
                      v-if="showEditFullPageButtons('career')"
                      class="edit-full-page-btn"
                      :class="{ 'edit-full-page-btn--improved': editFullPageImprovedEnabled && isMinervaSkin }"
                      action="default"
                      :weight="editFullPageImprovedEnabled && isMinervaSkin ? 'quiet' : 'normal'"
                      :size="editFullPageImprovedEnabled && isMinervaSkin ? 'small' : undefined"
                      @click="showFullPageEdit($event)"
                    ><span class="edit-full-page-btn-content">
                        <cdx-icon v-if="editFullPageImprovedEnabled && isMinervaSkin" :icon="cdxIconEdit" size="small" class="edit-full-page-start-icon" />
                        <span>Edit full page</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-separator">|</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-indicator">
                          <cdx-icon :icon="cdxIconLightbulb" size="small" class="edit-full-page-icon" />
                          <span class="edit-full-page-badge-dot"></span>
                        </span>
                      </span>
                    </cdx-button>
                  </div>
                  <div class="section-heading-edit" ref="editSectionCareer">
                    <h2 class="heading-text-edit">Career</h2>
                    <div class="heading-divider"></div>
                  </div>
                  
                  <div contenteditable="true" @input="markArticleEdited" @keydown="handleToneCheckKeydown" @paste="handlePaste" class="article-text-editable">
                  <p>
                    In 1954, she spent a pivotal year as a student at the <a href="#">National Autonomous University of Mexico</a>, a period she described as a time of affirmation and renewal. During this time, she confirmed her identity on personal and artistic levels as both a lesbian and a poet. On her return to New York, Lorde attended <a href="#">Hunter College</a>, and graduated in the class of 1959. While there, she worked as a librarian, continued writing, and became an active participant in the <a href="#">gay culture</a> of <a href="#">Greenwich Village</a>. She furthered her education at the <a href="#">Columbia University School of Library Service</a>, earning a master's degree in <a href="#">library science</a> in 1961. During this period, she worked as a public librarian in nearby <a href="#">Mount Vernon, New York</a>.
                  </p>
                                    <!-- Highlighted Text with interactive states -->
                  <p 
                    v-if="showSuggestionsDisplay && (isSuggestion1Pending || isSuccessHighlightActive(1))"
                    ref="highlightedTextRef"
                    :class="{ 
                      'highlighted-text-wrapper': showSuggestions,
                      [nonSelectedHighlightClass]: showSuggestions,
                      'highlighted-text-wrapper--hover': isSuggestion1Pending && isHovered && showSuggestions && !isCardExpanded,
                      'highlighted-text-wrapper--selected': isSuggestion1Pending && isCardExpanded && showSuggestions,
                      'highlighted-text-wrapper--success': isSuccessHighlightActive(1),
                      'minerva-suggestion-target': isMinervaSkin && isSuggestion1Pending,
                      'suggestion-dismiss-right': dismissedSuggestionId === 1
                    }" 
                    class="suggestion-target"
                    @mouseenter="isTextHovered = true"
                    @mouseleave="isTextHovered = false"
                    @click="isSuggestion1Pending ? (isMinervaSkin ? openMinervaSuggestion(1) : (isCardExpanded = true)) : null"
                  >
                    <span v-if="isSuggestion1Pending" class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      <span class="highlighted-text-annotation">
                      In 1968 Lorde was writer-in-residence at <a href="#">Tougaloo College</a> in Mississippi. Lorde's time at Tougaloo College, like her year at the <a href="#">National University of Mexico</a>, was a formative experience for her as an artist. She led workshops with her young, black undergraduate students, many of whom were eager to discuss the <a href="#">civil rights</a> issues of that time. Through these discussions with her students, she reaffirmed her desire not only to live out her "crazy and queer" identity, but also to devote attention to the formal aspects of her craft as a poet. Her book of poems, <em>Cables to Rage</em>, came out of her time and experiences at Tougaloo.<sup v-if="showCitationPopup1 || citationNumber1" class="citation-marker" ref="citationMarker1">[{{ citationNumber1 || '...' }}]</sup>
                      </span>
                    </span>
                    <span
                      v-if="isMinervaSkin && (isSuggestion1Pending || isSuccessHighlightActive(1))"
                      class="minerva-highlight-rail"
                      :class="{ 'minerva-highlight-rail--success': isSuccessHighlightActive(1) }"
                    ></span>
                    <button
                      v-if="isMinervaSkin && isSuggestion1Pending"
                      type="button"
                      class="minerva-suggestion-trigger"
                      :class="{ 'minerva-suggestion-trigger--bounce': firstSuggestionBounceActiveId === 1 }"
                      aria-label="Show suggestion"
                      @mousedown.prevent
                      @touchstart.stop.prevent="openMinervaSuggestion(1)"
                      @click.stop="openMinervaSuggestion(1)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    </button>
                    <span
                      v-else-if="isMinervaSkin && isSuccessHighlightActive(1)"
                      class="minerva-suggestion-trigger minerva-suggestion-trigger--success"
                      aria-hidden="true"
                    >
                      <cdx-icon :icon="cdxIconSuccess" size="medium" />
                    </span>
                  </p>

                  <!-- Citation Popup 1 -->
                  <div v-if="showCitationPopup1" class="citation-popup" contenteditable="false">
                    <!-- Pointer arrow -->
                    <div class="citation-popup-pointer"></div>
                    
                    <div class="citation-popup-header">
                      <button class="citation-popup-close" @click="showCitationPopup1 = false" aria-label="Close">
                        <cdx-icon :icon="cdxIconClose" size="medium" />
                      </button>
                      <h3 class="citation-popup-title">Add citation</h3>
                    </div>
                    <div class="citation-popup-tabs">
                      <button class="citation-tab citation-tab--active">Automatic</button>
                      <button class="citation-tab">Manual</button>
                      <button class="citation-tab">Re-use</button>
                    </div>
                    <div class="citation-popup-content">
                      <p class="citation-popup-description">Enter a link or reference code (ISBN, DOI or other) to create a citation</p>
                      <div class="citation-input-group">
                        <input 
                          v-model="citationUrl1" 
                          type="text" 
                          class="citation-input" 
                          placeholder="http://www.example.com"
                        />
                        <button 
                          class="citation-create-btn" 
                          :disabled="!isValidUrl1"
                          @click="createCitation1"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <p v-else>
                    In 1968 Lorde was writer-in-residence at <a href="#">Tougaloo College</a> in Mississippi. Lorde's time at Tougaloo College, like her year at the <a href="#">National University of Mexico</a>, was a formative experience for her as an artist. She led workshops with her young, black undergraduate students, many of whom were eager to discuss the <a href="#">civil rights</a> issues of that time. Through these discussions with her students, she reaffirmed her desire not only to live out her "crazy and queer" identity, but also to devote attention to the formal aspects of her craft as a poet. Her book of poems, <em>Cables to Rage</em>, came out of her time and experiences at Tougaloo.
                    <sup v-if="citationNumber1" class="citation-marker">[{{ citationNumber1 }}]</sup>
                  </p>
                                    <p>
                    From 1972 to 1987, Lorde resided on <a href="#">Staten Island</a>. During that time, in addition to writing and teaching she co-founded <a href="#">Kitchen Table: Women of Color Press</a>.
                  </p>
                                    <p>
                    In 1977, Lorde became an associate of the <a href="#">Women's Institute for Freedom of the Press</a> (WIFP). WIFP is an American nonprofit publishing organization. The organization works to increase communication between women and connect the public with forms of women-based media.
                  </p>
                                    <p>
                    Lorde taught in the Education Department at <a href="#">Lehman College</a> from 1969 to 1970, then as a professor of English at <a href="#">John Jay College of Criminal Justice</a> (both part of the <a href="#">City University of New York</a>, CUNY) from 1970 to 1981. There, she fought for the creation of a <a href="#">black studies</a> department. In 1981, she went on to teach at her alma mater, <a href="#">Hunter College</a> (also CUNY), as the distinguished Thomas Hunter chair. As a queer Black woman, she was an outsider in a <a href="#">white male</a> dominated field and her experiences in this environment deeply influenced her work. New fields such as <a href="#">African American studies</a> and <a href="#">women's studies</a> advanced the topics that scholars were addressing and garnered attention to groups that had previously been rarely discussed. With this newfound <a href="#">academic</a> environment, Lorde was inspired to not only write poetry but also essays and articles about queer, feminist, and African American studies.
                  </p>
                                    <p>
                    In 1980, together with <a href="#">Barbara Smith</a> and <a href="#">Cherríe Moraga</a>, she co-founded <a href="#">Kitchen Table: Women of Color Press</a>, the first U.S. publisher for women of color.
                  </p>
                                    <p>
                    In 1981, Lorde was among the founders of the Women's Coalition of St. Croix, an organization dedicated to assisting women who have survived sexual abuse and <a href="#">intimate partner violence</a>. In the late 1980s, she also helped establish Sisterhood in Support of Sisters (SISA) in South Africa to benefit black women who were affected by <a href="#">apartheid</a> and other forms of injustice.
                  </p>
                                    <p>
                    In 1985, Audre Lorde was a part of a delegation of <a href="#">black women</a> writers who had been invited to <a href="#">Cuba</a>. The trip was sponsored by <em>The Black Scholar</em> and the Union of Cuban Writers. She embraced the shared sisterhood as black women writers. They visited Cuban poets <a href="#">Nancy Morejón</a> and <a href="#">Nicolas Guillén</a>. They discussed whether the Cuban revolution had truly changed racism and the status of lesbians and gays there.
                  </p>
                </div>
                  <div class="edit-full-page-btn-wrapper">
                    <cdx-button
                      v-if="showEditFullPageButtons('career')"
                      class="edit-full-page-btn"
                      :class="{ 'edit-full-page-btn--improved': editFullPageImprovedEnabled && isMinervaSkin }"
                      action="default"
                      :weight="editFullPageImprovedEnabled && isMinervaSkin ? 'quiet' : 'normal'"
                      :size="editFullPageImprovedEnabled && isMinervaSkin ? 'small' : undefined"
                      @click="showFullPageEdit($event)"
                    ><span class="edit-full-page-btn-content">
                        <cdx-icon v-if="editFullPageImprovedEnabled && isMinervaSkin" :icon="cdxIconEdit" size="small" class="edit-full-page-start-icon" />
                        <span>Edit full page</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-separator">|</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-indicator">
                          <cdx-icon :icon="cdxIconLightbulb" size="small" class="edit-full-page-icon" />
                          <span class="edit-full-page-badge-dot"></span>
                        </span>
                      </span>
                    </cdx-button>
                  </div>
              </div>

                <!-- Poetry Section -->
                <div v-if="shouldRenderSection('poetry')" class="minerva-edit-section" data-section="poetry">
                  <div class="edit-full-page-btn-wrapper">
                    <cdx-button
                      v-if="showEditFullPageButtons('poetry')"
                      class="edit-full-page-btn"
                      :class="{ 'edit-full-page-btn--improved': editFullPageImprovedEnabled && isMinervaSkin }"
                      action="default"
                      :weight="editFullPageImprovedEnabled && isMinervaSkin ? 'quiet' : 'normal'"
                      :size="editFullPageImprovedEnabled && isMinervaSkin ? 'small' : undefined"
                      @click="showFullPageEdit($event)"
                    ><span class="edit-full-page-btn-content">
                        <cdx-icon v-if="editFullPageImprovedEnabled && isMinervaSkin" :icon="cdxIconEdit" size="small" class="edit-full-page-start-icon" />
                        <span>Edit full page</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-separator">|</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-indicator">
                          <cdx-icon :icon="cdxIconLightbulb" size="small" class="edit-full-page-icon" />
                          <span class="edit-full-page-badge-dot"></span>
                        </span>
                      </span>
                    </cdx-button>
                  </div>
                  <div class="section-heading-edit" ref="editSectionPoetry">
                    <h2 class="heading-text-edit">Poetry</h2>
                    <div class="heading-divider"></div>
                  </div>

                  <div contenteditable="true" @input="markArticleEdited" @keydown="handleToneCheckKeydown" @paste="handlePaste" class="article-text-editable">
                  <p>
                    Lorde focused her discussion of difference not only on differences between groups of women but between conflicting differences within the individual. "I am defined as other in every group I'm part of," she declared. "Yet without community," Lorde wrote, "there is certainly no liberation, no future, only the most vulnerable and temporary armistice between me and my oppression". She described herself both as a part of a "continuum of women" and a "concert of voices" within herself.
                  </p>
                                    <p>
                    Her conception of her many layers of selfhood is replicated in the multi-genres of her work. Critic Carmen Birkle wrote: "Her multicultural self is thus reflected in a multicultural text, in multi-genres, in which the individual cultures are no longer separate and autonomous entities but melt into a larger whole without losing their individual importance." Her refusal to be placed in a particular category, whether social or literary, was characteristic of her determination to come across as an individual rather than a stereotype. Lorde considered herself a "lesbian, mother, warrior, poet" and used poetry to get this message across.
                  </p>
                                    <h3 class="subsection-title">Early works</h3>
                                    <p>
                    Lorde's poetry was published very regularly during the 1960s - in Langston Hughes' 1962 New Negro Poets, USA; in several foreign anthologies; and in black literary magazines. During this time, she was also politically active in civil rights, anti-war, and feminist movements.
                  </p>
                                    <p
                    v-if="showSuggestionsDisplay && (isSuggestion8Pending || isSuccessHighlightActive(8))"
                    ref="highlightedTextRef8"
                    :class="{
                      'highlighted-text-wrapper': showSuggestions,
                      [nonSelectedHighlightClass]: showSuggestions,
                      'highlighted-text-wrapper--hover': isSuggestion8Pending && isHovered8 && showSuggestions && !isCardExpanded8,
                      'highlighted-text-wrapper--selected': isSuggestion8Pending && isCardExpanded8 && showSuggestions,
                      'highlighted-text-wrapper--success': isSuccessHighlightActive(8),
                      'minerva-suggestion-target': isMinervaSkin && isSuggestion8Pending,
                      'suggestion-dismiss-right': dismissedSuggestionId === 8
                    }"
                    class="suggestion-target"
                    @mouseenter="isTextHovered8 = true"
                    @mouseleave="isTextHovered8 = false"
                    @click="isSuggestion8Pending ? (isMinervaSkin ? openMinervaSuggestion(8) : (isCardExpanded8 = true)) : null"
                  >
                    <span v-if="isSuggestion8Pending" class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      In 1968, Lorde published <span class="highlighted-text-annotation"><a href="https://example.org/the-first-cities" target="_blank" rel="noopener">The First Cities</a></span>, her first volume of poems. It was edited by Diane di Prima, a former classmate and friend from Hunter College High School. The First Cities has been described as a "quiet, introspective book", and Dudley Randall, a poet and critic, asserted in his review of the book that Lorde "does not wave a black flag, but her Blackness is there, implicit, in the bone".
                    </span>
                    <span
                      v-if="isMinervaSkin && (isSuggestion8Pending || isSuccessHighlightActive(8))"
                      class="minerva-highlight-rail"
                      :class="{ 'minerva-highlight-rail--success': isSuccessHighlightActive(8) }"
                    ></span>
                    <button
                      v-if="isMinervaSkin && isSuggestion8Pending"
                      type="button"
                      class="minerva-suggestion-trigger"
                      aria-label="Show suggestion"
                      @mousedown.prevent
                      @touchstart.stop.prevent="openMinervaSuggestion(8)"
                      @click.stop="openMinervaSuggestion(8)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    </button>
                    <span
                      v-else-if="isMinervaSkin && isSuccessHighlightActive(8)"
                      class="minerva-suggestion-trigger minerva-suggestion-trigger--success"
                      aria-hidden="true"
                    >
                      <cdx-icon :icon="cdxIconSuccess" size="medium" />
                    </span>
                  </p>
                                    <p v-else>
                    In 1968, Lorde published <a href="https://example.org/the-first-cities" target="_blank" rel="noopener">The First Cities</a>, her first volume of poems. It was edited by Diane di Prima, a former classmate and friend from Hunter College High School. The First Cities has been described as a "quiet, introspective book", and Dudley Randall, a poet and critic, asserted in his review of the book that Lorde "does not wave a black flag, but her Blackness is there, implicit, in the bone".
                  </p>
                                    <p>
                    Her second volume, Cables to Rage (1970), which was mainly written during her tenure as poet-in-residence at Tougaloo College in Mississippi, addressed themes of love, betrayal, childbirth, and the complexities of raising children. It is particularly noteworthy for the poem "Martha", in which Lorde openly confirms her homosexuality for the first time in her writing: "[W]e shall love each other here if ever at all".
                  </p>
                                    <p>
                    Nominated for the National Book Award for poetry in 1974, From a Land Where Other People Live (Broadside Press) shows Lorde's personal struggles with identity and anger at social injustice. The volume deals with themes of anger, loneliness, and injustice, as well as what it means to be a black woman, mother, friend, and lover.
                  </p>
                                    <p>
                    1974 saw the release of New York Head Shop and Museum, which gives a picture of Lorde's New York through the lenses of both the civil rights movement and her own restricted childhood: stricken with poverty and neglect and, in Lorde's opinion, in need of political action.
                  </p>
                                    <p
                    v-if="showSuggestionsDisplay && (isSuggestion6Pending || isSuccessHighlightActive(6))"
                    ref="highlightedTextRef6"
                    :class="{
                      'highlighted-text-wrapper': showSuggestions,
                      [nonSelectedHighlightClass]: showSuggestions,
                      'highlighted-text-wrapper--hover': isSuggestion6Pending && isHovered6 && showSuggestions && !isCardExpanded6,
                      'highlighted-text-wrapper--selected': isSuggestion6Pending && isCardExpanded6 && showSuggestions,
                      'highlighted-text-wrapper--success': isSuccessHighlightActive(6),
                      'minerva-suggestion-target': isMinervaSkin && isSuggestion6Pending,
                      'suggestion-dismiss-right': dismissedSuggestionId === 6
                    }"
                    class="suggestion-target"
                    @mouseenter="isTextHovered6 = true"
                    @mouseleave="isTextHovered6 = false"
                    @click="isSuggestion6Pending ? (isMinervaSkin ? openMinervaSuggestion(6) : (isCardExpanded6 = true)) : null"
                  >
                    <span v-if="isSuggestion6Pending" class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      <span class="highlighted-text-annotation"><strong class="subsection-title">Wider recognition</strong></span>
                    </span>
                    <span
                      v-if="isMinervaSkin && (isSuggestion6Pending || isSuccessHighlightActive(6))"
                      class="minerva-highlight-rail"
                      :class="{ 'minerva-highlight-rail--success': isSuccessHighlightActive(6) }"
                    ></span>
                    <button
                      v-if="isMinervaSkin && isSuggestion6Pending"
                      type="button"
                      class="minerva-suggestion-trigger"
                      aria-label="Show suggestion"
                      @mousedown.prevent
                      @touchstart.stop.prevent="openMinervaSuggestion(6)"
                      @click.stop="openMinervaSuggestion(6)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    </button>
                    <span
                      v-else-if="isMinervaSkin && isSuccessHighlightActive(6)"
                      class="minerva-suggestion-trigger minerva-suggestion-trigger--success"
                      aria-hidden="true"
                    >
                      <cdx-icon :icon="cdxIconSuccess" size="medium" />
                    </span>
                  </p>
                                    <h3 v-else class="subsection-title">Wider recognition</h3>
                                    <p>
                    Despite the success of these volumes, it was the release of Coal in 1976 that established Lorde as an influential voice in the Black Arts Movement, and the large publishing house behind it - Norton - helped introduce her to a wider audience. The volume includes poems from both The First Cities and Cables to Rage, and it unites many of the themes Lorde would become known for throughout her career: her rage at racial injustice, her celebration of her black identity, and her call for an intersectional consideration of women's experiences. Lorde followed Coal up with Between Our Selves (also in 1976) and Hanging Fire (1978).
                  </p>
                                    <p
                    v-if="showSuggestionsDisplay && (isSuggestion2Pending || isSuccessHighlightActive(2))"
                    ref="highlightedTextRef2"
                    :class="{ 
                      'highlighted-text-wrapper': showSuggestions,
                      [nonSelectedHighlightClass]: showSuggestions,
                      'highlighted-text-wrapper--hover': isSuggestion2Pending && isHovered2 && showSuggestions && !isCardExpanded2,
                      'highlighted-text-wrapper--selected': isSuggestion2Pending && isCardExpanded2 && showSuggestions,
                      'highlighted-text-wrapper--success': isSuccessHighlightActive(2),
                      'minerva-suggestion-target': isMinervaSkin && isSuggestion2Pending,
                      'suggestion-dismiss-right': dismissedSuggestionId === 2
                    }"
                    class="suggestion-target"
                    @mouseenter="isTextHovered2 = true"
                    @mouseleave="isTextHovered2 = false"
                    @click="isSuggestion2Pending ? (isMinervaSkin ? openMinervaSuggestion(2) : (isCardExpanded2 = true)) : null"
                  >
                    <span v-if="isSuggestion2Pending" class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      <span class="highlighted-text-annotation">
                      In Lorde's volume
                      <span
                        v-if="isSuggestion4Pending || isSuccessHighlightActive(4)"
                        ref="highlightedTextRef4"
                        class="suggestion-target suggestion-target--inline"
                        :class="{
                          [nonSelectedHighlightClass]: showSuggestions,
                          'highlighted-text-wrapper--hover': isSuggestion4Pending && isHovered4 && showSuggestions && !isCardExpanded4,
                          'highlighted-text-wrapper--selected': isSuggestion4Pending && isCardExpanded4 && showSuggestions,
                          'highlighted-text-wrapper--success': isSuccessHighlightActive(4)
                        }"
                        @mouseenter.stop="isTextHovered4 = true"
                        @mouseleave.stop="isTextHovered4 = false"
                        @click.stop="isSuggestion4Pending ? (isMinervaSkin ? openMinervaSuggestion(4) : (isCardExpanded4 = true)) : null"
                      >
                        <span class="highlighted-text-content">
                          <span class="highlighted-text-annotation">
                            <a href="https://example.org/the-black-unicorn" target="_blank" rel="noopener">The Black Unicorn</a>
                          </span>
                        </span>
                      </span>
                      <template v-else>The Black Unicorn</template>
                      (1978), she describes her identity within the mythos of African female deities of creation, fertility, and warrior strength. This reclamation of African female identity both builds and challenges existing Black Arts ideas about pan-Africanism. While writers like Amiri Baraka and Ishmael Reed utilized African cosmology in a way that "furnished a repertoire of bold male gods capable of forging and defending an aboriginal Black universe," in Lorde's writing "that warrior ethos is transferred to a female vanguard capable equally of force and fertility".<sup v-if="showCitationPopup2 || citationNumber2" class="citation-marker">[{{ citationNumber2 || '...' }}]</sup>
                      </span>
                    </span>
                    <span
                      v-if="isMinervaSkin && (isSuggestion2Pending || isSuccessHighlightActive(2))"
                      class="minerva-highlight-rail"
                      :class="{ 'minerva-highlight-rail--success': isSuccessHighlightActive(2) }"
                    ></span>
                    <button
                      v-if="isMinervaSkin && isSuggestion2Pending"
                      type="button"
                      class="minerva-suggestion-trigger"
                      :class="{ 'minerva-suggestion-trigger--bounce': firstSuggestionBounceActiveId === 2 }"
                      aria-label="Show suggestion"
                      @mousedown.prevent
                      @touchstart.stop.prevent="openMinervaSuggestion(2)"
                      @click.stop="openMinervaSuggestion(2)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                      <span v-if="isSuggestion2Pending && isSuggestion4Pending" class="minerva-suggestion-trigger-badge">2</span>
                    </button>
                    <span
                      v-else-if="isMinervaSkin && isSuccessHighlightActive(2)"
                      class="minerva-suggestion-trigger minerva-suggestion-trigger--success"
                      aria-hidden="true"
                    >
                      <cdx-icon :icon="cdxIconSuccess" size="medium" />
                    </span>
                  </p>
                  <p
                    v-else
                    :class="{ 'minerva-suggestion-target': isMinervaSkin }"
                  >
                    In Lorde's volume
                    <span
                      v-if="isSuggestion4Pending || isSuccessHighlightActive(4)"
                      ref="highlightedTextRef4"
                      class="suggestion-target suggestion-target--inline"
                      :class="{
                        [nonSelectedHighlightClass]: showSuggestions,
                        'highlighted-text-wrapper--hover': isSuggestion4Pending && isHovered4 && showSuggestions && !isCardExpanded4,
                        'highlighted-text-wrapper--selected': isSuggestion4Pending && isCardExpanded4 && showSuggestions,
                        'highlighted-text-wrapper--success': isSuccessHighlightActive(4),
                        'suggestion-dismiss-right': dismissedSuggestionId === 4
                      }"
                      @mouseenter.stop="isTextHovered4 = true"
                      @mouseleave.stop="isTextHovered4 = false"
                      @click.stop="isSuggestion4Pending ? (isMinervaSkin ? openMinervaSuggestion(4) : (isCardExpanded4 = true)) : null"
                    >
                      <span class="highlighted-text-content">
                        <span class="highlighted-text-annotation">
                          <a href="https://example.org/the-black-unicorn" target="_blank" rel="noopener">The Black Unicorn</a>
                        </span>
                      </span>
                    </span>
                    <template v-else>The Black Unicorn</template>
                    (1978), she describes her identity within the mythos of African female deities of creation, fertility, and warrior strength. This reclamation of African female identity both builds and challenges existing Black Arts ideas about pan-Africanism. While writers like Amiri Baraka and Ishmael Reed utilized African cosmology in a way that "furnished a repertoire of bold male gods capable of forging and defending an aboriginal Black universe," in Lorde's writing "that warrior ethos is transferred to a female vanguard capable equally of force and fertility".
                    <sup v-if="citationNumber2" class="citation-marker">[{{ citationNumber2 }}]</sup>
                    <span
                      v-if="isMinervaSkin && (isSuggestion4Pending || isSuccessHighlightActive(4))"
                      class="minerva-highlight-rail"
                      :class="{ 'minerva-highlight-rail--success': isSuccessHighlightActive(4) }"
                    ></span>
                    <button
                      v-if="isMinervaSkin && isSuggestion4Pending"
                      type="button"
                      class="minerva-suggestion-trigger"
                      aria-label="Show suggestion"
                      @mousedown.prevent
                      @touchstart.stop.prevent="openMinervaSuggestion(4)"
                      @click.stop="openMinervaSuggestion(4)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    </button>
                    <span
                      v-else-if="isMinervaSkin && isSuccessHighlightActive(4)"
                      class="minerva-suggestion-trigger minerva-suggestion-trigger--success"
                      aria-hidden="true"
                    >
                      <cdx-icon :icon="cdxIconSuccess" size="medium" />
                    </span>
                  </p>
                  <!-- Citation Popup 2 -->
                  <div v-if="showCitationPopup2" class="citation-popup" contenteditable="false">
                    <!-- Pointer arrow -->
                    <div class="citation-popup-pointer"></div>
                    
                    <div class="citation-popup-header">
                      <button class="citation-popup-close" @click="showCitationPopup2 = false" aria-label="Close">
                        <cdx-icon :icon="cdxIconClose" size="medium" />
                      </button>
                      <h3 class="citation-popup-title">Add citation</h3>
                    </div>
                    <div class="citation-popup-tabs">
                      <button class="citation-tab citation-tab--active">Automatic</button>
                      <button class="citation-tab">Manual</button>
                      <button class="citation-tab">Re-use</button>
                    </div>
                    <div class="citation-popup-content">
                      <p class="citation-popup-description">Enter a link or reference code (ISBN, DOI or other) to create a citation</p>
                      <div class="citation-input-group">
                        <input 
                          v-model="citationUrl2" 
                          type="text" 
                          class="citation-input" 
                          placeholder="http://www.example.com"
                        />
                        <button 
                          class="citation-create-btn" 
                          :disabled="!isValidUrl2"
                          @click="createCitation2"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                                    <p>
                    Lorde's poetry became more open and personal as she grew older and became more confident in her sexuality. In Sister Outsider: Essays and Speeches, Lorde states, "Poetry is the way we help give name to the nameless so it can be thought... As they become known to and accepted by us, our feelings and the honest exploration of them become sanctuaries and spawning grounds for the most radical and daring ideas." Sister Outsider also elaborates Lorde's challenge to European-American traditions.
                  </p>
                </div>
                  <div class="edit-full-page-btn-wrapper">
                    <cdx-button
                      v-if="showEditFullPageButtons('poetry')"
                      class="edit-full-page-btn"
                      :class="{ 'edit-full-page-btn--improved': editFullPageImprovedEnabled && isMinervaSkin }"
                      action="default"
                      :weight="editFullPageImprovedEnabled && isMinervaSkin ? 'quiet' : 'normal'"
                      :size="editFullPageImprovedEnabled && isMinervaSkin ? 'small' : undefined"
                      @click="showFullPageEdit($event)"
                    ><span class="edit-full-page-btn-content">
                        <cdx-icon v-if="editFullPageImprovedEnabled && isMinervaSkin" :icon="cdxIconEdit" size="small" class="edit-full-page-start-icon" />
                        <span>Edit full page</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-separator">|</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-indicator">
                          <cdx-icon :icon="cdxIconLightbulb" size="small" class="edit-full-page-icon" />
                          <span class="edit-full-page-badge-dot"></span>
                        </span>
                      </span>
                    </cdx-button>
                  </div>
              </div>

                <!-- Prose Section -->
                <div v-if="shouldRenderSection('prose')" class="minerva-edit-section" data-section="prose">
                  <div class="edit-full-page-btn-wrapper">
                    <cdx-button
                      v-if="showEditFullPageButtons('prose')"
                      class="edit-full-page-btn"
                      :class="{ 'edit-full-page-btn--improved': editFullPageImprovedEnabled && isMinervaSkin }"
                      action="default"
                      :weight="editFullPageImprovedEnabled && isMinervaSkin ? 'quiet' : 'normal'"
                      :size="editFullPageImprovedEnabled && isMinervaSkin ? 'small' : undefined"
                      @click="showFullPageEdit($event)"
                    ><span class="edit-full-page-btn-content">
                        <cdx-icon v-if="editFullPageImprovedEnabled && isMinervaSkin" :icon="cdxIconEdit" size="small" class="edit-full-page-start-icon" />
                        <span>Edit full page</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-separator">|</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-indicator">
                          <cdx-icon :icon="cdxIconLightbulb" size="small" class="edit-full-page-icon" />
                          <span class="edit-full-page-badge-dot"></span>
                        </span>
                      </span>
                    </cdx-button>
                  </div>
                  <div class="section-heading-edit" ref="editSectionProse">
                    <h2 class="heading-text-edit">Prose</h2>
                    <div class="heading-divider"></div>
                  </div>
                  
                  <div contenteditable="true" @input="markArticleEdited" @keydown="handleToneCheckKeydown" @paste="handlePaste" class="article-text-editable">
                                    <p
                    v-if="showSuggestionsDisplay && (isSuggestion7Pending || isSuccessHighlightActive(7))"
                    ref="highlightedTextRef7"
                    :class="{
                      'highlighted-text-wrapper': showSuggestions,
                      [nonSelectedHighlightClass]: showSuggestions,
                      'highlighted-text-wrapper--hover': isSuggestion7Pending && isHovered7 && showSuggestions && !isCardExpanded7,
                      'highlighted-text-wrapper--selected': isSuggestion7Pending && isCardExpanded7 && showSuggestions,
                      'highlighted-text-wrapper--success': isSuccessHighlightActive(7),
                      'minerva-suggestion-target': isMinervaSkin && isSuggestion7Pending,
                      'suggestion-dismiss-right': dismissedSuggestionId === 7
                    }"
                    class="suggestion-target"
                    @mouseenter="isTextHovered7 = true"
                    @mouseleave="isTextHovered7 = false"
                    @click="isSuggestion7Pending ? (isMinervaSkin ? openMinervaSuggestion(7) : (isCardExpanded7 = true)) : null"
                  >
                    <span v-if="isSuggestion7Pending" class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      The Cancer Journals (<span class="highlighted-text-annotation"><a href="https://example.org/1980" target="_blank" rel="noopener">1980</a></span>) and A Burst of Light (1988) both use non-fiction prose, including essays and journal entries, to bear witness to, explore, and reflect on Lorde's diagnosis, treatment, recovery from breast cancer, and ultimately fatal recurrence with liver metastases. In both works, Lorde deals with Western notions of illness, disability, treatment, cancer and sexuality, and physical beauty and prosthesis, as well as themes of death, fear of mortality, survival, emotional healing, and inner power.
                    </span>
                    <span
                      v-if="isMinervaSkin && (isSuggestion7Pending || isSuccessHighlightActive(7))"
                      class="minerva-highlight-rail"
                      :class="{ 'minerva-highlight-rail--success': isSuccessHighlightActive(7) }"
                    ></span>
                    <button
                      v-if="isMinervaSkin && isSuggestion7Pending"
                      type="button"
                      class="minerva-suggestion-trigger"
                      aria-label="Show suggestion"
                      @mousedown.prevent
                      @touchstart.stop.prevent="openMinervaSuggestion(7)"
                      @click.stop="openMinervaSuggestion(7)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    </button>
                    <span
                      v-else-if="isMinervaSkin && isSuccessHighlightActive(7)"
                      class="minerva-suggestion-trigger minerva-suggestion-trigger--success"
                      aria-hidden="true"
                    >
                      <cdx-icon :icon="cdxIconSuccess" size="medium" />
                    </span>
                  </p>
                  <p v-else>
                    The Cancer Journals (<a href="https://example.org/1980" target="_blank" rel="noopener">1980</a>) and A Burst of Light (1988) both use non-fiction prose, including essays and journal entries, to bear witness to, explore, and reflect on Lorde's diagnosis, treatment, recovery from breast cancer, and ultimately fatal recurrence with liver metastases. In both works, Lorde deals with Western notions of illness, disability, treatment, cancer and sexuality, and physical beauty and prosthesis, as well as themes of death, fear of mortality, survival, emotional healing, and inner power.
                  </p>
                                    <p>
                    Lorde's deeply personal book Zami: A New Spelling of My Name (1982), subtitled a "biomythography", chronicles her childhood and adulthood. The narrative deals with the evolution of Lorde's sexuality and self-awareness.
                  </p>
                                    <h3 class="subsection-title">Sister Outsider</h3>
                                    <p>
                    In Sister Outsider: Essays and Speeches (1984), Lorde asserts the necessity of communicating the experience of marginalized groups to make their struggles visible in a repressive society. She emphasizes the need for different groups of people (particularly white women and African-American women) to find common ground in their experiences in life, but also to face difference directly, and use it as a source of strength rather than alienation. She repeatedly emphasizes the need for community in the struggle to build a better world. How to constructively channel the anger and rage incited by oppression is another prominent theme throughout her works, and in this collection in particular.
                  </p>
                                    <p>
                    Her most famous essay, "The Master's Tools Will Never Dismantle the Master's House", is included in Sister Outsider. Lorde questions the scope and ability for change to be instigated when examining problems through a racist, patriarchal lens. She insists that women see differences between other women not as something to be tolerated, but something that is necessary to generate power and to actively "be" in the world. This will create a community that embraces differences, which will ultimately lead to liberation. Lorde elucidates, "Divide and conquer, in our world, must become define and empower." Also, people must educate themselves about the oppression of others because expecting a marginalized group to educate the oppressors is the continuation of racist, patriarchal thought. She explains that this is a major tool utilized by oppressors to keep the oppressed occupied with the master's concerns. She concludes that to bring about real change, we cannot work within the racist, patriarchal framework because change brought about in that will not remain.
                  </p>
                                    <p>
                    Also in Sister Outsider is the essay, "The Transformation of Silence into Language and Action". Lorde discusses the importance of speaking, even when afraid, because otherwise silence immobilizes and chokes us. Many people fear to speak the truth because of the real risks of retaliation, but Lorde warns, "Your silence does not protect you." Lorde emphasizes that "the transformation of silence into language and action is a self-revelation, and that always seems fraught with danger." People are afraid of others' reactions for speaking, but mostly for demanding visibility, which is essential to live. Lorde adds, "We can sit in our corners mute forever while our sisters and ourselves are wasted, while our children are distorted and destroyed, while our earth is poisoned; we can sit in our safe corners mute as bottles, and we will still be no less afraid." "People are taught to respect their fear of speaking more than silence, but ultimately, the silence will choke us anyway, so we might as well speak the truth." Lorde writes that we can learn to speak even when we are afraid.
                  </p>
                                    <p>
                    In "Age, Race, Class, and Sex: Women Redefining Difference", Lorde emphasizes the importance of educating others. However, she stresses that in order to educate others, one must first be educated. Empowering people who are doing the work does not mean using privilege to overstep and overpower such groups; but rather, privilege must be used to hold door open for other allies. Lorde describes the inherent problems within society by saying, "racism, the belief in the inherent superiority of one race over all others and thereby the right to dominance. Sexism, the belief in the inherent superiority of one sex over the other and thereby the right to dominance. Ageism. Heterosexism. Elitism. Classism." Lorde finds herself among some of these "deviant" groups in society, which set the tone for the status quo and what "not to be" in society. Lorde argues that women feel pressure to conform to their "oneness" before recognizing the separation among them due to their "manyness", or aspects of their identity. She stresses that this behavior is exactly what "explains feminists' inability to forge the kind of alliances necessary to create a better world".
                  </p>
                                    <p>
                    In relation to non-intersectional feminism in the United States, Lorde famously said:
                  </p>
                                    <p>
                    Those of us who stand outside the circle of this society's definition of acceptable women; those of us who have been forged in the crucibles of difference -- those of us who are poor, who are lesbians, who are Black, who are older -- know that survival is not an academic skill. It is learning how to take our differences and make them strengths. For the master's tools will never dismantle the master's house. They may allow us temporarily to beat him at his own game, but they will never enable us to bring about genuine change. And this fact is only threatening to those women who still define the master's house as their only source of support.
                  </p>
                                    <p
                    v-if="showSuggestionsDisplay && (isSuggestion3Pending || isSuccessHighlightActive(3))"
                    ref="highlightedTextRef3"
                    :class="{ 
                      'highlighted-text-wrapper': showSuggestions,
                      [nonSelectedHighlightClass]: showSuggestions,
                      'highlighted-text-wrapper--hover': isSuggestion3Pending && isHovered3 && showSuggestions && !isCardExpanded3,
                      'highlighted-text-wrapper--selected': isSuggestion3Pending && isCardExpanded3 && showSuggestions,
                      'highlighted-text-wrapper--success': isSuccessHighlightActive(3),
                      'minerva-suggestion-target': isMinervaSkin && isSuggestion3Pending,
                      'suggestion-dismiss-right': dismissedSuggestionId === 3
                    }"
                    class="suggestion-target"
                    @mouseenter="isTextHovered3 = true"
                    @mouseleave="isTextHovered3 = false"
                    @click="isSuggestion3Pending ? (isMinervaSkin ? openMinervaSuggestion(3) : (isCardExpanded3 = true)) : null"
                  >
                    <span v-if="isSuggestion3Pending" class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      <span class="highlighted-text-annotation">
                      — Audre Lorde, The Master's Tools Will Never Dismantle the Master's House, Sister Outsider: Essays and Speeches (1984)<sup v-if="showCitationPopup3 || citationNumber3" class="citation-marker">[{{ citationNumber3 || '...' }}]</sup>
                      </span>
                    </span>
                    <span
                      v-if="isMinervaSkin && (isSuggestion3Pending || isSuccessHighlightActive(3))"
                      class="minerva-highlight-rail"
                      :class="{ 'minerva-highlight-rail--success': isSuccessHighlightActive(3) }"
                    ></span>
                    <button
                      v-if="isMinervaSkin && isSuggestion3Pending"
                      type="button"
                      class="minerva-suggestion-trigger"
                      :class="{ 'minerva-suggestion-trigger--bounce': firstSuggestionBounceActiveId === 3 }"
                      aria-label="Show suggestion"
                      @mousedown.prevent
                      @touchstart.stop.prevent="openMinervaSuggestion(3)"
                      @click.stop="openMinervaSuggestion(3)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    </button>
                    <span
                      v-else-if="isMinervaSkin && isSuccessHighlightActive(3)"
                      class="minerva-suggestion-trigger minerva-suggestion-trigger--success"
                      aria-hidden="true"
                    >
                      <cdx-icon :icon="cdxIconSuccess" size="medium" />
                    </span>
                  </p>
                  <p v-else>
                    — Audre Lorde, The Master's Tools Will Never Dismantle the Master's House, Sister Outsider: Essays and Speeches (1984)
                    <sup v-if="citationNumber3" class="citation-marker">[{{ citationNumber3 }}]</sup>
                  </p>
                  <!-- Citation Popup 3 -->
                  <div v-if="showCitationPopup3" class="citation-popup" contenteditable="false">
                    <!-- Pointer arrow -->
                    <div class="citation-popup-pointer"></div>
                    
                    <div class="citation-popup-header">
                      <button class="citation-popup-close" @click="showCitationPopup3 = false" aria-label="Close">
                        <cdx-icon :icon="cdxIconClose" size="medium" />
                      </button>
                      <h3 class="citation-popup-title">Add citation</h3>
                    </div>
                    <div class="citation-popup-tabs">
                      <button class="citation-tab citation-tab--active">Automatic</button>
                      <button class="citation-tab">Manual</button>
                      <button class="citation-tab">Re-use</button>
                    </div>
                    <div class="citation-popup-content">
                      <p class="citation-popup-description">Enter a link or reference code (ISBN, DOI or other) to create a citation</p>
                      <div class="citation-input-group">
                        <input 
                          v-model="citationUrl3" 
                          type="text" 
                          class="citation-input" 
                          placeholder="http://www.example.com"
                        />
                        <button 
                          class="citation-create-btn" 
                          :disabled="!isValidUrl3"
                          @click="createCitation3"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                  <div class="edit-full-page-btn-wrapper">
                    <cdx-button
                      v-if="showEditFullPageButtons('prose')"
                      class="edit-full-page-btn"
                      :class="{ 'edit-full-page-btn--improved': editFullPageImprovedEnabled && isMinervaSkin }"
                      action="default"
                      :weight="editFullPageImprovedEnabled && isMinervaSkin ? 'quiet' : 'normal'"
                      :size="editFullPageImprovedEnabled && isMinervaSkin ? 'small' : undefined"
                      @click="showFullPageEdit($event)"
                    ><span class="edit-full-page-btn-content">
                        <cdx-icon v-if="editFullPageImprovedEnabled && isMinervaSkin" :icon="cdxIconEdit" size="small" class="edit-full-page-start-icon" />
                        <span>Edit full page</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-separator">|</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-indicator">
                          <cdx-icon :icon="cdxIconLightbulb" size="small" class="edit-full-page-icon" />
                          <span class="edit-full-page-badge-dot"></span>
                        </span>
                      </span>
                    </cdx-button>
                  </div>
              </div>

                <!-- Film Section -->
                <div v-if="shouldRenderSection('film')" class="minerva-edit-section" data-section="film">
                  <div class="edit-full-page-btn-wrapper">
                    <cdx-button
                      v-if="showEditFullPageButtons('film')"
                      class="edit-full-page-btn"
                      :class="{ 'edit-full-page-btn--improved': editFullPageImprovedEnabled && isMinervaSkin }"
                      action="default"
                      :weight="editFullPageImprovedEnabled && isMinervaSkin ? 'quiet' : 'normal'"
                      :size="editFullPageImprovedEnabled && isMinervaSkin ? 'small' : undefined"
                      @click="showFullPageEdit($event)"
                    ><span class="edit-full-page-btn-content">
                        <cdx-icon v-if="editFullPageImprovedEnabled && isMinervaSkin" :icon="cdxIconEdit" size="small" class="edit-full-page-start-icon" />
                        <span>Edit full page</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-separator">|</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-indicator">
                          <cdx-icon :icon="cdxIconLightbulb" size="small" class="edit-full-page-icon" />
                          <span class="edit-full-page-badge-dot"></span>
                        </span>
                      </span>
                    </cdx-button>
                  </div>
                  <div class="section-heading-edit" ref="editSectionFilm">
                    <h2 class="heading-text-edit">Film</h2>
                    <div class="heading-divider"></div>
                  </div>

                  <div contenteditable="true" @input="markArticleEdited" @keydown="handleToneCheckKeydown" @paste="handlePaste" class="article-text-editable">
                    <p>
                      Lorde had several films that highlighted her journey as an <a href="https://en.wikipedia.org/wiki/Activism" target="_blank" rel="noopener">activist</a> in the 1980s and 1990s.<sup class="citation-marker">[50]</sup>
                    </p>
                    <h3 class="subsection-title">The Berlin years</h3>
                    <p>
                      <em>The Berlin Years: 1984–1992</em> documented Lorde's time in Germany as she led <a href="https://en.wikipedia.org/wiki/Afro-Germans" target="_blank" rel="noopener">Afro-Germans</a> in a movement that would allow black people to establish identities for themselves outside of stereotypes and discrimination. After a long history of systemic racism in Germany, Lorde introduced a new sense of empowerment for minorities. As seen in the film, she walks through the streets with pride despite stares and words of discouragement. Including moments like these in a documentary was important for people to see during that time. It inspired them to take charge of their identities and discover who they are outside of the labels put on them by society. The film also educates people on the history of racism in Germany. This enables viewers to understand how Germany reached this point in history and how the society developed. Through her promotion of the study of history and her example of taking her experiences in her stride, she influenced people of many different backgrounds.<sup class="citation-marker">[51]</sup>
                    </p>
                    <p>
                      The film documents Lorde's efforts to empower and encourage women to start the Afro-German movement. What began as a few friends meeting in a friend's home to get to know other black people, turned into what is now known as the Afro-German movement. Lorde inspired black women to refute the designation of "<a href="https://en.wikipedia.org/wiki/Mulatto" target="_blank" rel="noopener">Mulatto</a>", a label which was imposed on them, and switch to the newly coined, self-given "<a href="https://en.wikipedia.org/wiki/Afro-Germans" target="_blank" rel="noopener">Afro-German</a>", a term that conveyed a sense of pride. Lorde inspired Afro-German women to create a community of like-minded people. Some Afro-German women, such as <a href="https://en.wikipedia.org/wiki/Ika_H%C3%BCgel-Marshall" target="_blank" rel="noopener">Ika Hügel-Marshall</a>, had never met another black person and the meetings offered opportunities to express thoughts and feelings.<sup class="citation-marker">[52]</sup>
                    </p>
                    <p>
                      <em>Body of a Poet: 1995</em> was written as a tribute biopic written to honor Lorde. The film centers on the efforts of a young group of lesbians of color. The film celebrates the life and work of Audre Lorde from her birth to her death.<sup class="citation-marker">[53]</sup>
                    </p>
                  </div>
                </div>

                <div v-if="shouldRenderSection('theory')" class="minerva-edit-section" data-section="theory">
                  <div class="edit-full-page-btn-wrapper">
                    <cdx-button
                      v-if="showEditFullPageButtons('theory')"
                      class="edit-full-page-btn"
                      :class="{ 'edit-full-page-btn--improved': editFullPageImprovedEnabled && isMinervaSkin }"
                      action="default"
                      :weight="editFullPageImprovedEnabled && isMinervaSkin ? 'quiet' : 'normal'"
                      :size="editFullPageImprovedEnabled && isMinervaSkin ? 'small' : undefined"
                      @click="showFullPageEdit($event)"
                    ><span class="edit-full-page-btn-content">
                        <cdx-icon v-if="editFullPageImprovedEnabled && isMinervaSkin" :icon="cdxIconEdit" size="small" class="edit-full-page-start-icon" />
                        <span>Edit full page</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-separator">|</span>
                        <span v-if="showSuggestions && otherSuggestionCount > 0 && !editFullPageImprovedEnabled" class="edit-full-page-indicator">
                          <cdx-icon :icon="cdxIconLightbulb" size="small" class="edit-full-page-icon" />
                          <span class="edit-full-page-badge-dot"></span>
                        </span>
                      </span>
                    </cdx-button>
                  </div>
                  <div class="section-heading-edit" ref="editSectionTheory">
                    <h2 class="heading-text-edit">Theory</h2>
                    <div class="heading-divider"></div>
                  </div>

                  <div contenteditable="true" @input="markArticleEdited" @keydown="handleToneCheckKeydown" @paste="handlePaste" class="article-text-editable">
                    <p>
                      Her writings are based on the "theory of difference", the idea that the binary opposition between men and women is overly simplistic; although feminists have found it necessary to present the illusion of a solid, unified whole, the category of women itself is full of subdivisions.<sup class="citation-marker">[61]</sup>
                    </p>
                    <p>
                      Lorde identified issues of race, class, age and ageism, sex and sexuality and, later in her life, chronic illness and disability; the latter becoming more prominent in her later years as she lived with cancer. She wrote of all of these factors as fundamental to her experience of being a woman. She argued that, although differences in gender have received all the focus, it is essential that these other differences are also recognized and addressed. "Lorde," writes <a href="https://de.wikipedia.org/wiki/Carmen_Birkle" target="_blank" rel="noopener">Carmen Birkle</a>, "puts her emphasis on the authenticity of experience. She wants her difference acknowledged but not judged; she does not want to be subsumed into the one general category of 'woman.'"<sup class="citation-marker">[62]</sup> This theory is today known as <a href="https://en.wikipedia.org/wiki/Intersectionality" target="_blank" rel="noopener">intersectionality</a>.<sup class="citation-marker">[63]</sup>
                    </p>
                    <p>
                      While acknowledging that the differences between women are wide and varied, most of Lorde's works are concerned with two subsets that concerned her primarily – race and sexuality. In <a href="https://en.wikipedia.org/wiki/A_Litany_for_Survival:_The_Life_and_Work_of_Audre_Lorde" target="_blank" rel="noopener">Ada Gay Griffin and Michelle Parkerson's documentary <em>A Litany for Survival: The Life and Work of Audre Lorde</em></a>, Lorde says, "Let me tell you first about what it was like being a Black woman poet in the '60s, from jump. It meant being invisible. It meant being really invisible. It meant being doubly invisible as a Black feminist woman and it meant being triply invisible as a Black lesbian and feminist".<sup class="citation-marker">[64]</sup>
                    </p>
                    <p>
                      <em>Front cover art for the 1984 publication of the book <a href="https://en.wikipedia.org/wiki/Sister_Outsider" target="_blank" rel="noopener">Sister Outsider</a> by Audre Lorde.</em>
                    </p>
                    <p>
                      In her essay "The Erotic as Power", written in 1978 and collected in <a href="https://en.wikipedia.org/wiki/Sister_Outsider" target="_blank" rel="noopener">Sister Outsider</a>, Lorde theorizes the Erotic as a site of power for women only when they learn to release it from its suppression and embrace it, without the sexualized meaning it often holds in mainstream society. She proposes that the Erotic needs to be explored and experienced wholeheartedly, because it exists not only in reference to sexuality and the sexual, but also as a feeling of enjoyment, love, and thrill that is felt towards any task or experience that satisfies women in their lives, be it reading a book or loving one's job.<sup class="citation-marker">[65]</sup> She dismisses "the false belief that only by the suppression of the erotic within our lives and consciousness can women be truly strong. But that strength is illusory, for it is fashioned within the context of male models of power".<sup class="citation-marker">[66]</sup> She explains how patriarchal society has misnamed it and used it against women, causing women to fear it. Women also fear it because the erotic is powerful and a deep feeling. Women must share each other's power rather than use it without consent, which is abuse. They should do it as a method to connect everyone in their differences and similarities. Utilizing the erotic as power allows women to use their knowledge and power to face the issues of racism, patriarchy, and our anti-erotic society.<sup class="citation-marker">[65]</sup> She claims that the erotic can be used as a source of power for women to live with passion in all areas of their life. With the erotic guiding life, Lorde encourages women to use the erotic as a compass to identify what holds value in women's lives. Furthermore, Lorde criticizes the idea of <a href="https://en.wikipedia.org/wiki/Compulsory_heterosexuality" target="_blank" rel="noopener">compulsory heterosexuality</a> and the idea that women's happiness will come through marriage, god, or religion. The idea of the erotic will empower women to not settle for what is conventionally expected or safe leaning into the idea of resisting patriarchal values put in place over women and their sexuality. Lorde sees the suppression of the erotic or conformity to heterosexual norms as a form of control over women. In order to assume control over oneself, she urges women to reclaim the erotic and assert control. She erases the erotic differences that lie between varying sexualities in order to promote these desires as a creative force for revolutionary change.<sup class="citation-marker">[65]</sup> While rejecting compulsory heterosexuality, this is a prevalent motif in Uses of the Erotic, and it still carries some heteronormative undertones. The erotic Lorde proposes both promotes this ideal, as "the aim of each thing which we do is to make our lives and the lives of our children richer and more possible. Within the celebration of the erotic in all our endeavours, my work becomes a conscious decision - a longed-for bed which I enter gratefully and from which I rise up empowered," explaining how wielding the erotic as preserving the future for women and children alike.<sup class="citation-marker">[67]</sup> Another feminist philosopher, <a href="https://en.wikipedia.org/wiki/Lee_Edelman" target="_blank" rel="noopener">Lee Edelman</a>, discusses the culture of heteronormativity as a structure upheld through reproduction and the perception of children as the future which relates to this quote as lending to heteronormative culture, despite her rejection of it. Lorde also lends to this reproductive theory by her establishing the root of the erotic as a, "deeply female and spiritual plane, firmly rooted in the power of our unexpressed or unrecognized feeling," imbuing to women that it is inherent to their womanhood. This supports a binary reality by asserting an essentialist view of gender and sex. Essentialism is debated among third-wave feminists and illustrated how intersectionality in third-wave feminism is approached differently than that of fourth-wave feminism.
                    </p>
                    <h3 class="subsection-title theory-subheading">Feminist thought</h3>
                    <p>
                      Lorde set out to confront issues of racism in feminist thought. She maintained that a great deal of the scholarship of White feminists served to augment the oppression of black women, a conviction that led to angry confrontation, most notably in a blunt open letter addressed to the fellow radical lesbian feminist <a href="https://en.wikipedia.org/wiki/Mary_Daly" target="_blank" rel="noopener">Mary Daly</a>, to which Lorde claimed she received no reply.<sup class="citation-marker">[68]</sup> Daly's reply letter to Lorde,<sup class="citation-marker">[69]</sup> dated four months later, was found in 2003 in Lorde's files after she died.<sup class="citation-marker">[70]</sup>
                    </p>
                    <p>
                      This fervent disagreement with notable White feminists furthered Lorde's persona as an outsider: "In the institutional milieu of black feminist and black lesbian feminist scholars ... and within the context of conferences sponsored by White feminist academics, Lorde stood out as an angry, accusatory, isolated black feminist lesbian voice".<sup class="citation-marker">[71]</sup>
                    </p>
                    <p>
                      The criticism was not one-sided: many White feminists were angered by Lorde's brand of feminism. In her 1984 essay "The Master's Tools Will Never Dismantle the Master's House",<sup class="citation-marker">[72]</sup> Lorde attacked what she believed was underlying racism within feminism, describing it as unrecognized dependence on the patriarchy. She argued that, by denying difference in the category of women, White feminists merely furthered old systems of oppression and that, in so doing, they were preventing any real, lasting change. Her argument aligned White feminists who did not recognize race as a feminist issue with White male slave-masters, describing both as "agents of oppression".<sup class="citation-marker">[73]</sup>
                    </p>
                    <h3 class="subsection-title theory-subheading">Lorde's comments on feminism</h3>
                    <p>
                      Lorde held that the key tenets of feminism were that all forms of oppression were interrelated; creating change required taking a public stand; differences should not be used to divide; revolution is a process; feelings are a form of self-knowledge that can inform and enrich activism; and acknowledging and experiencing pain helps women to transcend it.<sup class="citation-marker">[74]</sup>
                    </p>
                    <p>
                      In Lorde's "Age, Race, Class, and Sex: Women Redefining Difference", she writes: "Certainly there are very real differences between us of race, age, and sex. But it is not those differences between us that are separating us. It is rather our refusal to recognize those differences, and to examine the distortions which result from our misnaming them and their effects upon human behavior and expectation." More specifically she states: "As White women ignore their built-in privilege of Whiteness and define woman in terms of their own experience alone, then women of color become 'other'."<sup class="citation-marker">[75]</sup> Self-identified as "a forty-nine-year-old Black lesbian feminist socialist mother of two,<sup class="citation-marker">[75]</sup> Lorde is considered as "other, deviant, inferior, or just plain wrong"<sup class="citation-marker">[75]</sup> in the eyes of the normative "White male heterosexual capitalist" social hierarchy. "We speak not of human difference, but of human deviance,"<sup class="citation-marker">[75]</sup> she writes. In this respect, her ideology coincides with <span
                        v-if="isSuggestion5Pending || isSuccessHighlightActive(5)"
                        ref="highlightedTextRef5"
                        class="suggestion-target suggestion-target--inline"
                        :class="{
                          [nonSelectedHighlightClass]: showSuggestions,
                          'highlighted-text-wrapper--hover': isSuggestion5Pending && isHovered5 && showSuggestions && !isCardExpanded5,
                          'highlighted-text-wrapper--selected': isSuggestion5Pending && isCardExpanded5 && showSuggestions,
                          'highlighted-text-wrapper--success': isSuccessHighlightActive(5),
                          'suggestion-dismiss-right': dismissedSuggestionId === 5
                        }"
                        @mouseenter.stop="isTextHovered5 = true"
                        @mouseleave.stop="isTextHovered5 = false"
                        @click.stop="isSuggestion5Pending ? (isMinervaSkin ? openMinervaSuggestion(5) : (isCardExpanded5 = true)) : null"
                      ><span class="highlighted-text-content"><span class="highlighted-text-annotation"><a href="https://en.wikipedia.org/wiki/Womanism" target="_blank" rel="noopener">womanism</a></span></span></span><template v-else><a href="https://en.wikipedia.org/wiki/Womanism" target="_blank" rel="noopener">womanism</a></template>, which "allows Black women to affirm and celebrate their color and culture in a way that feminism does not."
                    </p>
                    <p>
                      Lorde defines racism, sexism, ageism, heterosexism, elitism and classism altogether and explains that an "ism" is an idea that what is being privileged is superior and has the right to govern anything else.<sup class="citation-marker">[76]</sup> Lorde argues that a mythical norm is what all bodies should be. According to Lorde, the mythical norm of US culture is White, thin, male, young, heterosexual, Christian, financially secure.<sup class="citation-marker">[75]</sup>
                    </p>
                    <h3 class="subsection-title theory-subheading">Influences on black feminism</h3>
                    <p>
                      Lorde's work on black feminism continues to be examined by scholars today. Jennifer C. Nash examines how black feminists acknowledge their identities and find love for themselves through those differences.<sup class="citation-marker">[77]</sup> Nash cites Lorde, who writes: "I urge each one of us here to reach down into that deep place of knowledge inside herself and touch that terror and loathing of any difference that lives there. See whose face it wears. Then the personal as the political can begin to illuminate all our choices."<sup class="citation-marker">[77]</sup> Nash explains that Lorde is urging black feminists to embrace politics rather than fear it, which will lead to an improvement in society for them. Lorde adds, "Black women sharing close ties with each other, politically or emotionally, are not the enemies of Black men. Too frequently, however, some Black men attempt to rule by fear those Black women who are more ally than enemy."<sup class="citation-marker">[78]</sup>
                    </p>
                    <p>
                      Lorde's 1979 essay "Sexism: An American Disease in Blackface" is a sort of rallying cry to confront sexism in the black community in order to eradicate the violence within it.<sup class="citation-marker">[6]</sup> Lorde insists that the fight between black women and men must end to end racist politics.
                    </p>
                    <p>
                      In 1981, Lorde and a fellow writer friend, Barbara Smith founded <a href="https://en.wikipedia.org/wiki/Kitchen_Table:_Women_of_Color_Press" target="_blank" rel="noopener">Kitchen Table: Women of Color Press</a> which was dedicated to helping other black feminist writers by provided resources, guidance and encouragement. Lorde encouraged those around her to celebrate their differences such as race, sexuality or class instead of dwelling upon them, and wanted everyone to have similar opportunities.<sup class="citation-marker">[79]</sup>
                    </p>
                    <h3 class="subsection-title theory-subheading">Personal identity</h3>
                    <p>
                      Throughout Lorde's career she included the idea of a collective identity in many of her poems and books. She did not just identify with one category but she wanted to celebrate all parts of herself equally.<sup class="citation-marker">[80]</sup>
                    </p>
                    <p>
                      She was known to describe herself as black, lesbian, political activist, feminist, poet, mother, etc. In her novel <em>Zami: A New Spelling of My Name</em>, Lorde focuses on how her many different identities shape her life and the different experiences she has because of them. She shows us that personal identity is found within the connections between seemingly different parts of one's life, based on experiences, and that one's authority to speak comes from these experiences. Personal identity is often associated with the visual aspect of a person, but as Lies Xhonneux theorizes when identity is singled down to just what you see, some people, even within minority groups, can become invisible.<sup class="citation-marker">[81]</sup>
                    </p>
                    <p>
                      Lorde's work also focused on the importance of acknowledging, respecting and celebrating our differences as well as our commonalities in defining identity. In <em>The Master's Tools</em>, she wrote that many people choose to pretend the differences between us do not exist, or that these differences are insurmountable, adding, "Difference must be not merely tolerated, but seen as a fund of necessary polarities between which our creativity can spark like a dialectic."<sup class="citation-marker">[82]</sup>
                    </p>
                    <p>
                      Lorde urged her readers to delve into and discover these differences, discussing how ignoring differences can lead to ignoring any bias and prejudice that might come with these differences, while acknowledging them can enrich our visions and our joint struggles. She wrote that we need to constructively deal with the differences between people and recognize that unity does not equal identicality. In <em>I Am Your Sister</em>, she urged activists to take responsibility for learning this, even if it meant self-teaching, "...which might be better used in redefining ourselves and devising realistic scenarios for altering the present and constructing the future".<sup class="citation-marker">[83]</sup>
                    </p>
                    <p>
                      In <em>The Cancer Journals</em> she wrote "If I didn't define myself for myself, I would be crunched into other people's fantasies for me and eaten alive." She stressed the idea of personal identity being more than just what people see or think of a person, but something that must be defined by the individual, based on the person's experiences. "The House of Difference" is a phrase that originates in Lorde's identity theories. Her idea was that everyone is different from each other and it is these collective differences that make us who we are, instead of one small aspect in isolation. Focusing on all of the aspects of one's identity brings people together more than choosing one small piece to identify with.<sup class="citation-marker">[84]</sup>
                    </p>
                    <p>
                      Lorde's works <em>Coal</em> and <em>The Black Unicorn</em> are two examples of poetry that encapsulates her black, feminist identity.<sup class="citation-marker">[85]</sup><sup class="citation-marker">[86]</sup> Each poem focuses on the idea of identity, and how identity itself is not straightforward. Many literary critics assumed that "Coal" was Lorde's way of shaping race in terms of coal and diamonds. Lorde herself stated that those interpretations were incorrect because identity was not so simply defined and her poems were not to be oversimplified.
                    </p>
                    <p>
                      While highlighting Lorde's intersectional points through a lens that focuses on race, gender, socioeconomic status/class and so on, we must also embrace one of her salient identities; Lorde was not afraid to assert her differences, such as skin color and sexual orientation, but used her own identity against toxic black male masculinity. Lorde used those identities within her work and used her own life to teach others the importance of being different. She was not ashamed to claim her identity and used it to her own creative advantages.
                    </p>
                    <p>
                      While highlighting Lorde's intersectional points through a lens that focuses on race, gender, socioeconomic status/class and so on, we must also embrace one of her salient identities, lesbianism. She was a lesbian and navigated spaces interlocking her womanhood, gayness and blackness in ways that trumped White feminism, predominantly White gay spaces and black male masculinity. Lorde used those identities within her work and ultimately it guided her to create pieces that embodied lesbianism in a light that educated people of many social classes and identities on the issues black lesbian women face in society.
                    </p>
                    <h3 class="subsection-title theory-subheading">Contributions to the third-wave feminist discourse</h3>
                    <p>
                      Around the 1960s, <a href="https://en.wikipedia.org/wiki/Second-wave_feminism" target="_blank" rel="noopener">second-wave feminism</a> became centered around discussions and debates about capitalism as a "biased, discriminatory, and unfair"<sup class="citation-marker">[87]</sup> institution, especially within the context of the rise of <a href="https://en.wikipedia.org/wiki/Globalization" target="_blank" rel="noopener">globalization</a>.
                    </p>
                    <p>
                      <a href="https://en.wikipedia.org/wiki/Third-wave_feminism" target="_blank" rel="noopener">Third-wave feminism</a> emerged in the 1990s after calls for "a more differentiated feminism" by first-world women of color and women in developing nations, such as Audre Lorde, who maintained her critiques of first-world feminism for tending to veer toward "third-world homogenization". This term was coined by radical dependency theorist, <a href="https://en.wikipedia.org/wiki/Andre_Gunder_Frank" target="_blank" rel="noopener">Andre Gunder Frank</a>, to describe the inconsideration of the unique histories of developing countries (in the process of forming development agendas).<sup class="citation-marker">[87]</sup> Audre Lorde was critical of the first-world feminist movement "for downplaying sexual, racial, and class differences" and the unique power structures and cultural factors which vary by region, nation, community, etc.<sup class="citation-marker">[88]</sup>
                    </p>
                    <p>
                      Other feminist scholars of this period, like <a href="https://en.wikipedia.org/wiki/Chandra_Talpade_Mohanty" target="_blank" rel="noopener">Chandra Talpade Mohanty</a>, echoed Lorde's sentiments. Collectively they called for a "feminist politics of location, which theorized that women were subject to particular assemblies of oppression, and therefore that all women emerged with particular rather than generic identities".<sup class="citation-marker">[88]</sup> While they encouraged a global community of women, Audre Lorde, in particular, felt the cultural homogenization of third-world women could only lead to a disguised form of oppression with its own forms of "othering" women in developing nations into figures of deviance and non-actors in theories of their own development.
                    </p>
                    <h4 class="subsection-title theory-subheading theory-subheading--level4">Essay</h4>
                    <p>
                      Originally published in <a href="https://en.wikipedia.org/wiki/Sister_Outsider" target="_blank" rel="noopener">Sister Outsider</a>, a collection of essays and speeches, Audre Lorde cautioned against the "institutionalized rejection of difference" in her essay, "Age, Race, Class, and Sex: Women Redefining Difference", fearing that when "we do not develop tools for using human difference as a springboard for creative change within our lives[,] we speak not of human difference, but of human deviance".<sup class="citation-marker">[50]</sup> Lorde saw this already happening with the lack of inclusion of literature from women of color in the second-wave feminist discourse. Poetry, considered lesser than prose and more common among lower class and working people, was rejected from women's magazine collectives which Lorde claims have robbed "women of each other's energy and creative insight". She found that "the literature of women of Color [was] seldom included in women's literature courses and almost never in other literature courses, nor in women's studies as a whole"<sup class="citation-marker">[50]</sup> and pointed to the "othering" of women of color and women in developing nations as the reason. By homogenizing these communities and ignoring their difference, "women of Color become 'other,' the outside whose experiences and tradition is too 'alien' to comprehend",<sup class="citation-marker">[50]</sup> and thus, seemingly unworthy of scholarly attention and differentiated scholarship. Lorde expands on this idea of rejecting the other saying that it is a product of our capitalistic society. Psychologically, people have been trained to react to discontentment by ignoring it. When ignoring a problem does not work, they are forced to either conform or destroy. She contends that people have reacted in this matter to differences in sex, race, and gender: ignore, conform, or destroy. Instead, she states that differences should be approached with curiosity or understanding. Lorde denounces the concept of having to choose a superior and an inferior when comparing two things. In the case of people, expression, and identity, she claims that there should be a third option of equality. However, Lorde emphasizes in her essay that differences should not be squashed or unacknowledged. There is no denying the difference in experience of black women and White women, as shown through example in Lorde's essay, but Lorde fights against the premise that difference is bad.
                    </p>
                    <p>
                      Audre Lorde called for the embracing of these differences. In the same essay, she proclaimed, "now we must recognize difference among women who are our equals, neither inferior nor superior, and devise ways to use each other's difference to enrich our visions and our joint struggles"<sup class="citation-marker">[50]</sup> Doing so would lead to more inclusive and thus, more effective global feminist goals. Lorde writes that women must "develop new definitions of power and new patterns of relating across difference. The old definitions have not served us". By unification, Lorde writes that women can reverse the oppression that they face and create better communities for themselves and loved ones. Lorde theorized that true development in third-world communities would and even "the future of our earth may depend upon the ability of all women to identify and develop new definitions of power and new patterns of relating across differences."<sup class="citation-marker">[50]</sup> In other words, the individual voices and concerns of women and color and women in developing nations would be the first step in attaining the autonomy with the potential to develop and transform their communities effectively in the age (and future) of globalization.
                    </p>
                    <h4 class="subsection-title theory-subheading theory-subheading--level4">Speeches</h4>
                    <p>
                      In a keynote speech at the National Third-World Gay and Lesbian Conference on October 13, 1979, titled, "When will the ignorance end?" Lorde reminded and cautioned the attendees, "There is a wonderful diversity of groups within this conference, and a wonderful diversity between us within those groups. That diversity can be a generative force, a source of energy fueling our visions of action for the future. We must not let diversity be used to tear us apart from each other, nor from our communities that is the mistake they made about us. I do not want us to make it ourselves... and we must never forget those lessons: that we cannot separate our oppressions, nor yet are they the same".<sup class="citation-marker">[89]</sup> In other words, while common experiences in racism, sexism, and homophobia had brought the group together and that commonality could not be ignored, there must still be a recognition of their individualized humanity.
                    </p>
                    <p>
                      Years later, on August 27, 1983, Audre Lorde delivered an address as part of the "Litany of Commitment" at the <a href="https://en.wikipedia.org/wiki/March_on_Washington_for_Jobs_and_Freedom" target="_blank" rel="noopener">March on Washington for Jobs and Freedom</a>. "Today we march," she said, "lesbians and gay men and our children, standing in our own names together with all our struggling sisters and brothers here and around the world, in the Middle East, in Central America, in the Caribbean and South Africa, sharing our commitment to work for a joint livable future. We know we do not have to become copies of each other to be able to work together. We know that when we join hands across the table of our difference, our diversity gives us great power. When we can arm ourselves with the strength and vision from all of our diverse communities, then we will in truth all be free at last."<sup class="citation-marker">[89]</sup>
                    </p>
                    <h4 class="subsection-title theory-subheading theory-subheading--level4">Interview</h4>
                    <p>
                      Afro-German feminist scholar and author <a href="https://en.wikipedia.org/wiki/Marion_Kraft" target="_blank" rel="noopener">Dr. Marion Kraft</a> interviewed Audre Lorde in 1986 to discuss a number of her literary works and poems. In this interview, Audre Lorde articulated hope for the next wave of feminist scholarship and discourse. When asked by Kraft, "Do you see any development of the awareness about the importance of differences within the White feminist movement?" Lorde replied with both critiques and hope:<sup class="citation-marker">[90]</sup>
                    </p>
                    <p>
                      Well, the feminist movement, the White feminist movement, has been notoriously slow to recognize that racism is a feminist concern, not one that is altruistic, but one that is part and parcel of feminist consciousness... I think, in fact, though, that things are slowly changing and that there are White women now who recognize that in the interest of genuine coalition, they must see that we are not the same. Black feminism is not White feminism in Blackface. It is an intricate movement coming out of the lives, aspirations, and realities of Black women. We share some things with White women, and there are other things we do not share. We must be able to come together around those things we share.
                    </p>
                    <p>
                      Miriam Kraft summarized Lorde's position when reflecting on the interview; "Yes, we have different historical, social, and cultural backgrounds, different sexual orientations; different aspirations and visions; different skin colors and ages. But we share common experiences and a common goal. Our experiences are rooted in the oppressive forces of racism in various societies, and our goal is our mutual concern to work toward 'a future which has not yet been' in Audre's words."<sup class="citation-marker">[90]</sup>
                    </p>
                  </div>
                </div>

            </div>
          </div>
        </div>
        </article>

        <!-- Suggestions Sidebar (Right) - Only visible in Edit mode with suggestions -->
        <aside 
          v-if="isEditMode && !isMinervaSkin && (showSuggestionsDisplay || isArrowOnceMode)" 
          class="suggestions-sidebar"
          :class="{ 'suggestions-sidebar--arrow-mode': activePrototype === 'option-3' }"
          :style="{ marginTop: `${suggestionsTopOffset}px` }"
        >
          <div
            v-if="showDesktopFeedbackControls"
            ref="vectorSuggestionsControlsRef"
            class="vector-suggestions-controls"
            :class="{ 'vector-suggestions-controls--hidden': desktopSuggestionsControlsHidden }"
          >
            <div
              v-if="activePrototype === 'option-3' && (showDesktopFilterButton || (showSuggestions && !anySuggestionVisible && toggleBadgeCount > 0))"
              class="vector-suggestions-arrow-controls"
            >
              <div
                class="suggestions-banner-arrow-buttons"
                :class="{ 'suggestions-banner-arrow-buttons--with-filter': showDesktopFilterButton }"
              >
                <cdx-button
                  v-if="showDesktopFilterButton"
                  class="suggestions-filter-btn vector-suggestions-filter-btn"
                  action="default"
                  weight="quiet"
                  size="large"
                  aria-label="Filter suggestions"
                  @click="handleFilterSuggestionsClick"
                >
                  <cdx-icon :icon="cdxIconConfigure" size="medium" />
                </cdx-button>
                <cdx-button
                  class="suggestions-banner-arrow-btn"
                  action="default"
                  weight="quiet"
                  size="small"
                  :disabled="!showBannerArrowUp"
                  aria-label="View previous suggestions"
                  @click="scrollToSuggestionByDirection('up')"
                  @keydown="handleBannerKeydown($event)"
                >
                  <cdx-icon :icon="cdxIconCollapse" size="medium" />
                </cdx-button>
                <cdx-button
                  class="suggestions-banner-arrow-btn"
                  action="default"
                  weight="quiet"
                  size="small"
                  :disabled="!showBannerArrowDown"
                  aria-label="View next suggestions"
                  @click="scrollToSuggestionByDirection('down')"
                  @keydown="handleBannerKeydown($event)"
                >
                  <cdx-icon :icon="cdxIconExpand" size="medium" />
                </cdx-button>
              </div>
            </div>
            <cdx-button
              v-else-if="showDesktopFilterButton"
              class="suggestions-filter-btn"
              action="default"
              weight="quiet"
              size="large"
              aria-label="Filter suggestions"
              @click="handleFilterSuggestionsClick"
            >
              <cdx-icon :icon="cdxIconConfigure" size="medium" />
            </cdx-button>
          </div>
          <div
            v-if="showDesktopPaginationControls"
            class="vector-pagination-controls"
          >
            <div class="vector-pagination-count">{{ desktopPaginationLabel }}</div>
            <div class="vector-pagination-actions">
              <button
                v-if="showDesktopPaginationArrows"
                class="vector-pagination-btn"
                type="button"
                aria-label="Previous suggestion"
                :disabled="isDesktopPaginationPrevDisabled"
                @click="handleDesktopPaginationPrev"
              >
                <cdx-icon :icon="cdxIconExpand" size="small" class="vector-pagination-icon vector-pagination-icon--prev" />
              </button>
              <button
                v-if="showDesktopPaginationArrows"
                class="vector-pagination-btn"
                type="button"
                aria-label="Next suggestion"
                :disabled="isDesktopPaginationNextDisabled"
                @click="handleDesktopPaginationNext"
              >
                <cdx-icon :icon="cdxIconExpand" size="small" class="vector-pagination-icon" />
              </button>
              <button
                v-if="showDesktopPaginationFilterButton"
                class="vector-pagination-btn vector-pagination-btn--filter"
                type="button"
                aria-label="Filter suggestions"
                @click="handleFilterSuggestionsClick"
              >
                <cdx-icon :icon="cdxIconConfigure" size="small" class="vector-pagination-icon" />
              </button>
            </div>
          </div>
          <!-- First Add Citation Suggestion Card -->
          <div 
            v-if="showSuggestionsDisplay && !showSuccessMessage1 && citationNumber1 === null && !isSuggestionDeclined1"
            ref="suggestionsSidebarRef"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded,
              'suggestion-card--expanded': isCardExpanded,
              'suggestion-card--hover': isHovered,
              'suggestion-card--bounce': firstSuggestionBounceActiveId === 1
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset}px` }"
            @mouseenter="isCardHovered = true"
            @mouseleave="isCardHovered = false"
          >
            <!-- Collapsed state: just header -->
            <button 
              v-if="!isCardExpanded"
              class="suggestion-header suggestion-header--collapsed"
              @click="isCardExpanded = true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <!-- Expanded state: header + content -->
            <button 
              v-if="isCardExpanded"
              class="suggestion-header suggestion-header--expanded"
              @click="isCardExpanded = false"
              aria-expanded="true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <div v-if="isCardExpanded" class="suggestion-content">
              <p class="suggestion-description">This information has no source. Help readers understand where this information is coming from by adding a <a href="https://en.wikipedia.org/wiki/Wikipedia:Citing_sources" target="_blank" rel="noopener">citation</a>.</p>
              <div class="suggestion-actions">
                <button 
                  class="suggestion-btn" 
                  :disabled="showCitationPopup1"
                  @click="handleYesSuggestion1"
                >
                  Add citation
                </button>
                <button 
                  class="suggestion-btn suggestion-btn-secondary" 
                  :disabled="showCitationPopup1"
                  @click="handleNoSuggestion1"
                >
                  Dismiss
                </button>
                <cdx-button
                  class="suggestion-more-actions"
                  action="default"
                  weight="quiet"
                  aria-label="More actions"
                >
                  <cdx-icon :icon="cdxIconEllipsis" size="small" />
                </cdx-button>
              </div>
            </div>
          </div>

          <!-- Second Add Citation Suggestion Card -->
          <div 
            v-if="showSuggestionsDisplay && !showSuccessMessage2 && citationNumber2 === null && !isSuggestionDeclined2"
            ref="suggestionsSidebarRef2"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded2,
              'suggestion-card--expanded': isCardExpanded2,
              'suggestion-card--hover': isHovered2,
              'suggestion-card--bounce': firstSuggestionBounceActiveId === 2
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset2}px` }"
            @mouseenter="isCardHovered2 = true"
            @mouseleave="isCardHovered2 = false"
          >
            <!-- Collapsed state: just header -->
            <button 
              v-if="!isCardExpanded2"
              class="suggestion-header suggestion-header--collapsed"
              @click="isCardExpanded2 = true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <!-- Expanded state: header + content -->
            <button 
              v-if="isCardExpanded2"
              class="suggestion-header suggestion-header--expanded"
              @click="isCardExpanded2 = false"
              aria-expanded="true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <div v-if="isCardExpanded2" class="suggestion-content">
              <p class="suggestion-description">This information has no source. Help readers understand where this information is coming from by adding a <a href="https://en.wikipedia.org/wiki/Wikipedia:Citing_sources" target="_blank" rel="noopener">citation</a>.</p>
              <div class="suggestion-actions">
                <button 
                  class="suggestion-btn" 
                  :disabled="showCitationPopup2"
                  @click="handleYesSuggestion2"
                >
                  Add citation
                </button>
                <button 
                  class="suggestion-btn suggestion-btn-secondary" 
                  :disabled="showCitationPopup2"
                  @click="handleNoSuggestion2"
                >
                  Dismiss
                </button>
                <cdx-button
                  class="suggestion-more-actions"
                  action="default"
                  weight="quiet"
                  aria-label="More actions"
                >
                  <cdx-icon :icon="cdxIconEllipsis" size="small" />
                </cdx-button>
              </div>
            </div>
          </div>

          <!-- Third Add Citation Suggestion Card -->
          <div 
            v-if="showSuggestionsDisplay && !showSuccessMessage3 && citationNumber3 === null && !isSuggestionDeclined3"
            ref="suggestionsSidebarRef3"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded3,
              'suggestion-card--expanded': isCardExpanded3,
              'suggestion-card--hover': isHovered3,
              'suggestion-card--bounce': firstSuggestionBounceActiveId === 3
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset3}px` }"
            @mouseenter="isCardHovered3 = true"
            @mouseleave="isCardHovered3 = false"
          >
            <!-- Collapsed state: just header -->
            <button 
              v-if="!isCardExpanded3"
              class="suggestion-header suggestion-header--collapsed"
              @click="isCardExpanded3 = true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <!-- Expanded state: header + content -->
            <button 
              v-if="isCardExpanded3"
              class="suggestion-header suggestion-header--expanded"
              @click="isCardExpanded3 = false"
              aria-expanded="true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Add a citation</div>
            </button>
            
            <div v-if="isCardExpanded3" class="suggestion-content">
              <p class="suggestion-description">This information has no source. Help readers understand where this information is coming from by adding a <a href="https://en.wikipedia.org/wiki/Wikipedia:Citing_sources" target="_blank" rel="noopener">citation</a>.</p>
              <div class="suggestion-actions">
                <button 
                  class="suggestion-btn" 
                  :disabled="showCitationPopup3"
                  @click="handleYesSuggestion3"
                >
                  Add citation
                </button>
                <button 
                  class="suggestion-btn suggestion-btn-secondary" 
                  :disabled="showCitationPopup3"
                  @click="handleNoSuggestion3"
                >
                  Dismiss
                </button>
                <cdx-button
                  class="suggestion-more-actions"
                  action="default"
                  weight="quiet"
                  aria-label="More actions"
                >
                  <cdx-icon :icon="cdxIconEllipsis" size="small" />
                </cdx-button>
              </div>
            </div>
          </div>

          <div
            v-if="showSuggestionsDisplay && !showSuccessMessage4 && !isSuggestionResolved4 && !isSuggestionDeclined4"
            ref="suggestionsSidebarRef4"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded4,
              'suggestion-card--expanded': isCardExpanded4,
              'suggestion-card--hover': isHovered4
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset4}px` }"
            @mouseenter="isCardHovered4 = true"
            @mouseleave="isCardHovered4 = false"
          >
            <button
              v-if="!isCardExpanded4"
              class="suggestion-header suggestion-header--collapsed"
              @click="isCardExpanded4 = true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Remove external link</div>
            </button>
            <button
              v-if="isCardExpanded4"
              class="suggestion-header suggestion-header--expanded"
              @click="isCardExpanded4 = false"
              aria-expanded="true"
            >
              <div class="suggestion-icon">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
              </div>
              <div class="suggestion-title">Remove external link</div>
            </button>
            <div v-if="isCardExpanded4" class="suggestion-content">
              <p class="suggestion-description">This link points to an external website. Help readers stay focused on the content by removing this link, moving it to the <a href="https://en.wikipedia.org/wiki/Wikipedia:External_links" target="_blank" rel="noopener">External links</a> section, or converting it into a <a href="https://en.wikipedia.org/wiki/Wikipedia:Citing_sources" target="_blank" rel="noopener">citation</a> if appropriate.</p>
              <div class="suggestion-actions">
                <button class="suggestion-btn" @click="handleYesSuggestion4">
                  Remove link
                </button>
                <button class="suggestion-btn suggestion-btn-secondary" @click="handleNoSuggestion4">
                  Dismiss
                </button>
                <cdx-button
                  class="suggestion-more-actions"
                  action="default"
                  weight="quiet"
                  aria-label="More actions"
                >
                  <cdx-icon :icon="cdxIconEllipsis" size="small" />
                </cdx-button>
              </div>
            </div>
          </div>

          <div
            v-if="showSuggestionsDisplay && !isSuggestionResolved8 && !isSuggestionDeclined8"
            ref="suggestionsSidebarRef8"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded8,
              'suggestion-card--expanded': isCardExpanded8,
              'suggestion-card--hover': isHovered8
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset8}px` }"
            @mouseenter="isCardHovered8 = true"
            @mouseleave="isCardHovered8 = false"
          >
            <button v-if="!isCardExpanded8" class="suggestion-header suggestion-header--collapsed" @click="isCardExpanded8 = true">
              <div class="suggestion-icon"><cdx-icon :icon="cdxIconLightbulb" size="medium" /></div>
              <div class="suggestion-title">Redirect link</div>
            </button>
            <button v-else class="suggestion-header suggestion-header--expanded" @click="isCardExpanded8 = false" aria-expanded="true">
              <div class="suggestion-icon"><cdx-icon :icon="cdxIconLightbulb" size="medium" /></div>
              <div class="suggestion-title">Redirect link</div>
            </button>
            <div v-if="isCardExpanded8" class="suggestion-content">
              <p class="suggestion-description">This link points to a redirect. Help readers get to the right destination by linking directly to the target page.</p>
              <div class="suggestion-actions">
                <button class="suggestion-btn" @click="handleResolveGenericSuggestion(8)">Update link</button>
                <button class="suggestion-btn suggestion-btn-secondary" @click="handleDeclineGenericSuggestion(8)">Dismiss</button>
                <cdx-button class="suggestion-more-actions" action="default" weight="quiet" aria-label="More actions">
                  <cdx-icon :icon="cdxIconEllipsis" size="small" />
                </cdx-button>
              </div>
            </div>
          </div>

          <div
            v-if="showSuggestionsDisplay && !isSuggestionResolved6 && !isSuggestionDeclined6"
            ref="suggestionsSidebarRef6"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded6,
              'suggestion-card--expanded': isCardExpanded6,
              'suggestion-card--hover': isHovered6
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset6}px` }"
            @mouseenter="isCardHovered6 = true"
            @mouseleave="isCardHovered6 = false"
          >
            <button v-if="!isCardExpanded6" class="suggestion-header suggestion-header--collapsed" @click="isCardExpanded6 = true">
              <div class="suggestion-icon"><cdx-icon :icon="cdxIconLightbulb" size="medium" /></div>
              <div class="suggestion-title">Adjust heading level</div>
            </button>
            <button v-else class="suggestion-header suggestion-header--expanded" @click="isCardExpanded6 = false" aria-expanded="true">
              <div class="suggestion-icon"><cdx-icon :icon="cdxIconLightbulb" size="medium" /></div>
              <div class="suggestion-title">Adjust heading level</div>
            </button>
            <div v-if="isCardExpanded6" class="suggestion-content">
              <p class="suggestion-description">This heading level may not fit the surrounding structure. Help readers navigate the article by adjusting this heading level.</p>
              <div class="suggestion-actions">
                <button class="suggestion-btn" @click="handleResolveGenericSuggestion(6)">Adjust heading</button>
                <button class="suggestion-btn suggestion-btn-secondary" @click="handleDeclineGenericSuggestion(6)">Dismiss</button>
                <cdx-button class="suggestion-more-actions" action="default" weight="quiet" aria-label="More actions">
                  <cdx-icon :icon="cdxIconEllipsis" size="small" />
                </cdx-button>
              </div>
            </div>
          </div>

          <div
            v-if="showSuggestionsDisplay && !isSuggestionResolved7 && !isSuggestionDeclined7"
            ref="suggestionsSidebarRef7"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded7,
              'suggestion-card--expanded': isCardExpanded7,
              'suggestion-card--hover': isHovered7
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset7}px` }"
            @mouseenter="isCardHovered7 = true"
            @mouseleave="isCardHovered7 = false"
          >
            <button v-if="!isCardExpanded7" class="suggestion-header suggestion-header--collapsed" @click="isCardExpanded7 = true">
              <div class="suggestion-icon"><cdx-icon :icon="cdxIconLightbulb" size="medium" /></div>
              <div class="suggestion-title">Fix year link</div>
            </button>
            <button v-else class="suggestion-header suggestion-header--expanded" @click="isCardExpanded7 = false" aria-expanded="true">
              <div class="suggestion-icon"><cdx-icon :icon="cdxIconLightbulb" size="medium" /></div>
              <div class="suggestion-title">Fix year link</div>
            </button>
            <div v-if="isCardExpanded7" class="suggestion-content">
              <p class="suggestion-description">This year is linked unnecessarily. Help readers stay focused on the article by fixing this year link.</p>
              <div class="suggestion-actions">
                <button class="suggestion-btn" @click="handleResolveGenericSuggestion(7)">Fix year link</button>
                <button class="suggestion-btn suggestion-btn-secondary" @click="handleDeclineGenericSuggestion(7)">Dismiss</button>
                <cdx-button class="suggestion-more-actions" action="default" weight="quiet" aria-label="More actions">
                  <cdx-icon :icon="cdxIconEllipsis" size="small" />
                </cdx-button>
              </div>
            </div>
          </div>

          <!-- Empty State - Show when all suggestions are completed or declined -->
          <div 
            v-if="isMinervaSkin && ((showSuggestionBadge && availableSuggestionCount === 0) || (showSuggestions && allSuggestionsHandled && !showSuggestionNotification && !showSuggestionBadge))"
            class="empty-state"
          >
            <div v-if="!showSuggestionBadge" class="empty-state-icon">
              <cdx-icon :icon="cdxIconLightbulb" size="medium" />
            </div>
            <div class="empty-state-content">
              <p class="empty-state-text">
                {{ showSuggestionBadge ? '0 suggestions available for improving this article' : 'There are no suggestions to improve this article yet.' }}
              </p>
            </div>
          </div>
          <div
            v-if="activePrototype !== 'option-3'"
            class="suggestions-banner-container"
            :class="{
              'suggestions-banner-container--contextual-up': showBannerPrimaryArrowUp &&
                (activePrototype === 'option-1' || isFirstSuggestionNavigationMode)
            }"
          >
            <transition name="banner-reveal" appear>
              <div
                v-if="isBannerDelayReady && !isBannerDismissed && !(activePrototype === 'option-3' && isAutoScrollActive) && (isArrowOnceMode
                  ? (showSuggestions && shouldShowBanner && bannerSuggestionCount > 0)
                  : (shouldShowBanner || (showSuggestions && bannerSuggestionCount === 0)))"
                class="suggestions-banner"
              :class="{
                'suggestions-banner--empty': bannerSuggestionCount === 0,
                'suggestions-banner--count-button': activePrototype === 'option-1' && bannerSuggestionCount > 0,
                'suggestions-banner--option-2': isFirstSuggestionNavigationMode && bannerSuggestionCount > 0,
                'suggestions-banner--option-3': activePrototype === 'option-3' && bannerSuggestionCount > 0,
                'suggestions-banner--single-use': isFirstSuggestionNavigationMode,
                'suggestions-banner--contextual-up': showBannerPrimaryArrowUp &&
                  (activePrototype === 'option-1' || isFirstSuggestionNavigationMode),
                'suggestions-banner--hidden': !showSuggestionToggle && !showSuggestions,
                'suggestions-banner--clickable': showSuggestions,
                'suggestions-banner--closing': isBannerClosing,
                'suggestions-banner--opening': isBannerOpening,
                  'suggestions-banner--scrolled': isEditToolbarScrolled
                }"
                :role="showSuggestions ? 'button' : undefined"
                :tabindex="showSuggestions ? 0 : undefined"
                @click="showSuggestions ? handleBannerClick() : null"
                @keydown="showSuggestions ? handleBannerKeydown($event) : null"
              >
                <div class="suggestions-banner-center">
                  <div
                    v-if="showSuggestionToggle || showSuggestions"
                    class="suggestions-banner-text"
                  >
                    <template v-if="bannerSuggestionCount === 0">
                      <span>0 suggestions available</span>
                    </template>
                    <template v-else-if="activePrototype === 'option-1'">
                      <span class="suggestions-banner-arrow-btn suggestions-banner-arrow-btn--display">
                        <cdx-icon :icon="showBannerPrimaryArrowUp ? cdxIconArrowUp : cdxIconArrowDown" size="medium" />
                      </span>
                      <span class="banner-text">
                        <span class="banner-text-bold">{{ bannerSuggestionCount }} suggestions</span>
                      </span>
                    </template>
                    <template v-else>
                      <cdx-button
                        v-if="isFirstSuggestionNavigationMode && !isAutoScrollActive"
                        class="suggestions-banner-arrow-btn"
                        action="progressive"
                        weight="quiet"
                        :aria-label="showBannerPrimaryArrowUp ? 'View previous suggestions' : 'View next suggestions'"
                        @click.stop="showSuggestions ? scrollToSuggestionByDirection(showBannerPrimaryArrowUp ? 'up' : 'down') : null"
                        @keydown="showSuggestions ? handleBannerKeydown($event) : null"
                      >
                        <cdx-icon :icon="showBannerPrimaryArrowUp ? cdxIconArrowUp : cdxIconArrowDown" size="medium" />
                      </cdx-button>
                      <cdx-icon
                        v-else
                        :icon="cdxIconArrowDown"
                        size="medium"
                        :class="{ 'suggestions-banner-icon--up': showBannerPrimaryArrowUp }"
                      />
                      <span>View suggestions</span>
                    </template>
                  </div>
                </div>
                <div class="suggestions-banner-actions">
                  <span v-if="isFirstSuggestionNavigationMode || activePrototype === 'option-1'" class="suggestions-banner-close-icon-container">
                    <cdx-button
                      class="suggestions-banner-close-btn"
                      size="small"
                      action="progressive"
                      weight="quiet"
                      aria-label="Dismiss suggestions"
                      @click.stop="handleBannerClose()"
                    >
                      <cdx-icon class="suggestions-banner-close-icon" :icon="cdxIconClose" size="small" />
                    </cdx-button>
                  </span>
                </div>
              </div>
            </transition>
          </div>
          <div
            v-if="isEditCheckMode"
            ref="editCheckSidebarRef"
            class="suggestion-card suggestion-card-positioned feedback-card feedback-card--warning"
            :class="{
              'suggestion-card--collapsed': !isEditCheckExpandedDisplay,
              'suggestion-card--expanded': isEditCheckExpandedDisplay,
              'suggestion-card--hover': isEditCheckHovered
            }"
            :style="{ top: `${editCheckTopOffset}px` }"
            @mouseenter="isEditCheckHovered = true; syncEditCheckHoverState()"
            @mouseleave="isEditCheckHovered = false; syncEditCheckHoverState()"
          >
            <button
              class="suggestion-header"
              :class="{ 'suggestion-header--expanded': isEditCheckExpandedDisplay }"
              @click="toggleEditCheckExpand"
            >
              <div class="suggestion-icon tone-check-icon">
                <cdx-icon :icon="cdxIconAlert" size="medium" />
              </div>
              <div class="suggestion-title">{{ editCheckTitle }}</div>
            </button>
            <div v-if="isEditCheckExpandedDisplay" class="suggestion-content">
              <p v-if="activeEditCheckType === 'tone'" class="suggestion-description">Other editors often revise this kind of wording to have a more balanced tone. Learn more</p>
              <p v-else class="suggestion-description">Please avoid copying text from other sources, even if rephrased or cited. This could be
                considered
                <a
                  href="https://en.wikipedia.org/wiki/Wikipedia:Copyright_violations"
                  target="_blank"
                  rel="noopener"
                >
                  copyright violation or plagiarism
                </a>
                and may result in your content being removed or your account being blocked.</p>
              <div v-if="activeEditCheckType === 'tone'" class="suggestion-actions">
                <button class="suggestion-btn" @click="handleToneCheckRevise">Revise</button>
                <button class="suggestion-btn suggestion-btn-secondary" @click="handleToneCheckDecline">Decline</button>
              </div>
              <div v-else class="suggestion-actions">
                <p class="suggestion-description suggestion-description--question">Did you write this text?</p>
                <div class="paste-check-buttons">
                  <button class="suggestion-btn" @click="handlePasteCheckKeep">Yes, keep it</button>
                  <button class="suggestion-btn suggestion-btn-secondary" @click="handlePasteCheckRemove">No, remove it</button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div
          v-if="showMinervaRail"
          class="minerva-suggestions-rail"
        >
          <div
            v-if="showMinervaTopRailControls"
            class="minerva-suggestions-rail-controls"
          >
            <cdx-button
              v-if="showMinervaFullPageTocRailButtonUi"
              ref="minervaFullPageTocButtonRef"
              class="minerva-suggestions-rail-toc-button"
              action="default"
              weight="quiet"
              size="medium"
              aria-label="Open table of contents"
              @click.stop="toggleMinervaFullPageToc"
            >
              <cdx-icon :icon="cdxIconListBullet" size="medium" />
            </cdx-button>
            <cdx-toggle-button
              v-if="showMinervaTopRailToggle"
              ref="minervaRailToggleRef"
              :model-value="showSuggestions"
              quiet
              aria-label="Toggle suggestions"
              class="minerva-suggestions-rail-toggle"
              :class="{ 'minerva-suggestions-rail-toggle--active': showSuggestions }"
              @update:model-value="handleMinervaRailControlsToggleChange"
            >
              <span class="lightbulb-icon-wrapper">
                <span v-if="activePrototype !== 'option-4' && showSuggestions" class="bulb-rays">
                  <span class="ray ray-1"></span>
                  <span class="ray ray-2"></span>
                  <span class="ray ray-3"></span>
                  <span class="ray ray-4"></span>
                  <span class="ray ray-5"></span>
                </span>
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                <span
                  v-if="showToggleBadge || isPaginationMode"
                  class="suggestions-badge"
                  :class="{
                    'suggestions-badge--zero': showToggleBadgeZero,
                    'suggestions-badge--pulse': badgePulse,
                    'suggestions-badge--rail-active': isPaginationMode
                  }"
                >
                  {{ toggleBadgeCount }}
                </span>
              </span>
            </cdx-toggle-button>
          </div>
          <div
            v-if="showMinervaBottomRailControls"
            class="minerva-suggestions-rail-controls minerva-suggestions-rail-controls--bottom"
          >
            <cdx-toggle-button
              v-if="showMinervaBottomRailToggleControl"
              ref="minervaRailToggleRef"
              :model-value="showSuggestions"
              quiet
              aria-label="Toggle suggestions"
              class="minerva-suggestions-rail-toggle"
              :class="{ 'minerva-suggestions-rail-toggle--active': showSuggestions }"
              @update:model-value="handleMinervaRailControlsToggleChange"
            >
              <span class="lightbulb-icon-wrapper">
                <span v-if="activePrototype !== 'option-4' && showSuggestions" class="bulb-rays">
                  <span class="ray ray-1"></span>
                  <span class="ray ray-2"></span>
                  <span class="ray ray-3"></span>
                  <span class="ray ray-4"></span>
                  <span class="ray ray-5"></span>
                </span>
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                <span
                  v-if="showToggleBadge || isPaginationMode"
                  class="suggestions-badge"
                  :class="{
                    'suggestions-badge--zero': showToggleBadgeZero,
                    'suggestions-badge--pulse': badgePulse,
                    'suggestions-badge--rail-active': isPaginationMode
                  }"
                >
                  {{ toggleBadgeCount }}
                </span>
              </span>
            </cdx-toggle-button>
            <cdx-toggle-button
              v-if="showMinervaCollapsedCountRailToggle"
              :model-value="true"
              quiet
              aria-label="Show suggestions"
              class="minerva-suggestions-rail-toggle minerva-suggestions-rail-toggle--count-collapsed minerva-suggestions-rail-toggle--active"
              @update:model-value="handleMinervaCollapsedRailToggleControlsChange"
            >
              <span class="lightbulb-icon-wrapper">
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                <span
                  class="suggestions-badge"
                  :class="{ 'suggestions-badge--zero': showToggleBadgeZero, 'suggestions-badge--pulse': badgePulse }"
                >
                  {{ toggleBadgeCount }}
                </span>
              </span>
            </cdx-toggle-button>
            <cdx-button
              v-if="showMinervaFilterButton"
              class="suggestions-filter-btn minerva-suggestions-filter-btn"
              action="default"
              weight="quiet"
              size="large"
              aria-label="Filter suggestions"
              @click="handleMinervaRailFilterClick"
            >
              <cdx-icon :icon="cdxIconConfigure" size="medium" />
            </cdx-button>
            <div
              v-if="showMinervaRailArrows"
              class="minerva-suggestions-rail-arrows"
            >
              <cdx-button
                class="suggestions-banner-arrow-btn"
                action="default"
                weight="quiet"
                size="small"
                :disabled="!showBannerArrowUp"
                aria-label="View previous suggestions"
                @click="handleMinervaRailArrowClick('up')"
                @keydown="handleBannerKeydown($event)"
              >
                <cdx-icon :icon="cdxIconCollapse" size="medium" />
              </cdx-button>
              <cdx-button
                class="suggestions-banner-arrow-btn"
                action="default"
                weight="quiet"
                size="small"
                :disabled="!showBannerArrowDown"
                aria-label="View next suggestions"
                @click="handleMinervaRailArrowClick('down')"
                @keydown="handleBannerKeydown($event)"
              >
                <cdx-icon :icon="cdxIconExpand" size="medium" />
              </cdx-button>
            </div>
            <cdx-toggle-button
              v-if="showMinervaBottomRailToggle"
              ref="minervaRailToggleRef"
              :model-value="activePrototype === 'option-4'
                ? isMinervaOverviewSheetOpen
                : isPaginationManualMode
                  ? (isMinervaSheetOpen && !isEditCheckSheet)
                  : showSuggestions"
              :disabled="isPaginationManualMode && toggleBadgeCount === 0"
              quiet
              aria-label="Toggle suggestions"
              class="minerva-suggestions-rail-toggle"
              :class="{
                'minerva-suggestions-rail-toggle--active': activePrototype === 'option-4'
                  ? isMinervaOverviewSheetOpen
                  : isPaginationManualMode
                    ? (isMinervaSheetOpen && !isEditCheckSheet)
                    : showSuggestions,
                'minerva-suggestions-rail-toggle--overview': activePrototype === 'option-4' || isPaginationManualMode
              }"
              @update:model-value="handleMinervaRailControlsToggleChange"
            >
              <span class="lightbulb-icon-wrapper">
                <span v-if="activePrototype !== 'option-4' && !isPaginationManualMode && showSuggestions" class="bulb-rays">
                  <span class="ray ray-1"></span>
                  <span class="ray ray-2"></span>
                  <span class="ray ray-3"></span>
                  <span class="ray ray-4"></span>
                  <span class="ray ray-5"></span>
                </span>
                <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                <span
                  v-if="showToggleBadge || isPaginationMode"
                  class="suggestions-badge"
                  :class="{
                    'suggestions-badge--zero': showToggleBadgeZero,
                    'suggestions-badge--pulse': badgePulse,
                    'suggestions-badge--rail-active': isPaginationMode
                  }"
                >
                  {{ toggleBadgeCount }}
                </span>
              </span>
            </cdx-toggle-button>
          </div>
        </div>

        <div
          v-if="isMinervaSkin && isEditMode && (showSuggestionsDisplay || isEditCheckMode) && isMinervaSheetOpen && (availableSuggestionCount > 0 || isEditCheckSheet || showMinervaNoMoreSuggestionsState || isMinervaSuggestionSuccessState)"
          class="minerva-bottom-sheet"
            :class="{
              'minerva-bottom-sheet--edit-check': isEditCheckSheet,
              'minerva-bottom-sheet--suggestion': !isEditCheckSheet,
              'minerva-bottom-sheet--rail-offset': !isEditCheckSheet && activePrototype === 'option-3',
              'minerva-bottom-sheet--success-exit': isMinervaSuggestionSuccessExiting || isMinervaSheetClosing
            }"
            role="dialog"
            aria-label="Suggestion"
            ref="minervaSheetRef"
          >
          <div
            class="minerva-sheet-content"
            :class="{ 'suggestion-dismiss-right': dismissedSuggestionId === activeMinervaSuggestion && !isEditCheckSheet }"
          >
            <div
              class="minerva-sheet-header"
              :class="{
                'minerva-sheet-header--empty': shouldShowEmptyState && !showMinervaNoMoreSuggestionsState && !isEditCheckSheet,
                'minerva-sheet-header--no-more': showMinervaNoMoreSuggestionsState && !isEditCheckSheet,
                'minerva-sheet-header--success': isMinervaSuggestionSuccessState && !isEditCheckSheet
              }"
            >
              <cdx-icon :icon="isEditCheckSheet ? cdxIconAlert : (isMinervaSuggestionSuccessState ? cdxIconSuccess : cdxIconLightbulb)" size="medium" />
              <div
                class="minerva-sheet-title"
                :class="{ 'minerva-sheet-title--success': isMinervaSuggestionSuccessState }"
              >
                {{ isEditCheckSheet ? editCheckTitle : minervaSheetTitle }}
              </div>
              <div
                v-if="showMinervaSuggestionHeaderIndicator"
                class="minerva-sheet-header-indicator"
              >
                {{ minervaSuggestionHeaderIndicatorLabel }}
              </div>
              <div class="minerva-sheet-header-actions">
                <button
                  v-if="showMinervaSheetReturnArrow"
                  class="minerva-sheet-icon-button"
                  type="button"
                  :aria-label="minervaSheetReturnDirection === 'up' ? 'Scroll to highlighted item above' : 'Scroll to highlighted item below'"
                  @click="scrollToMinervaSheetTarget"
                >
                  <cdx-icon :icon="minervaSheetReturnDirection === 'up' ? cdxIconArrowUp : cdxIconArrowDown" size="medium" />
                </button>
                <button
                  v-else
                  class="minerva-sheet-icon-button minerva-sheet-icon-button--close"
                  type="button"
                  aria-label="Close"
                  @click="closeMinervaSuggestion"
                >
                  <cdx-icon :icon="cdxIconClose" size="medium" />
                </button>
              </div>
            </div>
          <p v-if="isEditCheckSheet && activeEditCheckType === 'tone'" class="minerva-sheet-description">
            Other editors often revise this kind of wording to have a more balanced tone. Learn more
          </p>
          <p v-else-if="isEditCheckSheet && activeEditCheckType === 'paste'" class="minerva-sheet-description">
            Please avoid copying text from other sources, even if rephrased or cited. This could be
            considered
            <a
              href="https://en.wikipedia.org/wiki/Wikipedia:Copyright_violations"
              target="_blank"
              rel="noopener"
            >
              copyright violation or plagiarism
            </a>
            and may result in your content being removed or your account being blocked.
          </p>
          <p v-else-if="isMinervaSuggestionSuccessState" class="minerva-sheet-description minerva-sheet-description--success">
            {{ minervaSuggestionSuccessDescription }}
          </p>
          <p v-else-if="showMinervaNoMoreSuggestionsState" class="minerva-sheet-description">
            {{ minervaNoMoreSuggestionsDescription }}
          </p>
          <p v-else-if="shouldShowEmptyState && !showSuggestionNotification" class="minerva-empty-sheet-text">
            There are no suggestions to improve this article yet.
          </p>
          <p v-else-if="activeMinervaSuggestion === 4" class="minerva-sheet-description">
            This link points to an external website. Help readers stay focused on the content by removing this link, moving it to the
            <a href="https://en.wikipedia.org/wiki/Wikipedia:External_links" target="_blank" rel="noopener">External links</a>
            section, or converting it into a
            <a href="https://en.wikipedia.org/wiki/Wikipedia:Citing_sources" target="_blank" rel="noopener">citation</a>
            if appropriate.
          </p>
          <p v-else-if="activeMinervaSuggestion === 5" class="minerva-sheet-description">
            This link points to a disambiguation page. Help readers reach the intended topic by linking to a more specific page.
          </p>
          <p v-else-if="activeMinervaSuggestion === 6" class="minerva-sheet-description">
            This heading level may not fit the surrounding structure. Help readers navigate the article by adjusting this heading level.
          </p>
          <p v-else-if="activeMinervaSuggestion === 7" class="minerva-sheet-description">
            This year is linked unnecessarily. Help readers stay focused on the article by fixing this year link.
          </p>
          <p v-else-if="activeMinervaSuggestion === 8" class="minerva-sheet-description">
            This link points to a redirect. Help readers get to the right destination by linking directly to the target page.
          </p>
          <p v-else class="minerva-sheet-description">
            This information has no source. Help readers understand where this information is coming from by adding a
            <a href="https://en.wikipedia.org/wiki/Wikipedia:Citing_sources" target="_blank" rel="noopener">citation</a>.
          </p>
            <div v-if="isEditCheckSheet && activeEditCheckType === 'tone'" class="minerva-sheet-actions">
            <cdx-button
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              @click="handleToneCheckRevise"
            >
              Revise
            </cdx-button>
            <cdx-button
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              @click="handleToneCheckDecline"
            >
              Decline
            </cdx-button>
          </div>
            <div v-else-if="isEditCheckSheet && activeEditCheckType === 'paste'" class="minerva-sheet-actions">
            <cdx-button
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              @click="handlePasteCheckKeep"
            >
              Yes, keep it
            </cdx-button>
            <cdx-button
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              @click="handlePasteCheckRemove"
            >
              No, remove it
            </cdx-button>
          </div>
            <template v-else-if="isMinervaSuggestionSuccessState"></template>
            <div v-else-if="showMinervaNoMoreSuggestionsState" class="minerva-sheet-actions">
            <cdx-button
              v-if="isMinervaNoMoreSuggestionsSectionState"
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              @click="handleMinervaViewMoreSuggestions"
            >
              View more suggestions
            </cdx-button>
            <template v-else>
              <cdx-button
                class="minerva-sheet-btn minerva-sheet-btn-secondary"
                action="default"
                weight="normal"
                @click="handleMinervaContinueEditing"
              >
                Continue editing
              </cdx-button>
              <cdx-button
                class="minerva-sheet-btn"
                action="progressive"
                weight="primary"
                @click="publishEdits"
              >
                Publish
              </cdx-button>
            </template>
          </div>
            <div v-else-if="!shouldShowEmptyState" class="minerva-sheet-actions">
            <cdx-button
              v-if="activeMinervaSuggestion === 1"
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              :disabled="showCitationPopup1"
              @click="handleYesSuggestion1"
            >
              Add citation
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 1"
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              :disabled="showCitationPopup1"
              @click="handleNoSuggestion1"
            >
              Dismiss
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 2"
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              :disabled="showCitationPopup2"
              @click="handleYesSuggestion2"
            >
              Add citation
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 2"
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              :disabled="showCitationPopup2"
              @click="handleNoSuggestion2"
            >
              Dismiss
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 3"
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              :disabled="showCitationPopup3"
              @click="handleYesSuggestion3"
            >
              Add citation
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 3"
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              :disabled="showCitationPopup3"
              @click="handleNoSuggestion3"
            >
              Dismiss
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 4"
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              @click="handleYesSuggestion4"
            >
              Remove link
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 4"
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              @click="handleNoSuggestion4"
            >
              Dismiss
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 5"
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              @click="handleResolveGenericSuggestion(5)"
            >
              Link specifically
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 5"
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              @click="handleDeclineGenericSuggestion(5)"
            >
              Dismiss
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 6"
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              @click="handleResolveGenericSuggestion(6)"
            >
              Adjust heading
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 6"
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              @click="handleDeclineGenericSuggestion(6)"
            >
              Dismiss
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 7"
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              @click="handleResolveGenericSuggestion(7)"
            >
              Fix year link
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 7"
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              @click="handleDeclineGenericSuggestion(7)"
            >
              Dismiss
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 8"
              class="minerva-sheet-btn"
              action="default"
              weight="normal"
              @click="handleResolveGenericSuggestion(8)"
            >
              Update link
            </cdx-button>
            <cdx-button
              v-if="activeMinervaSuggestion === 8"
              class="minerva-sheet-btn minerva-sheet-btn-secondary"
              action="default"
              weight="normal"
              @click="handleDeclineGenericSuggestion(8)"
            >
              Dismiss
            </cdx-button>
            <cdx-button
              class="minerva-sheet-btn minerva-sheet-more-actions"
              action="default"
              weight="quiet"
              aria-label="More actions"
            >
              <cdx-icon :icon="cdxIconEllipsis" size="small" />
            </cdx-button>
          </div>
          </div>
          <div
            v-if="showMinervaPagination && !showMinervaNoMoreSuggestionsState"
            class="minerva-sheet-pagination"
          >
            <div
              class="minerva-pagination-count"
              :class="{ 'minerva-pagination-count--loading': isMinervaSuggestionSuccessState }"
            >
              {{ minervaPaginationLabel }}
            </div>
            <div v-if="showMinervaPaginationArrows" class="minerva-pagination-actions">
              <cdx-button
                class="minerva-pagination-btn"
                action="default"
                weight="quiet"
                size="medium"
                :aria-label="isEditCheckSheet ? 'Previous check' : 'Previous suggestion'"
                :disabled="isMinervaPaginationPrevDisabled"
                @click="handleMinervaPaginationPrev"
              >
                <cdx-icon :icon="cdxIconExpand" size="medium" class="minerva-pagination-icon minerva-pagination-icon--prev" />
              </cdx-button>
              <cdx-button
                class="minerva-pagination-btn"
                action="default"
                weight="quiet"
                size="medium"
                :aria-label="isEditCheckSheet ? 'Next check' : 'Next suggestion'"
                :disabled="isMinervaPaginationNextDisabled"
                @click="handleMinervaPaginationNext"
              >
                <cdx-icon :icon="cdxIconExpand" size="medium" class="minerva-pagination-icon" />
              </cdx-button>
            </div>
          </div>
        </div>
        <div
          v-if="isMinervaSkin && isEditMode && showSuggestionsDisplay && isMinervaSheetOpen && (availableSuggestionCount > 0 || isMinervaSuggestionSuccessState)"
          class="minerva-sheet-backdrop"
          :class="{ 'minerva-sheet-backdrop--suggestion': activePrototype === 'option-3' && !isEditCheckSheet }"
          @click="closeMinervaSuggestion"
        ></div>
        <div
          v-if="isMinervaSkin && isEditMode && activePrototype === 'option-4' && isMinervaOverviewSheetOpen"
          class="minerva-bottom-sheet minerva-overview-sheet"
          role="dialog"
          aria-label="Suggestions in this section"
        >
          <div class="minerva-sheet-header minerva-overview-sheet-header">
            <div class="minerva-sheet-title">Suggestions in this section</div>
          </div>
          <div class="minerva-overview-list">
            <div
              v-if="overviewSuggestionItems.length === 0"
              class="minerva-overview-empty-state"
            >
              No suggestions available
            </div>
            <div
              v-for="item in overviewSuggestionItems"
              :key="item.id"
              class="minerva-overview-item"
              role="button"
              tabindex="0"
              @click="handleOverviewSuggestionClick(item.id)"
              @keydown.enter.prevent="handleOverviewSuggestionClick(item.id)"
              @keydown.space.prevent="handleOverviewSuggestionClick(item.id)"
            >
              <cdx-icon :icon="cdxIconLightbulb" size="small" class="minerva-overview-item-icon" />
              <div class="minerva-overview-item-label">{{ item.title }}</div>
            </div>
          </div>
        </div>
        <div
          v-if="isMinervaSkin && isEditMode && activePrototype === 'option-4' && isMinervaOverviewSheetOpen"
          class="minerva-sheet-backdrop minerva-sheet-backdrop--overview"
          @click="closeMinervaOverviewSheet"
        ></div>

        <!-- Tools Sidebar (Right) - Only visible in Read mode -->
        <aside v-if="!isEditMode" class="tools-sidebar">
          <div class="tools-container">
            <div class="tools-header">
              <h2 class="tools-title">Tools</h2>
              <button class="tools-toggle">hide</button>
            </div>

            <div class="tools-section">
              <div class="tools-section-title">General</div>
              <nav class="tools-nav">
                <a href="#" class="tools-link">What links here</a>
                <a href="#" class="tools-link">Related changes</a>
                <a href="#" class="tools-link">Special pages</a>
                <a href="#" class="tools-link">Permanent link</a>
                <a href="#" class="tools-link">Page information</a>
                <a href="#" class="tools-link">Cite this page</a>
                <a href="#" class="tools-link">Wikidata item</a>
                <a href="#" class="tools-link">Edit interlanguage links</a>
              </nav>
            </div>

            <div class="tools-section">
              <div class="tools-section-title">Print/export</div>
              <nav class="tools-nav">
                <a href="#" class="tools-link">Download as PDF</a>
                <a href="#" class="tools-link">Printable version</a>
              </nav>
            </div>

            <div class="tools-section">
              <div class="tools-section-title">In other projects</div>
              <nav class="tools-nav">
                <a href="#" class="tools-link">Wikimedia Commons</a>
                <a href="#" class="tools-link">Wikiquote</a>
                <a href="#" class="tools-link">Wikidata item</a>
              </nav>
            </div>
          </div>
        </aside>

        <cdx-dialog
          v-model:open="isPrototypeDialogOpen"
          title="Choose prototype"
          :primary-action="{ label: 'See prototype', actionType: 'progressive' }"
          use-close-button
          @primary="startPrototype"
        >
          <div class="prototype-dialog-content">
            <cdx-message type="notice">
              See the validated version of Suggestion Mode in
              <a href="https://bmartinezcalvo.github.io/suggestion-mode/preview/" target="_blank" rel="noopener">
                this prototype
              </a>.
            </cdx-message>
            <div class="prototype-dialog-options">
              <cdx-field v-if="isMinervaSkin">
                <template #label>
                  Mobile ToggleButton (<a href="https://phabricator.wikimedia.org/T415589" target="_blank" rel="noopener">T415589</a>)
                </template>
                <div class="cdx-radio-group" role="radiogroup">
                  <cdx-radio
                    v-model="minervaToggleLocation"
                    name="minerva-toggle-location"
                    input-value="toolbar"
                  >
                    Within the toolbar
                  </cdx-radio>
                  <cdx-radio
                    v-model="minervaToggleLocation"
                    name="minerva-toggle-location"
                    input-value="outside"
                  >
                    Outside the toolbar
                  </cdx-radio>
                </div>
              </cdx-field>
              <cdx-field>
                <template #label>
                  Navigation of suggestions (<a href="https://phabricator.wikimedia.org/T417821" target="_blank" rel="noopener">T417821</a>)
                </template>
                <div class="cdx-radio-group" role="radiogroup">
                  <cdx-radio
                    v-model="selectedNavigationGroup"
                    name="suggestions-discoverability"
                    input-value="pagination"
                  >
                    Pagination
                  </cdx-radio>
                  <div v-if="selectedNavigationGroup === 'pagination'" class="prototype-suboptions prototype-suboptions--indexed-radios">
                    <cdx-radio
                      v-model="selectedPrototype"
                      name="pagination-navigation-mode"
                      input-value="option-6"
                      class="prototype-suboption-radio"
                    >
                      Manual navigation
                    </cdx-radio>
                    <div
                      v-if="isMinervaSkin && selectedPrototype === 'option-6' && minervaToggleLocation !== 'toolbar'"
                      class="prototype-suboptions"
                    >
                      <cdx-checkbox v-model="paginationManualNavigableButtonEnabled">
                        Enable navigable button to next suggestion
                      </cdx-checkbox>
                    </div>
                    <cdx-radio
                      v-model="selectedPrototype"
                      name="pagination-navigation-mode"
                      input-value="option-5"
                      class="prototype-suboption-radio prototype-suboption-radio--last"
                    >
                      Automatic navigation
                    </cdx-radio>
                  </div>
                  <cdx-radio
                    v-model="selectedNavigationGroup"
                    name="suggestions-discoverability"
                    input-value="option-3"
                  >
                    Navigable arrows
                  </cdx-radio>
                  <cdx-radio
                    v-model="selectedNavigationGroup"
                    name="suggestions-discoverability"
                    input-value="option-4"
                  >
                    Overview with list of suggestions
                  </cdx-radio>
                </div>
              </cdx-field>
              <cdx-field>
                <template #label>Other features</template>
                <cdx-checkbox v-model="filteringEnabled">
                  Enable filtering (<a href="https://phabricator.wikimedia.org/T420648" target="_blank" rel="noopener">T420648</a>)
                </cdx-checkbox>
                <cdx-checkbox v-model="editToolbarImprovementsEnabled">
                  Enable Edit Toolbar improvements (<a href="https://phabricator.wikimedia.org/T400903" target="_blank" rel="noopener">T400903</a>)
                </cdx-checkbox>
                <cdx-checkbox v-model="successHighlightOnCompleteEnabled">
                  Enable success state when completing suggestions (<a href="https://phabricator.wikimedia.org/T404607" target="_blank" rel="noopener">T404607</a>)
                </cdx-checkbox>
                <cdx-checkbox v-if="isMinervaSkin" v-model="noMoreSuggestionsEmptyStateEnabled">
                  Enable Empty State when completing/declining all suggestions (<a href="https://phabricator.wikimedia.org/T426062" target="_blank" rel="noopener">T426062</a>)
                </cdx-checkbox>
                <cdx-checkbox v-if="isMinervaSkin" v-model="minervaFullPageSuggestionNavigationEnabled">
                  Enable ToC when editing full page (<a href="https://phabricator.wikimedia.org/T416468" target="_blank" rel="noopener">T416468</a>)
                </cdx-checkbox>
                <div v-if="isMinervaSkin && minervaFullPageSuggestionNavigationEnabled" class="prototype-suboptions prototype-suboptions--indexed-radios">
                  <cdx-radio
                    v-model="minervaFullPageSuggestionNavigationMode"
                    name="minerva-full-page-suggestion-navigation-mode"
                    input-value="toc-button"
                    class="prototype-suboption-radio"
                  >
                    Right panel
                  </cdx-radio>
                  <cdx-radio
                    v-model="minervaFullPageSuggestionNavigationMode"
                    name="minerva-full-page-suggestion-navigation-mode"
                    input-value="expandable-rail"
                    class="prototype-suboption-radio"
                  >
                    Expandable rail
                  </cdx-radio>
                  <cdx-radio
                    v-model="minervaFullPageSuggestionNavigationMode"
                    name="minerva-full-page-suggestion-navigation-mode"
                    input-value="scroll-button"
                    class="prototype-suboption-radio prototype-suboption-radio--last"
                  >
                    Scroll button
                  </cdx-radio>
                </div>
              </cdx-field>
              <cdx-field>
                <template #label>Visual improvements</template>
                <cdx-checkbox v-model="newSuggestionColorEnabled">
                  New color of suggestions
                </cdx-checkbox>
                <cdx-checkbox v-model="nonSelectedHighlightUnderlineEnabled">
                  Highlighted text is underlined when non selected
                </cdx-checkbox>
                <cdx-checkbox v-if="isMinervaSkin" v-model="editFullPageImprovedEnabled">
                  "Edit full page" button improved
                </cdx-checkbox>
              </cdx-field>
            </div>
          </div>
        </cdx-dialog>

        <cdx-dialog
          v-model:open="isVectorNoMoreSuggestionsDialogOpen"
          title="No more suggestions"
          use-close-button
        >
          <div class="prototype-dialog-content">
            <p class="vector-no-more-dialog-text">
              {{ vectorNoMoreSuggestionsDescription }}
            </p>
            <div class="vector-no-more-dialog-actions">
              <cdx-button action="default" weight="normal" @click="isVectorNoMoreSuggestionsDialogOpen = false">
                Continue editing
              </cdx-button>
              <cdx-button action="progressive" weight="primary" @click="publishEdits">
                Publish
              </cdx-button>
            </div>
          </div>
        </cdx-dialog>

        <div
          v-if="isMinervaAddLinkDialogOpen"
          class="link-dialog-backdrop"
          role="presentation"
        >
          <div class="link-dialog" role="dialog" aria-modal="true" aria-label="Add a link">
            <div class="link-dialog-header">
              <button class="link-dialog-close" aria-label="Close" @click="closeMinervaLinkDialog">
                <cdx-icon :icon="cdxIconClose" size="medium" />
              </button>
              <h2 class="link-dialog-title">Add a link</h2>
              <button class="link-dialog-confirm" aria-label="Confirm" @click="closeMinervaLinkDialog">
                <cdx-icon :icon="cdxIconSuccess" size="medium" />
              </button>
            </div>
            <div class="link-dialog-tabs" role="tablist">
              <button
                class="link-dialog-tab"
                :class="{ 'link-dialog-tab--active': linkDialogTab === 'wikipedia' }"
                role="tab"
                :aria-selected="linkDialogTab === 'wikipedia'"
                @click="linkDialogTab = 'wikipedia'"
              >
                Wikipedia
              </button>
              <button
                class="link-dialog-tab"
                :class="{ 'link-dialog-tab--active': linkDialogTab === 'external' }"
                role="tab"
                :aria-selected="linkDialogTab === 'external'"
                @click="linkDialogTab = 'external'"
              >
                External site
              </button>
            </div>
            <div class="link-dialog-content">
              <div v-if="linkDialogTab === 'wikipedia'" class="link-dialog-panel" role="tabpanel">
                <cdx-field>
                  <template #label>Text</template>
                  <cdx-text-input v-model="linkDialogText" />
                </cdx-field>
                <cdx-field>
                  <template #label>Link</template>
                  <cdx-typeahead-search
                    id="link-typeahead-search"
                    :use-button="false"
                    :search-results="linkSearchResults"
                    :search-footer-url="linkSearchFooterUrl"
                    :show-thumbnail="true"
                    :highlight-query="true"
                    placeholder="Search Wikipedia"
                    v-model="linkDialogQuery"
                    @input="onLinkSearchInput"
                  />
                </cdx-field>
              </div>
              <div v-else class="link-dialog-panel" role="tabpanel">
                <cdx-field>
                  <template #label>Text</template>
                  <cdx-text-input v-model="linkDialogText" />
                </cdx-field>
                <cdx-field>
                  <template #label>Link</template>
                  <cdx-text-input v-model="linkDialogExternalUrl" placeholder="https://example.com" />
                </cdx-field>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="isMinervaAddCitationDialogOpen"
          class="citation-popup"
          contenteditable="false"
        >
          <div class="citation-popup-pointer"></div>
          <div class="citation-popup-header">
            <button class="citation-popup-close" @click="closeMinervaCitationDialog" aria-label="Close">
              <cdx-icon :icon="cdxIconClose" size="medium" />
            </button>
            <h3 class="citation-popup-title">Add citation</h3>
          </div>
          <div class="citation-popup-tabs">
            <button class="citation-tab citation-tab--active">Automatic</button>
            <button class="citation-tab">Manual</button>
            <button class="citation-tab">Re-use</button>
          </div>
          <div class="citation-popup-content">
            <p class="citation-popup-description">Enter a link or reference code (ISBN, DOI or other) to create a citation</p>
            <div class="citation-input-group">
              <input
                v-model="citationDialogUrl"
                class="citation-input"
                type="text"
                placeholder="Paste a URL"
              />
              <button class="citation-create-btn" :disabled="!citationDialogUrl.trim()">
                Create
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Read mode: suggestions entry toast -->
    <transition name="read-mode-toast">
      <div
        v-if="showReadModeToast"
        class="read-mode-toast"
        role="button"
        tabindex="0"
        aria-label="There are suggestions to improve this article. Click to edit."
        @click="handleReadModeToastClick"
        @keydown.enter="handleReadModeToastClick"
        @keydown.space.prevent="handleReadModeToastClick"
      >
        <cdx-icon :icon="cdxIconLightbulb" class="read-mode-toast__icon" />
        <span class="read-mode-toast__text">There are suggestions to improve this article. No prior experience needed.</span>
        <button
          class="read-mode-toast__close"
          aria-label="Dismiss"
          @click.stop="isReadModeToastDismissed = true"
        >
          <cdx-icon :icon="cdxIconClose" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import {
  CdxTypeaheadSearch,
  CdxIcon,
  CdxButton,
  CdxProgressBar,
  CdxToggleButton,
  CdxPopover,
  CdxCheckbox,
  CdxField,
  CdxTextInput,
  CdxMessage,
  CdxRadio,
  CdxDialog,
  CdxToggleSwitch
} from '@wikimedia/codex';
import {
  cdxIconMenu,
  cdxIconBell,
  cdxIconTray,
  cdxIconWatchlist,
  cdxIconUserAvatar,
  cdxIconExpand,
  cdxIconPrevious,
  cdxIconNext,
  cdxIconArrowNext,
  cdxIconCollapse,
  cdxIconArrowUp,
  cdxIconArrowDown,
  cdxIconLanguage,
  cdxIconStar,
  cdxIconEllipsis,
  cdxIconHistory,
  cdxIconSearch,
  cdxIconListBullet,
  cdxIconUndo,
  cdxIconRedo,
  cdxIconTextStyle,
  cdxIconLink,
  cdxIconQuotes,
  cdxIconAdd,
  cdxIconSpecialCharacter,
  cdxIconHelp,
  cdxIconAlert,
  cdxIconEdit,
  cdxIconEye,
  cdxIconPuzzle,
  cdxIconLightbulb,
  cdxIconClock,
  cdxIconArticle,
  cdxIconClose,
  cdxIconSuccess,
  cdxIconCheck,
  cdxIconInfo,
  cdxIconWikiText,
  cdxIconBold,
  cdxIconItalic,
  cdxIconStrikethrough,
  cdxIconUnderline,
  cdxIconCode,
  cdxIconImage,
  cdxIconTable,
  cdxIconSpeechBubble,
  cdxIconHieroglyph,
  cdxIconUserActive
} from '@wikimedia/codex-icons';
import lordeImage from '../assets/lorde-1980.png';
import scrollIcon from '../assets/scroll.svg';
import iconEditLightbulb from '../assets/icon-edit-lightbulb.svg';
import iconLightbulb from '../assets/icon-lightbulb.svg';
import wikipediaWordmark from '../assets/wikipedia-wordmark-en-25.svg';

const cdxIconConfigure = '<path fill-rule="evenodd" d="M3 4.17V2h2v2.17a3.001 3.001 0 010 5.66V18H3V9.83a3.001 3.001 0 010-5.66M4 6a1 1 0 110 2 1 1 0 010-2m11 12v-6.17a3.001 3.001 0 010-5.66V2h2v4.17a3.001 3.001 0 010 5.66V18zm2-9a1 1 0 10-2 0 1 1 0 002 0"/><path fill-rule="evenodd" d="M11 11.17a3.001 3.001 0 010 5.66V18H9v-1.17a3.001 3.001 0 010-5.66V2h2zM10 13a1 1 0 110 2 1 1 0 010-2"/>';

// Wikipedia logo - solo el globo
const wikipediaGlobe = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png";

// Audre Lorde photo - local asset
const audreImage = lordeImage;

// TypeaheadSearch state
const searchResults = ref([]);
const searchFooterUrl = ref('');
const currentSearchTerm = ref('');
const pageRoot = ref(null);

// Edit mode state
const isEditMode = ref(false);
const hasUnsavedChanges = ref(false);
const isLoading = ref(false);
const showSuggestions = ref(true);
const enableAutoScroll = ref(false);
const showSuggestionNotification = ref(false);
const showSuggestionToggle = ref(true);
const isBannerDismissed = ref(false);
const isBannerDelayReady = ref(false);
const isBannerClosing = ref(false);
const isBannerOpening = ref(false);
const forceEntryBannerSection = ref(null);
const isEditToolbarScrolled = ref(false);
const isSuggestionLightFlash = ref(false);
const isTextStyleMenuOpen = ref(false);
const isTextStyleMenuExpanded = ref(false);
const isMinervaAddMenuExpanded = ref(false);
const isMinervaAddMenuOpen = ref(false);
const isMinervaEditMenuOpen = ref(false);
const isMinervaAddLinkDialogOpen = ref(false);
const isMinervaAddCitationDialogOpen = ref(false);
const minervaToggleLocation = ref('toolbar');
const paginationManualNavigableButtonEnabled = ref(false);
const minervaOutsideMenuEnabled = ref(true);
const minervaOutsideRailEnabled = ref(true);
const minervaSourceEditingEnabled = ref(false);
const minervaToolbarToggleEnabled = computed(() => minervaToggleLocation.value === 'toolbar');
const minervaMenuToggleEnabled = computed(
  () => minervaToggleLocation.value === 'outside' && minervaOutsideMenuEnabled.value
);
const minervaRailToggleEnabled = computed(
  () => minervaToggleLocation.value === 'outside' &&
    activePrototype.value !== 'option-2' &&
    minervaOutsideRailEnabled.value
);
const filteringEnabled = ref(false);
const isPaginationAutoMode = computed(() => activePrototype.value === 'option-5');
const isPaginationManualMode = computed(() => activePrototype.value === 'option-6');
const isPaginationMode = computed(() => isPaginationAutoMode.value || isPaginationManualMode.value);
const shouldAutoAdvancePaginationSuggestion = computed(() => isPaginationAutoMode.value);
const isFirstSuggestionNavigationMode = computed(() => (
  activePrototype.value === 'option-2' || isPaginationMode.value
));
const showMinervaCollapsedCountRailToggle = computed(
  () => isMinervaSkin.value &&
    isEditMode.value &&
    activePrototype.value === 'option-1' &&
    showSuggestions.value &&
    isBannerDismissed.value &&
    toggleBadgeCount.value > 0
);
const showMinervaStandardRailToggle = computed(
  () => isMinervaSkin.value &&
    isEditMode.value &&
    !['option-1', 'option-4'].includes(activePrototype.value) &&
    !isPaginationAutoMode.value &&
    minervaRailToggleEnabled.value &&
    !showMinervaBottomRailToggle.value &&
    (!minervaMenuToggleEnabled.value || showSuggestions.value)
);
const showMinervaBottomRailToggle = computed(
  () => isMinervaSkin.value &&
    isEditMode.value &&
    (
      activePrototype.value === 'option-4' ||
      (isPaginationManualMode.value && paginationManualNavigableButtonEnabled.value)
    ) &&
    (!minervaMenuToggleEnabled.value || showSuggestions.value) &&
    minervaRailToggleEnabled.value
);
const showMinervaRailArrows = computed(
  () => isMinervaSkin.value &&
    isEditMode.value &&
    activePrototype.value === 'option-3' &&
    showSuggestions.value &&
    toggleBadgeCount.value > 0
);
const showMinervaFilterButton = computed(
  () => isMinervaSkin.value &&
    isEditMode.value &&
    filteringEnabled.value &&
    showSuggestions.value &&
    toggleBadgeCount.value > 0 &&
    !isPaginationMode.value
);
const showMinervaBottomRailToggleControl = computed(
  () => showMinervaStandardRailToggle.value && activePrototype.value === 'option-3'
);
const showMinervaTopRailToggle = computed(
  () => showMinervaStandardRailToggle.value && !showMinervaBottomRailToggleControl.value
);
const showMinervaFullPageTocRailButtonUi = computed(() => (
  showMinervaFullPageSuggestionNavigation.value &&
  isMinervaFullPageTocReady.value &&
  (
    (isMinervaFullPageTocButtonMode.value && showSuggestions.value) ||
    isMinervaFullPageExpandableRailMode.value
  )
));
const showMinervaTopRailControls = computed(
  () => showMinervaTopRailToggle.value || showMinervaFullPageTocRailButtonUi.value
);
const showMinervaBottomRailControls = computed(
  () => showMinervaBottomRailToggleControl.value ||
    showMinervaCollapsedCountRailToggle.value ||
    showMinervaBottomRailToggle.value ||
    showMinervaFilterButton.value ||
    showMinervaRailArrows.value
);
const showMinervaRail = computed(
  () => isMinervaSkin.value &&
    isEditMode.value &&
    !(isMinervaFullPageExpandableRailMode.value && isMinervaFullPageTocOpen.value) &&
    (showMinervaTopRailControls.value || showMinervaBottomRailControls.value)
);
const showMinervaEditMenuTriggerDotBadge = computed(
  () => minervaMenuToggleEnabled.value && !showSuggestions.value
);
const showDesktopFilterButton = computed(
  () => !isMinervaSkin.value &&
    isEditMode.value &&
    filteringEnabled.value &&
    showSuggestions.value &&
    !isPaginationMode.value
);
const showDesktopPaginationFilterButton = computed(
  () => !isMinervaSkin.value &&
    isEditMode.value &&
    filteringEnabled.value &&
    showSuggestions.value &&
    isPaginationMode.value &&
    toggleBadgeCount.value > 0
);
const showDesktopFeedbackControls = computed(
  () => showDesktopFilterButton.value || (activePrototype.value === 'option-3' && showSuggestions.value && !anySuggestionVisible.value)
);
const desktopPaginationIds = computed(() => getPendingSuggestionIdsForContext());
const activeDesktopPaginationSuggestionId = computed(() => {
  if (isCardExpanded.value) return 1;
  if (isCardExpanded8.value) return 8;
  if (isCardExpanded6.value) return 6;
  if (isCardExpanded2.value) return 2;
  if (isCardExpanded4.value) return 4;
  if (isCardExpanded7.value) return 7;
  if (isCardExpanded3.value) return 3;
  return hasOpenedDesktopPagination.value ? desktopPaginationIds.value[0] ?? null : null;
});
const desktopPaginationIndex = computed(() => {
  const index = desktopPaginationIds.value.indexOf(activeDesktopPaginationSuggestionId.value);
  return index >= 0 ? index : 0;
});
const desktopPaginationLabel = computed(() => (
  `${desktopPaginationIndex.value + 1} of ${desktopPaginationIds.value.length} suggestions`
));
const isDesktopPaginationPrevDisabled = computed(() => (
  desktopPaginationIds.value.length <= 1
));
const isDesktopPaginationNextDisabled = computed(() => (
  desktopPaginationIds.value.length <= 1
));
const showDesktopPaginationArrows = computed(() => (
  desktopPaginationIds.value.length > 1
));
const showDesktopPaginationControls = computed(
  () => !isMinervaSkin.value &&
    isEditMode.value &&
    isPaginationMode.value &&
    showSuggestions.value &&
    desktopPaginationIds.value.length > 0 &&
    hasOpenedDesktopPagination.value
);
const overviewSuggestionItems = computed(() => getPendingSuggestionIdsForContext().map((id) => ({
  id,
  title: ({
    1: 'Add a citation',
    2: 'Add a citation',
    3: 'Add a citation',
    4: 'Remove external link',
    6: 'Adjust heading level',
    7: 'Fix year link',
    8: 'Redirect link'
  })[id]
})));
const linkDialogTab = ref('wikipedia');
const linkDialogText = ref('');
const linkDialogQuery = ref('');
const linkDialogExternalUrl = ref('');
const linkSearchResults = ref([]);
const linkSearchFooterUrl = ref('');
const linkSearchTerm = ref('');
const citationDialogUrl = ref('');
const firstSuggestionExpansionMode = ref('none');
const isSuggestionInfoOpen = ref(false);
const isMinervaInfoSheetOpen = ref(false);
const isSuggestionGlowActive = ref(false);
const isSuggestionMarkersVisible = ref(showSuggestions.value);
const isSuggestionsFadingOut = ref(false);
const showSuggestionsDisplay = ref(showSuggestions.value);
const showMinervaToggleOffToast = ref(false);
const showMinervaToggleOnToast = ref(false);
const showMinervaMoreSuggestionsToast = ref(false);
const showMinervaZeroSuggestionsToast = ref(false);
const showPaginationNoSuggestionsToast = ref(false);
const showSuggestionSuccessToast = ref(false);
const showMinervaRedoButton = ref(false);
const minervaViewportWidth = ref(375);
const minervaToolbarAvailableWidth = ref(0);
const inlineTextStyleState = ref({
  bold: false,
  italic: false,
  strikethrough: false,
  underline: false
});
const activePrototype = ref('option-1');
const dismissedSuggestionId = ref(null);
let bannerDelayTimer = null;
let bannerCloseTimer = null;
let bannerOpenTimer = null;
const bannerReappearDelayMs = 1200;
let suggestionLightTimer = null;
let suggestionGlowTimer = null;
let suggestionMarkersTimer = null;
let suggestionFadeTimer = null;
let zeroSuggestionsBannerTimer = null;
let minervaToggleOffToastTimer = null;
let minervaToggleOnToastTimer = null;
let minervaMoreSuggestionsToastTimer = null;
let minervaZeroSuggestionsToastTimer = null;
let paginationNoSuggestionsToastTimer = null;
let suggestionSuccessToastTimer = null;
let minervaSuggestionSuccessTimer = null;
let minervaSuggestionSuccessExitTimer = null;
let minervaNoMoreSuggestionsOpenTimer = null;
let scrollReappearTimer = null;
let minervaFullPageTocShowTimer = null;
let minervaFullPageTocHideTimer = null;
let minervaFullPageTocScrollingTimer = null;
let suppressMinervaFullPageTocScrollVisibilityTimer = null;
let minervaFullPageManualScrollIntentTimer = null;
let minervaFullPageSectionsPanelInactivityTimer = null;
let minervaFullPageSectionsButtonDragMoved = false;
let minervaFullPageSectionsButtonOpenedOnPointerDown = false;
let minervaFullPageSectionsButtonWasOpenOnPointerDown = false;
let minervaFullPageSectionsButtonPendingActivation = false;
let minervaFullPageSectionsButtonSuppressNextClick = false;
let minervaFullPageSectionsButtonPointerId = null;
let minervaFullPageSectionsButtonPointerOffsetY = 22;
let minervaFullPageSectionsButtonPressStartY = 0;
let minervaFullPageTocScrollStartedAt = 0;
let isMinervaFullPageTocScrolling = false;
let autoScrollTimer = null;
let savedArticleSelectionRange = null;
let lastArticleEditableElement = null;
const isSkinMenuOpen = ref(false);
const selectedSkin = ref('vector22');
const isMinervaSkin = computed(() => selectedSkin.value === 'minerva');
const readModeSuggestionsEntry = ref('badge');
const isReadModeToastDismissed = ref(false);
const hasScrolledForToast = ref(false);

// Sections that have suggestions available
const SECTIONS_WITH_SUGGESTIONS = new Set(['early-life', 'career', 'poetry']);
function sectionHasSuggestions(sectionId) {
  return SECTIONS_WITH_SUGGESTIONS.has(sectionId);
}

// Article lock to edit
const articleLockToEdit = ref(false);

// Fixed header (Vector22 only, scroll > 150px)
const isHeaderFixed = ref(false);

// Current read section (for toast click navigation)
const currentReadSection = ref(null);
const showReadModeToast = computed(() =>
  !isEditMode.value &&
  readModeSuggestionsEntry.value === 'toast' &&
  hasScrolledForToast.value &&
  !isReadModeToastDismissed.value
);
const minervaOpenSections = ref({
  'early-life': false,
  career: false,
  poetry: false,
  prose: false,
  film: false,
  theory: false
});
const editSnapshot = ref([]);
const editUndoStack = ref([]);
const editRedoStack = ref([]);
const readModeReturnSectionId = ref(null);
const isMinervaSheetOpen = ref(false);
const activeMinervaSuggestion = ref(1);
const minervaSheetRef = ref(null);
const minervaSheetReturnDirection = ref(null);
const minervaSheetHeight = ref(0);
const minervaLastScrollY = ref(0);
const suppressMinervaSheetReturnDirection = ref(false);
let suppressMinervaSheetReturnDirectionTimer = null;

// First suggestion card states
const isCardExpanded = ref(false);
const isCardHovered = ref(false);
const isTextHovered = ref(false);

// Refs for alignment (first suggestion)
const highlightedTextRef = ref(null);
const suggestionsSidebarRef = ref(null);
const sidebarTopOffset = ref(0);
const articleFirstSectionRef = ref(null);
const suggestionsTopOffset = ref(0);

// Computed: sincronizar hover entre texto y card (first suggestion)
const isHovered = computed(() => isCardHovered.value || isTextHovered.value);

// Second suggestion card states
const isCardExpanded2 = ref(false);
const isCardHovered2 = ref(false);
const isTextHovered2 = ref(false);

// Refs for alignment (second suggestion)
const highlightedTextRef2 = ref(null);
const suggestionsSidebarRef2 = ref(null);
const sidebarTopOffset2 = ref(0);

// Computed: sincronizar hover entre texto y card (second suggestion)
const isHovered2 = computed(() => isCardHovered2.value || isTextHovered2.value);

// Third suggestion card states
const isCardExpanded3 = ref(false);
const isCardHovered3 = ref(false);
const isTextHovered3 = ref(false);
const isCardExpanded4 = ref(false);
const isCardHovered4 = ref(false);
const isTextHovered4 = ref(false);
const isCardExpanded5 = ref(false);
const isCardHovered5 = ref(false);
const isTextHovered5 = ref(false);
const isCardExpanded6 = ref(false);
const isCardHovered6 = ref(false);
const isTextHovered6 = ref(false);
const isCardExpanded7 = ref(false);
const isCardHovered7 = ref(false);
const isTextHovered7 = ref(false);
const isCardExpanded8 = ref(false);
const isCardHovered8 = ref(false);
const isTextHovered8 = ref(false);

// Refs for alignment (third suggestion)
const highlightedTextRef3 = ref(null);
const suggestionsSidebarRef3 = ref(null);
const sidebarTopOffset3 = ref(0);
const highlightedTextRef4 = ref(null);
const suggestionsSidebarRef4 = ref(null);
const sidebarTopOffset4 = ref(0);
const highlightedTextRef5 = ref(null);
const suggestionsSidebarRef5 = ref(null);
const sidebarTopOffset5 = ref(0);
const highlightedTextRef6 = ref(null);
const suggestionsSidebarRef6 = ref(null);
const sidebarTopOffset6 = ref(0);
const highlightedTextRef7 = ref(null);
const suggestionsSidebarRef7 = ref(null);
const sidebarTopOffset7 = ref(0);
const highlightedTextRef8 = ref(null);
const suggestionsSidebarRef8 = ref(null);
const sidebarTopOffset8 = ref(0);
const vectorSuggestionsControlsRef = ref(null);
const desktopSuggestionsControlsHidden = ref(false);
const hasOpenedDesktopPagination = ref(false);
const minervaToolbarScrollAreaRef = ref(null);
const textStyleMenuTriggerRef = ref(null);
const textStyleMenuPanelRef = ref(null);

// Computed: sincronizar hover entre texto y card (third suggestion)
const isHovered3 = computed(() => isCardHovered3.value || isTextHovered3.value);
const isHovered4 = computed(() => isCardHovered4.value || isTextHovered4.value);
const isHovered5 = computed(() => isCardHovered5.value || isTextHovered5.value);
const isHovered6 = computed(() => isCardHovered6.value || isTextHovered6.value);
const isHovered7 = computed(() => isCardHovered7.value || isTextHovered7.value);
const isHovered8 = computed(() => isCardHovered8.value || isTextHovered8.value);

// Citation flow states
const showCitationPopup1 = ref(false);
const showCitationPopup2 = ref(false);
const showCitationPopup3 = ref(false);
const citationUrl1 = ref('');
const citationUrl2 = ref('');
const citationUrl3 = ref('');
const citationNumber1 = ref(null); // null = no citation, number = citation created
const citationNumber2 = ref(null);
const citationNumber3 = ref(null);
const citationCounter = ref(0); // Global counter for citations
const showSuccessMessage1 = ref(false); // Show success message after citation is created
const showSuccessMessage2 = ref(false);
const showSuccessMessage3 = ref(false);
const showSuccessMessage4 = ref(false);
const minervaSuggestionSuccessState = ref(null);
const isMinervaSuggestionSuccessExiting = ref(false);
const isMinervaSheetClosing = ref(false);
const isSuggestionDeclined1 = ref(false); // Track if suggestion was declined/skipped
const isSuggestionDeclined2 = ref(false);
const isSuggestionDeclined3 = ref(false);
const isSuggestionDeclined4 = ref(false);
const isSuggestionResolved4 = ref(false);
const isSuggestionDeclined5 = ref(false);
const isSuggestionResolved5 = ref(false);
const isSuggestionDeclined6 = ref(false);
const isSuggestionResolved6 = ref(false);
const isSuggestionDeclined7 = ref(false);
const isSuggestionResolved7 = ref(false);
const isSuggestionDeclined8 = ref(false);
const isSuggestionResolved8 = ref(false);
const toneCheckActive = ref(false);
const toneCheckDismissed = ref(false);
const toneCheckHighlightRef = ref(null);
const toneCheckSidebarRef = ref(null);
const toneCheckTopOffset = ref(0);
const toneCheckEnterArmed = ref(false);
const toneCheckTriggeredByAmazing = ref(false);
const pasteCheckActive = ref(false);
const pasteCheckDismissed = ref(false);
const pasteCheckHighlightRef = ref(null);
const pasteCheckSidebarRef = ref(null);
const pasteCheckTopOffset = ref(0);
const editCheckSidebarRef = ref(null);
const isEditCheckExpanded = ref(true);
const isEditCheckHovered = ref(false);
const isEditCheckTextHovered = ref(false);
const minervaSheetMode = ref('suggestion');
const isPrototypeDialogOpen = ref(false);
const newSuggestionColorEnabled = ref(false);
const nonSelectedHighlightUnderlineEnabled = ref(false);
const editToolbarImprovementsEnabled = ref(true);
const successHighlightOnCompleteEnabled = ref(false);
const noMoreSuggestionsEmptyStateEnabled = ref(true);
const editFullPageImprovedEnabled = ref(true);
const minervaFullPageSuggestionNavigationEnabled = ref(false);
const minervaFullPageSuggestionNavigationMode = ref('toc-button');
const selectedPrototype = ref('option-5');
const selectedNavigationGroup = computed({
  get() {
    if (selectedPrototype.value === 'option-5' || selectedPrototype.value === 'option-6') {
      return 'pagination';
    }
    return selectedPrototype.value;
  },
  set(value) {
    if (value === 'pagination') {
      selectedPrototype.value = 'option-5';
      return;
    }
    selectedPrototype.value = value;
  }
});
const toastsEnabled = ref(true);
const showSuggestionBadge = ref(false);
const showSuggestionInfoPreference = ref(true);
const dontShowSuggestionInfo = ref(false);
const minervaNoMoreSuggestionsState = ref(null);
const pendingScrollSection = ref(null);
const minervaEditSectionOnly = ref(null);
const isVectorNoMoreSuggestionsDialogOpen = ref(false);
const successHighlightSuggestionIds = ref([]);
const minervaSectionBannerDismissed = ref({
  'early-life': false,
  career: false,
  poetry: false,
  prose: false,
  film: false,
  theory: false
});
const isMinervaOverviewSheetOpen = ref(false);
const isMinervaFullPageTocOpen = ref(false);
const activeMinervaFullPageTocSectionId = ref('top');
const isMinervaFullPageSectionsButtonDragging = ref(false);
const editSectionEarlyLife = ref(null);
const editSectionCareer = ref(null);
const editSectionPoetry = ref(null);
const editSectionProse = ref(null);
const editSectionFilm = ref(null);
const editSectionTheory = ref(null);
const minervaFullPageTocButtonRef = ref(null);
const minervaFullPageTocPanelRef = ref(null);
const minervaFullPageSectionsButtonRef = ref(null);
const minervaFullPageSectionsPanelRef = ref(null);
const minervaTocSubsectionTargets = {
  poetry: [
    { id: 'poetry-early-works', subsectionTitle: 'Early works' },
    { id: 'poetry-wider-recognition', subsectionTitle: 'Wider recognition' }
  ],
  prose: [
    { id: 'prose-sister-outsider', subsectionTitle: 'Sister Outsider' }
  ],
  film: [
    { id: 'film-berlin-years', subsectionTitle: 'The Berlin Years: 1984–1992' },
    { id: 'film-body-of-a-poet', subsectionTitle: 'Body of a Poet: 1995' }
  ],
  theory: [
    { id: 'theory-feminist-thought', subsectionTitle: 'Feminist thought' },
    { id: 'theory-lorde-comments', subsectionTitle: "Lorde's comments on feminism" },
    { id: 'theory-black-feminism', subsectionTitle: 'Influences on black feminism' },
    { id: 'theory-personal-identity', subsectionTitle: 'Personal identity' },
    { id: 'theory-third-wave', subsectionTitle: 'Contributions to the third-wave feminist discourse' },
    { id: 'theory-essay', subsectionTitle: 'Essay' },
    { id: 'theory-speeches', subsectionTitle: 'Speeches' },
    { id: 'theory-interview', subsectionTitle: 'Interview' }
  ]
};
const prototypeDialogPrefsStorageKey = 'suggestion-mode.prototype-dialog-prefs';
const minervaScrollIcon = scrollIcon;

function loadPrototypeDialogPrefs() {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(prototypeDialogPrefsStorageKey);
    if (!raw) return;
    const prefs = JSON.parse(raw);
    if (typeof prefs.selectedPrototype === 'string') {
      selectedPrototype.value = [ 'option-1', 'option-2' ].includes(prefs.selectedPrototype)
        ? 'option-5'
        : prefs.selectedPrototype;
    }
    if (typeof prefs.minervaToggleLocation === 'string') minervaToggleLocation.value = prefs.minervaToggleLocation;
    if (typeof prefs.paginationManualNavigableButtonEnabled === 'boolean') {
      paginationManualNavigableButtonEnabled.value = prefs.paginationManualNavigableButtonEnabled;
    }
    if (typeof prefs.filteringEnabled === 'boolean') filteringEnabled.value = prefs.filteringEnabled;
    if (typeof prefs.newSuggestionColorEnabled === 'boolean') newSuggestionColorEnabled.value = prefs.newSuggestionColorEnabled;
    if (typeof prefs.nonSelectedHighlightUnderlineEnabled === 'boolean') {
      nonSelectedHighlightUnderlineEnabled.value = prefs.nonSelectedHighlightUnderlineEnabled;
    }
    if (typeof prefs.editToolbarImprovementsEnabled === 'boolean') {
      editToolbarImprovementsEnabled.value = prefs.editToolbarImprovementsEnabled;
    }
    if (typeof prefs.successHighlightOnCompleteEnabled === 'boolean') {
      successHighlightOnCompleteEnabled.value = prefs.successHighlightOnCompleteEnabled;
    }
    if (typeof prefs.noMoreSuggestionsEmptyStateEnabled === 'boolean') {
      noMoreSuggestionsEmptyStateEnabled.value = prefs.noMoreSuggestionsEmptyStateEnabled;
    }
    if (typeof prefs.editFullPageImprovedEnabled === 'boolean') {
      editFullPageImprovedEnabled.value = prefs.editFullPageImprovedEnabled;
    }
    if (typeof prefs.minervaFullPageSuggestionNavigationEnabled === 'boolean') {
      minervaFullPageSuggestionNavigationEnabled.value = prefs.minervaFullPageSuggestionNavigationEnabled;
    }
    if (typeof prefs.minervaFullPageSuggestionNavigationMode === 'string') {
      minervaFullPageSuggestionNavigationMode.value = prefs.minervaFullPageSuggestionNavigationMode;
    }
  } catch {
    // Ignore invalid persisted dialog preferences.
  }
}

function savePrototypeDialogPrefs() {
  if (typeof window === 'undefined') return;
  const prefs = {
    selectedPrototype: selectedPrototype.value,
    minervaToggleLocation: minervaToggleLocation.value,
    paginationManualNavigableButtonEnabled: paginationManualNavigableButtonEnabled.value,
    filteringEnabled: filteringEnabled.value,
    newSuggestionColorEnabled: newSuggestionColorEnabled.value,
    nonSelectedHighlightUnderlineEnabled: nonSelectedHighlightUnderlineEnabled.value,
    editToolbarImprovementsEnabled: editToolbarImprovementsEnabled.value,
    successHighlightOnCompleteEnabled: successHighlightOnCompleteEnabled.value,
    noMoreSuggestionsEmptyStateEnabled: noMoreSuggestionsEmptyStateEnabled.value,
    editFullPageImprovedEnabled: editFullPageImprovedEnabled.value,
    minervaFullPageSuggestionNavigationEnabled: minervaFullPageSuggestionNavigationEnabled.value,
    minervaFullPageSuggestionNavigationMode: minervaFullPageSuggestionNavigationMode.value
  };
  window.localStorage.setItem(prototypeDialogPrefsStorageKey, JSON.stringify(prefs));
}

// Computed properties to validate URLs
const isValidUrl1 = computed(() => {
  const url = citationUrl1.value.trim();
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
});

const isValidUrl2 = computed(() => {
  const url = citationUrl2.value.trim();
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
});

const isValidUrl3 = computed(() => {
  const url = citationUrl3.value.trim();
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
});

// Check if all suggestions have been handled (completed or declined)
const allSuggestionsHandled = computed(() => {
  const suggestion1Handled = citationNumber1.value !== null || isSuggestionDeclined1.value;
  const suggestion2Handled = citationNumber2.value !== null || isSuggestionDeclined2.value;
  const suggestion3Handled = citationNumber3.value !== null || isSuggestionDeclined3.value;
  const suggestion4Handled = isSuggestionResolved4.value || isSuggestionDeclined4.value;
  const suggestion5Handled = isSuggestionResolved5.value || isSuggestionDeclined5.value;
  const suggestion6Handled = isSuggestionResolved6.value || isSuggestionDeclined6.value;
  const suggestion7Handled = isSuggestionResolved7.value || isSuggestionDeclined7.value;
  const suggestion8Handled = isSuggestionResolved8.value || isSuggestionDeclined8.value;
  return suggestion1Handled &&
    suggestion2Handled &&
    suggestion3Handled &&
    suggestion4Handled &&
    suggestion5Handled &&
    suggestion6Handled &&
    suggestion7Handled &&
    suggestion8Handled;
});

// Computed property to check if all suggestions are completed or declined (show empty state)
const showEmptyState = computed(() => {
  const suggestion1Done = citationNumber1.value !== null || isSuggestionDeclined1.value;
  const suggestion2Done = citationNumber2.value !== null || isSuggestionDeclined2.value;
  const suggestion3Done = citationNumber3.value !== null || isSuggestionDeclined3.value;
  const suggestion4Done = isSuggestionResolved4.value || isSuggestionDeclined4.value;
  const suggestion5Done = isSuggestionResolved5.value || isSuggestionDeclined5.value;
  const suggestion6Done = isSuggestionResolved6.value || isSuggestionDeclined6.value;
  const suggestion7Done = isSuggestionResolved7.value || isSuggestionDeclined7.value;
  const suggestion8Done = isSuggestionResolved8.value || isSuggestionDeclined8.value;
  return suggestion1Done &&
    suggestion2Done &&
    suggestion3Done &&
    suggestion4Done &&
    suggestion5Done &&
    suggestion6Done &&
    suggestion7Done &&
    suggestion8Done;
});
const shouldShowEmptyState = computed(() => showSuggestions.value && showEmptyState.value);
const isSuggestion1Pending = computed(() => (
  citationNumber1.value === null && !isSuggestionDeclined1.value && !showSuccessMessage1.value
));
const isSuggestion2Pending = computed(() => (
  citationNumber2.value === null && !isSuggestionDeclined2.value && !showSuccessMessage2.value
));
const isSuggestion3Pending = computed(() => (
  citationNumber3.value === null && !isSuggestionDeclined3.value && !showSuccessMessage3.value
));
const isSuggestion4Pending = computed(() => (
  !isSuggestionResolved4.value && !isSuggestionDeclined4.value && !showSuccessMessage4.value
));
const isSuggestion5Pending = computed(() => (
  !isSuggestionResolved5.value && !isSuggestionDeclined5.value
));
const isSuggestion6Pending = computed(() => (
  !isSuggestionResolved6.value && !isSuggestionDeclined6.value
));
const isSuggestion7Pending = computed(() => (
  !isSuggestionResolved7.value && !isSuggestionDeclined7.value
));
const isSuggestion8Pending = computed(() => (
  !isSuggestionResolved8.value && !isSuggestionDeclined8.value
));
const availableSuggestionCount = computed(() => (
  (isSuggestion1Pending.value ? 1 : 0) +
  (isSuggestion2Pending.value ? 1 : 0) +
  (isSuggestion3Pending.value ? 1 : 0) +
  (isSuggestion4Pending.value ? 1 : 0) +
  (isSuggestion5Pending.value ? 1 : 0) +
  (isSuggestion6Pending.value ? 1 : 0) +
  (isSuggestion7Pending.value ? 1 : 0) +
  (isSuggestion8Pending.value ? 1 : 0)
));
const sectionSuggestionCount = computed(() => {
  if (!isMinervaSkin.value || !minervaEditSectionOnly.value) {
    return availableSuggestionCount.value;
  }
  if (minervaEditSectionOnly.value === 'career') {
    return isSuggestion1Pending.value ? 1 : 0;
  }
  if (minervaEditSectionOnly.value === 'poetry') {
    return (isSuggestion2Pending.value ? 1 : 0) +
      (isSuggestion4Pending.value ? 1 : 0) +
      (isSuggestion6Pending.value ? 1 : 0) +
      (isSuggestion8Pending.value ? 1 : 0);
  }
  if (minervaEditSectionOnly.value === 'prose') {
    return (isSuggestion3Pending.value ? 1 : 0) + (isSuggestion7Pending.value ? 1 : 0);
  }
  return 0;
});
const completedSuggestionCount = computed(() => (
  (citationNumber1.value !== null ? 1 : 0) +
  (citationNumber2.value !== null ? 1 : 0) +
  (citationNumber3.value !== null ? 1 : 0) +
  (isSuggestionResolved4.value ? 1 : 0) +
  (isSuggestionResolved6.value ? 1 : 0) +
  (isSuggestionResolved7.value ? 1 : 0) +
  (isSuggestionResolved8.value ? 1 : 0)
));
const allSuggestionsDeclined = computed(() => (
  isSuggestionDeclined1.value &&
  isSuggestionDeclined2.value &&
  isSuggestionDeclined3.value &&
  isSuggestionDeclined4.value &&
  isSuggestionDeclined6.value &&
  isSuggestionDeclined7.value &&
  isSuggestionDeclined8.value
));
const otherSuggestionCount = computed(() => {
  if (!isMinervaSkin.value || !minervaEditSectionOnly.value) {
    return 0;
  }
  return Math.max(availableSuggestionCount.value - sectionSuggestionCount.value, 0);
});
const showOtherSectionBadge = computed(() => (
  isMinervaSkin.value && minervaEditSectionOnly.value && otherSuggestionCount.value > 0
));
const bannerSuggestionCount = computed(() => (
  isMinervaSkin.value && minervaEditSectionOnly.value
    ? sectionSuggestionCount.value
    : availableSuggestionCount.value
));
const showToolbarToggle = computed(() => (
  !isMinervaSkin.value &&
  (showSuggestionToggle.value || (!showSuggestionToggle.value && !showSuggestions.value))
));
const isArrowOnceMode = computed(() => (
  isFirstSuggestionNavigationMode.value || activePrototype.value === 'option-4' || activePrototype.value === 'option-3'
));
const isArrowBounceActive = ref(true);
const showBannerArrowUp = ref(false);
const showBannerArrowDown = ref(true);
const showBannerPrimaryArrowUp = ref(false);
const hasUsedOption4Button = ref(false);
const isAutoScrollActive = ref(false);
const showMinervaArrowOnly = ref(false);
const minervaAddMenuTriggerRef = ref(null);
const minervaAddMenuPanelRef = ref(null);
const minervaEditMenuTriggerRef = ref(null);
const minervaEditMenuPanelRef = ref(null);
const minervaEditMenuEllipsisRef = ref(null);
const minervaRailToggleRef = ref(null);
const showMinervaRailToMenuBadgeAnimation = ref(false);
const minervaRailToMenuBadgeStyle = ref({});
let minervaRailToMenuBadgeTimer = null;
const suppressMinervaBannerDuringViewMoreSuggestions = ref(false);
let suppressMinervaBannerDuringViewMoreSuggestionsTimer = null;
const firstSuggestionAutoExpandedId = ref(null);
const firstSuggestionBounceActiveId = ref(null);
const firstSuggestionBounceDoneId = ref(null);
const toggleBadgeCount = computed(() => (
  isMinervaSkin.value && minervaEditSectionOnly.value
    ? sectionSuggestionCount.value
    : availableSuggestionCount.value
));
const badgePulse = ref(false);
const showToggleBadge = computed(() => {
  if (activePrototype.value === 'option-1') {
    return toggleBadgeCount.value > 0;
  }
  if (isArrowOnceMode.value) {
    return toggleBadgeCount.value > 0 || showSuggestions.value;
  }
  return toggleBadgeCount.value > 0 &&
    !shouldShowBanner.value &&
    !showSuggestions.value;
});
const showToggleBadgeZero = computed(() => (
  isArrowOnceMode.value && toggleBadgeCount.value === 0
));
const showMinervaNoMoreSuggestionsState = computed(() => (
  noMoreSuggestionsEmptyStateEnabled.value &&
  isMinervaSkin.value &&
  isEditMode.value &&
  showSuggestions.value &&
  Boolean(minervaNoMoreSuggestionsState.value)
));
const isMinervaFullPageTocReady = ref(false);
const showMinervaFullPageTocOnScroll = ref(false);
const isMinervaFullPageManualScrollIntent = ref(false);
const minervaFullPageSectionsButtonTop = ref(0);
const minervaFullPageTocExpandedItems = ref({
  poetry: false,
  prose: false,
  film: false,
  theory: false
});
const isMinervaFullPageTocButtonMode = computed(() => (
  minervaFullPageSuggestionNavigationMode.value === 'toc-button'
));
const isMinervaFullPageExpandableRailMode = computed(() => (
  minervaFullPageSuggestionNavigationMode.value === 'expandable-rail'
));
const isMinervaFullPageSectionsButtonMode = computed(() => (
  minervaFullPageSuggestionNavigationMode.value === 'scroll-button'
));
const showMinervaFullPageSuggestionNavigation = computed(() => (
  minervaFullPageSuggestionNavigationEnabled.value &&
  isMinervaSkin.value &&
  isEditMode.value &&
  !minervaEditSectionOnly.value
));
const showMinervaFullPageSuggestionNavigationUi = computed(() => (
  showMinervaFullPageSuggestionNavigation.value &&
  isMinervaFullPageTocReady.value
));
const hasMinervaExpandedSheet = computed(() => (
  isMinervaSkin.value &&
  isMinervaSheetOpen.value &&
  (minervaSheetMode.value === 'suggestion' || minervaSheetMode.value === 'edit-check')
));
const isMinervaFullPageExpandableRailOpen = computed(() => (
  showMinervaFullPageSuggestionNavigation.value &&
  isMinervaFullPageExpandableRailMode.value &&
  isMinervaFullPageTocOpen.value
));
const showMinervaFullPageTocButtonUi = computed(() => (
  showMinervaFullPageTocRailButtonUi.value ||
  showMinervaFullPageTocFloatingButtonUi.value
));
const showMinervaFullPageTocFloatingButtonUi = computed(() => (
  showMinervaFullPageSuggestionNavigationUi.value &&
  isMinervaFullPageTocButtonMode.value &&
  !showSuggestions.value &&
  showMinervaFullPageTocOnScroll.value &&
  !hasMinervaExpandedSheet.value
));
const showMinervaFullPageExpandableRailUi = computed(() => (
  showMinervaFullPageSuggestionNavigation.value &&
  isMinervaFullPageExpandableRailMode.value &&
  isMinervaFullPageTocOpen.value
));
const showMinervaFullPageTocDrawerUi = computed(() => (
  isMinervaFullPageTocButtonMode.value &&
  isMinervaFullPageTocOpen.value &&
  showMinervaFullPageSuggestionNavigation.value
));
const showMinervaFullPageSectionsButtonUi = computed(() => (
  showMinervaFullPageSuggestionNavigationUi.value &&
  isMinervaFullPageSectionsButtonMode.value &&
  showMinervaFullPageTocOnScroll.value &&
  !hasMinervaExpandedSheet.value
));
const minervaFullPageTocTopOffset = computed(() => (
  `${editToolbarImprovementsEnabled.value ? 56 : 50}px`
));
const minervaFullPageSectionsNavTopOffset = computed(() => (
  `${editToolbarImprovementsEnabled.value ? 56 : 50}px`
));
const minervaFullPageSectionsPanelTopOffset = computed(() => {
  const topOffset = Number.parseFloat(minervaFullPageSectionsNavTopOffset.value) || 0;
  return `${-topOffset}px`;
});
const minervaFullPageTocDrawerTopOffset = computed(() => (
  `${editToolbarImprovementsEnabled.value ? 48 : 44}px`
));
const minervaFullPageSectionsButtonTopOffset = computed(() => (
  `${minervaFullPageSectionsButtonTop.value}px`
));
function getMinervaTocSectionIdFromNode(node) {
  const element = node instanceof HTMLElement
    ? node
    : node?.parentElement;
  if (!element) return null;
  const sectionId = element.closest('.minerva-edit-section')?.dataset?.section;
  if (sectionId) {
    return sectionId;
  }
  if (element.closest('.article-first-section')) {
    return 'top';
  }
  if (element.closest('.article-content-edit')) {
    return 'top';
  }
  return null;
}
function getMinervaFullPageTocItemIdFromNode(node) {
  const element = node instanceof HTMLElement
    ? node
    : node?.parentElement;
  if (!(element instanceof HTMLElement)) return null;
  const sectionId = getMinervaTocSectionIdFromNode(element);
  if (!sectionId || sectionId === 'top') {
    return sectionId;
  }
  const sectionChildren = minervaTocSubsectionTargets[sectionId] || [];
  if (!sectionChildren.length || typeof window === 'undefined') {
    return sectionId;
  }
  const elementTop = element.getBoundingClientRect().top + window.scrollY;
  let activeChildId = null;
  let activeChildTop = Number.NEGATIVE_INFINITY;
  sectionChildren.forEach((child) => {
    const target = getMinervaFullPageTocTargetElement(child);
    if (!(target instanceof HTMLElement)) return;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    if (targetTop <= elementTop && targetTop > activeChildTop) {
      activeChildTop = targetTop;
      activeChildId = child.id;
    }
  });
  return activeChildId ?? sectionId;
}
const minervaSectionSuggestionCounts = computed(() => {
  const counts = {
    top: 0,
    'early-life': 0,
    career: 0,
    poetry: 0,
    prose: 0,
    film: 0,
    theory: 0
  };
  getPendingSuggestionIdsForContext().forEach((suggestionId) => {
    const target = getSuggestionRefById(suggestionId)?.value;
    const sectionId = getMinervaTocSectionIdFromNode(target);
    if (sectionId && Object.prototype.hasOwnProperty.call(counts, sectionId)) {
      counts[sectionId] += 1;
    }
  });
  return counts;
});
const minervaTocItemIdsWithEditChecks = computed(() => {
  const itemIds = new Set();
  const collectItemId = (node) => {
    const itemId = getMinervaFullPageTocItemIdFromNode(node);
    if (itemId) {
      itemIds.add(itemId);
    }
  };
  if (toneCheckActive.value && toneCheckHighlightRef.value?.isConnected) {
    collectItemId(toneCheckHighlightRef.value);
  }
  if (pasteCheckActive.value && pasteCheckHighlightRef.value?.isConnected) {
    collectItemId(pasteCheckHighlightRef.value);
  }
  return itemIds;
});
const minervaFullPageTocItems = computed(() => {
  const sectionCounts = minervaSectionSuggestionCounts.value;
  const poetryEarlyWorksCount = [ isSuggestion8Pending.value ].filter(Boolean).length;
  const poetryWiderRecognitionCount = [ isSuggestion6Pending.value, isSuggestion2Pending.value, isSuggestion4Pending.value ]
    .filter(Boolean)
    .length;
  const proseSisterOutsiderCount = [ isSuggestion3Pending.value ].filter(Boolean).length;
  const hasEditCheck = (itemId) => minervaTocItemIdsWithEditChecks.value.has(itemId);
  return [
    { id: 'top', label: '(Top)', count: sectionCounts.top, sectionId: 'top', hasEditCheck: hasEditCheck('top') },
    { id: 'early-life', label: 'Early life', count: sectionCounts['early-life'], sectionId: 'early-life', hasEditCheck: hasEditCheck('early-life') },
    { id: 'career', label: 'Career', count: sectionCounts.career, sectionId: 'career', hasEditCheck: hasEditCheck('career') },
    {
      id: 'poetry',
      label: 'Poetry',
      count: sectionCounts.poetry,
      sectionId: 'poetry',
      hasEditCheck: hasEditCheck('poetry'),
      children: [
        {
          id: 'poetry-early-works',
          label: 'Early works',
          count: poetryEarlyWorksCount,
          sectionId: 'poetry',
          subsectionTitle: 'Early works',
          hasEditCheck: hasEditCheck('poetry-early-works')
        },
        {
          id: 'poetry-wider-recognition',
          label: 'Wider recognition',
          count: poetryWiderRecognitionCount,
          sectionId: 'poetry',
          subsectionTitle: 'Wider recognition',
          hasEditCheck: hasEditCheck('poetry-wider-recognition')
        }
      ]
    },
    {
      id: 'prose',
      label: 'Prose',
      count: sectionCounts.prose,
      sectionId: 'prose',
      hasEditCheck: hasEditCheck('prose'),
      children: [
        {
          id: 'prose-sister-outsider',
          label: 'Sister Outsider',
          count: proseSisterOutsiderCount,
          sectionId: 'prose',
          subsectionTitle: 'Sister Outsider',
          hasEditCheck: hasEditCheck('prose-sister-outsider')
        }
      ]
    },
    {
      id: 'film',
      label: 'Film',
      count: sectionCounts.film,
      sectionId: 'film',
      hasEditCheck: hasEditCheck('film'),
      children: [
        {
          id: 'film-berlin-years',
          label: 'The Berlin years',
          count: 0,
          sectionId: 'film',
          subsectionTitle: 'The Berlin Years: 1984–1992',
          hasEditCheck: hasEditCheck('film-berlin-years')
        },
        {
          id: 'film-body-of-a-poet',
          label: 'Body of a Poet',
          count: 0,
          sectionId: 'film',
          subsectionTitle: 'Body of a Poet: 1995',
          hasEditCheck: hasEditCheck('film-body-of-a-poet')
        }
      ]
    },
    {
      id: 'theory',
      label: 'Theory',
      count: sectionCounts.theory,
      sectionId: 'theory',
      hasEditCheck: hasEditCheck('theory'),
      children: [
        {
          id: 'theory-feminist-thought',
          label: 'Feminist thought',
          count: 0,
          sectionId: 'theory',
          subsectionTitle: 'Feminist thought',
          hasEditCheck: hasEditCheck('theory-feminist-thought')
        },
        {
          id: 'theory-lorde-comments',
          label: "Lorde's comments on feminism",
          count: 0,
          sectionId: 'theory',
          subsectionTitle: "Lorde's comments on feminism",
          hasEditCheck: hasEditCheck('theory-lorde-comments')
        },
        {
          id: 'theory-black-feminism',
          label: 'Influences on black feminism',
          count: 0,
          sectionId: 'theory',
          subsectionTitle: 'Influences on black feminism',
          hasEditCheck: hasEditCheck('theory-black-feminism')
        },
        {
          id: 'theory-personal-identity',
          label: 'Personal identity',
          count: 0,
          sectionId: 'theory',
          subsectionTitle: 'Personal identity',
          hasEditCheck: hasEditCheck('theory-personal-identity')
        },
        {
          id: 'theory-third-wave',
          label: 'Contributions to the third-wave feminist discourse',
          count: 0,
          sectionId: 'theory',
          subsectionTitle: 'Contributions to the third-wave feminist discourse',
          hasEditCheck: hasEditCheck('theory-third-wave')
        },
        {
          id: 'theory-essay',
          label: 'Essay',
          count: 0,
          sectionId: 'theory',
          subsectionTitle: 'Essay',
          hasEditCheck: hasEditCheck('theory-essay')
        },
        {
          id: 'theory-speeches',
          label: 'Speeches',
          count: 0,
          sectionId: 'theory',
          subsectionTitle: 'Speeches',
          hasEditCheck: hasEditCheck('theory-speeches')
        },
        {
          id: 'theory-interview',
          label: 'Interview',
          count: 0,
          sectionId: 'theory',
          subsectionTitle: 'Interview',
          hasEditCheck: hasEditCheck('theory-interview')
        }
      ]
    }
  ];
});
const minervaFullPageTocPathMap = computed(() => {
  const pathMap = {};
  const visit = (items, path = []) => {
    items.forEach((item) => {
      const nextPath = [ ...path, item.id ];
      pathMap[item.id] = nextPath;
      if (item.children?.length) {
        visit(item.children, nextPath);
      }
    });
  };
  visit(minervaFullPageTocItems.value);
  return pathMap;
});
const minervaFullPageTocFlatItems = computed(() => {
  const flatItems = [];
  const visit = (items) => {
    items.forEach((item) => {
      flatItems.push(item);
      if (item.children?.length) {
        visit(item.children);
      }
    });
  };
  visit(minervaFullPageTocItems.value);
  return flatItems;
});
const minervaFullPageSectionItems = computed(() => {
  const items = [];
  const visit = (tocItems, level = 0) => {
    tocItems.forEach((item) => {
      items.push({
        id: item.id,
        label: item.label,
        count: item.count,
        sectionId: item.sectionId,
        subsectionTitle: item.subsectionTitle,
        hasEditCheck: item.hasEditCheck,
        level
      });
      if (item.children?.length) {
        visit(item.children, level + 1);
      }
    });
  };
  visit(minervaFullPageTocItems.value);
  return items;
});
const minervaExpandableRailItems = computed(() => (
  minervaFullPageTocItems.value.map((item) => ({
    ...item,
    checkCount: [
      item.hasEditCheck ? 1 : 0,
      ...(item.children || []).map((child) => (child.hasEditCheck ? 1 : 0))
    ].reduce((sum, count) => sum + count, 0)
  }))
));
const minervaFullPageTocActivePathIds = computed(() => (
  minervaFullPageTocPathMap.value[activeMinervaFullPageTocSectionId.value] || []
));
const isMinervaNoMoreSuggestionsSectionState = computed(() => (
  showMinervaNoMoreSuggestionsState.value &&
  minervaNoMoreSuggestionsState.value === 'section'
));
const isMinervaNoMoreSuggestionsArticleState = computed(() => (
  showMinervaNoMoreSuggestionsState.value &&
  minervaNoMoreSuggestionsState.value === 'article'
));
const completedSuggestionCountLabel = computed(() => (
  `${completedSuggestionCount.value} suggestion${completedSuggestionCount.value === 1 ? '' : 's'} completed`
));
const minervaNoMoreSuggestionsDescription = computed(() => {
  if (isMinervaNoMoreSuggestionsSectionState.value) {
    return 'You’ve reviewed all suggestions in this section. Continue completing suggestions in other sections of this article.';
  }
  if (isMinervaNoMoreSuggestionsArticleState.value) {
    return `You’ve reviewed all suggestions in this article. You can now publish your ${completedSuggestionCountLabel.value} or continue editing.`;
  }
  return '';
});
const vectorNoMoreSuggestionsDescription = computed(() => (
  `You’ve reviewed all suggestions in this article. You can now publish your ${completedSuggestionCountLabel.value} or continue editing.`
));
const minervaSuggestionSuccessCopy = {
  1: {
    title: 'Citation added',
    description: 'This information now has a reliable source. Thank you for improving this article.'
  },
  2: {
    title: 'Citation added',
    description: 'This information now has a reliable source. Thank you for improving this article.'
  },
  3: {
    title: 'Citation added',
    description: 'This information now has a reliable source. Thank you for improving this article.'
  },
  4: {
    title: 'External link removed',
    description: 'This article now stays focused on encyclopedic content. Thank you for improving this article.'
  },
  5: {
    title: 'Link updated',
    description: 'This link now points readers to the intended topic. Thank you for improving this article.'
  },
  6: {
    title: 'Heading adjusted',
    description: 'This heading now fits the article structure better. Thank you for improving this article.'
  },
  7: {
    title: 'Year link fixed',
    description: 'This year now stays as plain text to keep the article focused. Thank you for improving this article.'
  },
  8: {
    title: 'Redirect link fixed',
    description: 'This link now points directly to the intended page. Thank you for improving this article.'
  }
};
const isMinervaSuggestionSuccessState = computed(() => (
  isMinervaSkin.value &&
  minervaSheetMode.value === 'suggestion' &&
  isMinervaSheetOpen.value &&
  Boolean(minervaSuggestionSuccessState.value) &&
  minervaSuggestionSuccessState.value.id === activeMinervaSuggestion.value
));
const minervaSuggestionSuccessTitle = computed(() => (
  minervaSuggestionSuccessState.value?.title || ''
));
const minervaSuggestionSuccessDescription = computed(() => (
  minervaSuggestionSuccessState.value?.description || ''
));
const minervaSheetTitle = computed(() => {
  if (isMinervaSuggestionSuccessState.value) return minervaSuggestionSuccessTitle.value;
  if (showMinervaNoMoreSuggestionsState.value) return 'No more suggestions';
  if (shouldShowEmptyState.value) return 'No suggestions';
  if (activeMinervaSuggestion.value === 4) return 'Remove external link';
  if (activeMinervaSuggestion.value === 6) return 'Adjust heading level';
  if (activeMinervaSuggestion.value === 7) return 'Fix year link';
  if (activeMinervaSuggestion.value === 8) return 'Redirect link';
  return 'Add a citation';
});
const minervaToggleBottom = computed(() => {
  return '16px';
});
const anySuggestionVisible = ref(false);
const shouldShowToasts = computed(() => (
  isMinervaSkin.value &&
  (activePrototype.value === 'option-1' ||
    activePrototype.value === 'option-2' ||
    activePrototype.value === 'option-3' ||
    isPaginationMode.value)
));
const shouldShowBanner = computed(() => {
  if (!showSuggestionNotification.value) return false;
  if (
    isArrowOnceMode.value &&
    isMinervaSkin.value &&
    minervaEditSectionOnly.value === 'poetry' &&
    forceEntryBannerSection.value === 'poetry'
  ) {
    return true;
  }
  if (isArrowOnceMode.value && isMinervaSkin.value && minervaEditSectionOnly.value) {
    const sectionToSuggestionId = {
      career: 1,
      poetry: 8,
      prose: 7,
      theory: 5
    };
    const sectionId = minervaEditSectionOnly.value;
    const suggestionId = sectionToSuggestionId[sectionId];
    const targetRef = getSuggestionRefById(suggestionId);
    if (targetRef && targetRef.value) {
      return !isTargetVisibleInViewport(targetRef.value);
    }
    return false;
  }
  if (!isArrowOnceMode.value) {
    if (!showSuggestionToggle.value && !showSuggestions.value) return false;
    if (showSuggestionToggle.value && !showSuggestions.value) return false;
  }
  if (isPaginationMode.value) {
    return !isAnyPendingSuggestionVisibleInViewport();
  }
  if (activePrototype.value === 'option-2') {
    return !isFirstPendingSuggestionVisibleInViewport();
  }
  return !anySuggestionVisible.value;
});
const bannerTextSuffix = computed(() => {
  if (isMinervaSkin.value && minervaEditSectionOnly.value) {
    return 'available in this section';
  }
  if (!showSuggestionToggle.value) {
    return 'available for improving this article';
  }
  return isMinervaSkin.value
    ? 'available'
    : 'available for improving this article';
});
const bannerCountLabel = computed(() => (
  bannerSuggestionCount.value === 1 ? 'suggestion' : 'suggestions'
));
const bannerTextRemainder = computed(() => bannerTextSuffix.value);
const bannerButtonLabel = computed(() => {
  if (isMinervaSkin.value && !showSuggestionToggle.value) {
    return showSuggestions.value ? 'Hide' : 'Show';
  }
  return showSuggestions.value ? 'Hide suggestions' : 'Show suggestions';
});
const showSuggestionInfo = computed(() => (
  activePrototype.value === 'option-1' && showSuggestionInfoPreference.value
));
const isToneCheckMode = computed(() => toneCheckActive.value);
const isPasteCheckMode = computed(() => pasteCheckActive.value);
const activeEditCheckTypeOverride = ref(null);
const activeEditCheckType = computed(() => {
  if (activeEditCheckTypeOverride.value === 'paste' && isPasteCheckMode.value) return 'paste';
  if (activeEditCheckTypeOverride.value === 'tone' && isToneCheckMode.value) return 'tone';
  if (isPasteCheckMode.value) return 'paste';
  if (isToneCheckMode.value) return 'tone';
  return null;
});
const isEditCheckMode = computed(() => Boolean(activeEditCheckType.value));
const isEditCheckSheet = computed(() => (
  isMinervaSkin.value ? (minervaSheetMode.value === 'edit-check' && isEditCheckMode.value) : isEditCheckMode.value
));
const editCheckTitle = computed(() => {
  if (activeEditCheckType.value === 'paste') return 'Pasted content';
  if (activeEditCheckType.value === 'tone') return 'Revise tone';
  return '';
});
const editCheckTopOffset = computed(() => (
  activeEditCheckType.value === 'paste' ? pasteCheckTopOffset.value : toneCheckTopOffset.value
));
const isEditCheckExpandedDisplay = computed(() => (
  isMinervaSkin.value ? true : isEditCheckExpanded.value
));
const isEditCheckSheetExpanded = computed(() => (
  isMinervaSkin.value ? (isMinervaSheetOpen.value && minervaSheetMode.value === 'edit-check') : isEditCheckExpanded.value
));
const isEditCheckHighlightHovered = computed(() => (
  isEditCheckHovered.value || isEditCheckTextHovered.value
));
const suggestionColorStyles = computed(() => {
  if (newSuggestionColorEnabled.value) {
    return {
      '--suggestion-color': '#A70EEB',
      '--suggestion-color-subtle': '#F7E5FF',
      '--suggestion-color-subtle-hover': '#F7E5FF',
      '--suggestion-color-subtle-active': '#F7E5FF',
      '--suggestion-border-hover': '#A70EEB',
      '--suggestion-border-active': '#A70EEB',
      '--suggestion-border-selected': '#A70EEB'
    };
  }
  return {
    '--suggestion-color': '#36C',
    '--suggestion-color-subtle': '#E8EEFF',
    '--suggestion-color-subtle-hover': '#DBE8FF',
    '--suggestion-color-subtle-active': '#C5D7FF',
    '--suggestion-border-hover': '#3056A9',
    '--suggestion-border-active': '#233566',
    '--suggestion-border-selected': '#6485D1'
  };
});
const nonSelectedHighlightClass = computed(() => (
  nonSelectedHighlightUnderlineEnabled.value ? 'feedback-underlined-unselected' : ''
));
const isSuggestionSheetMode = computed(() => (
  showSuggestionsDisplay.value && !isEditCheckSheet.value
));
const showMinervaBanner = computed(() => {
  if (!isMinervaSkin.value) return false;
  if (!isEditMode.value) return false;
  if (suppressMinervaBannerDuringViewMoreSuggestions.value) return false;
  if (['option-3', 'option-4'].includes(activePrototype.value)) return false;
  if (showMinervaArrowOnly.value) return false;
  if (!isArrowOnceMode.value && !showSuggestionsDisplay.value) return false;
  if (isArrowOnceMode.value && minervaEditSectionOnly.value) {
    if (minervaSectionBannerDismissed.value[minervaEditSectionOnly.value]) {
      return false;
    }
  }
  if (!shouldShowBanner.value || !isBannerDelayReady.value || isBannerDismissed.value) return false;
  if (isArrowOnceMode.value && bannerSuggestionCount.value === 0) {
    return false;
  }
  if (isArrowOnceMode.value && !showSuggestions.value) {
    return false;
  }
  if (showSuggestions.value && bannerSuggestionCount.value === 0) return true;
  if (minervaEditSectionOnly.value) {
    return sectionSuggestionCount.value > 0;
  }
  return availableSuggestionCount.value > 0;
});
const showVectorHelpButton = computed(() => (
  !isMinervaSkin.value &&
  isEditMode.value &&
  activePrototype.value !== 'option-1' && !isPaginationMode.value && !isArrowOnceMode.value
));
const showMinervaHelpButton = computed(() => (
  isMinervaSkin.value &&
  isEditMode.value &&
  activePrototype.value !== 'option-1' && !isPaginationMode.value && !isArrowOnceMode.value
));
const minervaToolbarSlotCount = computed(() => {
  const availableWidth = minervaToolbarAvailableWidth.value || Math.max(0, minervaViewportWidth.value - 88);
  return Math.floor(availableWidth / 44);
});
const minervaImprovedVisibleActionCount = computed(() => (
  4 + // Undo + Text styles + Add + overflow menu
  (showMinervaRedoButton.value ? 1 : 0) +
  (minervaToolbarToggleEnabled.value ? 1 : 0) +
  (showMinervaResponsiveTopLevelLink.value ? 1 : 0) +
  (showMinervaResponsiveTopLevelCite.value ? 1 : 0)
));
const minervaImprovedCoreActionCount = computed(() => (
  4 + // Undo + Text styles + Add + overflow menu
  (showMinervaRedoButton.value ? 1 : 0) +
  (minervaToolbarToggleEnabled.value ? 1 : 0)
));
const minervaToolbarOverflowing = computed(() => (
  editToolbarImprovementsEnabled.value &&
  minervaToolbarSlotCount.value < minervaImprovedVisibleActionCount.value
));
const showMinervaResponsiveTopLevelLink = computed(() => (
  !editToolbarImprovementsEnabled.value ||
  minervaToolbarSlotCount.value >= minervaImprovedCoreActionCount.value + 1
));
const showMinervaResponsiveTopLevelCite = computed(() => (
  !editToolbarImprovementsEnabled.value ||
  (
    showMinervaResponsiveTopLevelLink.value &&
    minervaToolbarSlotCount.value >= minervaImprovedCoreActionCount.value + 2
  )
));
const minervaAddMenuItems = computed(() => ([
  ...(editToolbarImprovementsEnabled.value
    ? [
        ...(!showMinervaResponsiveTopLevelLink.value ? [
          { value: 'link', label: 'Link', icon: cdxIconLink }
        ] : []),
        ...(!showMinervaResponsiveTopLevelCite.value ? [
          { value: 'cite', label: 'Cite', icon: cdxIconQuotes }
        ] : []),
        ...(!showMinervaResponsiveTopLevelLink.value || !showMinervaResponsiveTopLevelCite.value ? [
          { type: 'divider', value: 'minerva-add-divider-primary' }
        ] : []),
        { value: 'images-media', label: 'Images and media', icon: cdxIconImage },
        { value: 'table', label: 'Table', icon: cdxIconTable },
        { type: 'divider', value: 'minerva-add-divider-insert' },
        { value: 'invisible-comment', label: 'Invisible comment', icon: cdxIconSpeechBubble },
        { type: 'divider', value: 'minerva-add-divider-characters' },
        { value: 'special-characters', label: 'Special characters', icon: cdxIconSpecialCharacter },
        { value: 'hieroglyphs', label: 'Hieroglyphs', icon: cdxIconHieroglyph },
        { value: 'code-block', label: 'Code block', icon: cdxIconCode },
        { value: 'language', label: 'Language', icon: cdxIconLanguage }
      ]
    : [
        { value: 'cite', label: 'Cite', icon: cdxIconQuotes },
        { value: 'link', label: 'Link', icon: cdxIconLink }
      ])
]));
const visibleMinervaAddMenuItems = computed(() => minervaAddMenuItems.value);
const trackedInlineTextStyleCommands = {
  bold: 'bold',
  italic: 'italic',
  strikethrough: 'strikeThrough',
  underline: 'underline'
};
const textStyleMenuItems = [
  { value: 'bold', label: 'Bold', icon: cdxIconBold },
  { value: 'italic', label: 'Italic', icon: cdxIconItalic },
  { value: 'strikethrough', label: 'Strikethrough', icon: cdxIconStrikethrough },
  { value: 'underline', label: 'Underline', icon: cdxIconUnderline },
  { type: 'divider', value: 'text-style-divider-1' },
  { value: 'code', label: 'Computer code', icon: cdxIconCode }
];
const visibleMinervaTextStyleMenuItems = computed(() => (
  isTextStyleMenuExpanded.value
    ? textStyleMenuItems
    : textStyleMenuItems.slice(0, 4)
));
const showMinervaTextStyleMenuToggle = computed(() => (
  textStyleMenuItems.filter((item) => item.type !== 'divider').length > 4
));
const minervaPaginationIds = computed(() => {
  const ids = [];
  if (citationNumber1.value === null && !isSuggestionDeclined1.value && !showSuccessMessage1.value) {
    ids.push(1);
  }
  if (citationNumber2.value === null && !isSuggestionDeclined2.value && !showSuccessMessage2.value) {
    ids.push(2);
  }
  if (!isSuggestionResolved4.value && !isSuggestionDeclined4.value && !showSuccessMessage4.value) {
    ids.push(4);
  }
  if (citationNumber3.value === null && !isSuggestionDeclined3.value && !showSuccessMessage3.value) {
    ids.push(3);
  }
  return ids;
});
const minervaPaginationIdsForActiveSuggestion = computed(() => {
  if (isPaginationMode.value) {
    return getPendingSuggestionIdsForContext();
  }
  if (activeMinervaSuggestion.value === 2 || activeMinervaSuggestion.value === 4) {
    return minervaPaginationIds.value.filter((id) => id === 2 || id === 4);
  }
  return [];
});
const editCheckPaginationTypes = computed(() => {
  const types = [];
  if (pasteCheckActive.value) types.push('paste');
  if (toneCheckActive.value) types.push('tone');
  return types;
});
const minervaPaginationItems = computed(() => (
  isEditCheckSheet.value
    ? editCheckPaginationTypes.value
    : minervaPaginationIdsForActiveSuggestion.value
));
const minervaPaginationTotal = computed(() => minervaPaginationItems.value.length);
const minervaPaginationIndex = computed(() => {
  const activeItem = isEditCheckSheet.value ? activeEditCheckType.value : activeMinervaSuggestion.value;
  const index = minervaPaginationItems.value.indexOf(activeItem);
  return index >= 0 ? index : 0;
});
const minervaPaginationLabel = computed(() => (
  isMinervaSuggestionSuccessState.value
    ? 'Moving to next suggestion...'
    : `${minervaPaginationIndex.value + 1} of ${minervaPaginationTotal.value} ${isEditCheckSheet.value ? 'checks' : 'suggestions'}`
));
const minervaSuggestionHeaderIndicatorLabel = computed(() => {
  const ids = getPendingSuggestionIdsForContext();
  if (!ids.length) return '';
  const index = ids.indexOf(activeMinervaSuggestion.value);
  return `${index >= 0 ? index + 1 : 1} of ${ids.length}`;
});
const showMinervaSuggestionHeaderIndicator = computed(() => (
  isMinervaSkin.value &&
  isMinervaSheetOpen.value &&
  !isEditCheckSheet.value &&
  !isMinervaSuggestionSuccessState.value &&
  !showMinervaNoMoreSuggestionsState.value &&
  activePrototype.value === 'option-3' &&
  getPendingSuggestionIdsForContext().length > 0
));
const showMinervaSheetReturnArrow = computed(() => (
  Boolean(minervaSheetReturnDirection.value) &&
  !isMinervaSuggestionSuccessState.value &&
  !isAutoScrollActive.value &&
  !(activePrototype.value === 'option-3' && !isEditCheckSheet.value)
));
const isMinervaPaginationPrevDisabled = computed(() => (
  isMinervaSuggestionSuccessState.value || minervaPaginationTotal.value <= 1
));
const isMinervaPaginationNextDisabled = computed(() => (
  isMinervaSuggestionSuccessState.value || minervaPaginationTotal.value <= 1
));
const showMinervaPaginationArrows = computed(() => (
  !isMinervaSuggestionSuccessState.value && minervaPaginationTotal.value > 1
));
const showMinervaPagination = computed(() => {
  if (isMinervaSuggestionSuccessState.value) {
    return true;
  }
  if (showMinervaNoMoreSuggestionsState.value) {
    return false;
  }
  if (activePrototype.value === 'option-3') {
    return false;
  }
  if (isEditCheckSheet.value) {
    return isPaginationMode.value && minervaPaginationTotal.value > 0;
  }
  if (isPaginationMode.value) {
    return minervaPaginationTotal.value > 0;
  }
  if (activeMinervaSuggestion.value === 2 || activeMinervaSuggestion.value === 4) {
    return minervaPaginationTotal.value > 0;
  }
  return minervaPaginationTotal.value > 1;
});

function resetSuggestionState() {
  clearMinervaNoMoreSuggestionsState();
  clearMinervaSuggestionSuccessState();
  clearMinervaSheetClosingState();
  showCitationPopup1.value = false;
  showCitationPopup2.value = false;
  citationUrl1.value = '';
  citationUrl2.value = '';
  citationNumber1.value = null;
  citationNumber2.value = null;
  citationCounter.value = 0;
  showSuccessMessage1.value = false;
  showSuccessMessage2.value = false;
  isSuggestionDeclined1.value = false;
  isSuggestionDeclined2.value = false;
  showSuccessMessage3.value = false;
  showSuccessMessage4.value = false;
  isSuggestionDeclined3.value = false;
  isSuggestionDeclined4.value = false;
  isSuggestionResolved4.value = false;
  isSuggestionDeclined5.value = false;
  isSuggestionResolved5.value = false;
  isSuggestionDeclined6.value = false;
  isSuggestionResolved6.value = false;
  isSuggestionDeclined7.value = false;
  isSuggestionResolved7.value = false;
  isSuggestionDeclined8.value = false;
  isSuggestionResolved8.value = false;
  isCardExpanded.value = false;
  isCardExpanded2.value = false;
  isCardExpanded3.value = false;
  isCardExpanded4.value = false;
  isCardExpanded5.value = false;
  isCardExpanded6.value = false;
  isCardExpanded7.value = false;
  isCardExpanded8.value = false;
  hasOpenedDesktopPagination.value = false;
  isCardHovered.value = false;
  isCardHovered2.value = false;
  isCardHovered3.value = false;
  isCardHovered4.value = false;
  isCardHovered5.value = false;
  isCardHovered6.value = false;
  isCardHovered7.value = false;
  isCardHovered8.value = false;
  isTextHovered.value = false;
  isTextHovered2.value = false;
  isTextHovered3.value = false;
  isTextHovered4.value = false;
  isTextHovered5.value = false;
  isTextHovered6.value = false;
  isTextHovered7.value = false;
  isTextHovered8.value = false;
  isBannerDismissed.value = false;
  isBannerClosing.value = false;
  isBannerOpening.value = false;
  showMinervaArrowOnly.value = false;
  hasUsedOption4Button.value = false;
  minervaSectionBannerDismissed.value = {
    'early-life': false,
    career: false,
    poetry: false,
    prose: false,
    film: false,
    theory: false
  };
  toneCheckActive.value = false;
  toneCheckDismissed.value = false;
  toneCheckHighlightRef.value = null;
  toneCheckTriggeredByAmazing.value = false;
  pasteCheckActive.value = false;
  pasteCheckDismissed.value = false;
  activeEditCheckTypeOverride.value = null;
  if (pasteCheckHighlightRef.value) {
    unwrapCheckHighlight(pasteCheckHighlightRef.value);
  }
  pasteCheckHighlightRef.value = null;
  isEditCheckExpanded.value = false;
  closeMinervaSuggestion();
}

function applyPrototypeMode(mode) {
  resetSuggestionState();
  activePrototype.value = mode;
  const modeShowsSuggestions = ['option-1', 'option-2', 'option-3', 'option-4', 'option-5', 'option-6'].includes(mode);
  showSuggestionNotification.value = modeShowsSuggestions;
  showSuggestionBadge.value = modeShowsSuggestions;
  isBannerDismissed.value = false;
  isBannerClosing.value = false;
  isBannerOpening.value = false;
  isSuggestionInfoOpen.value = false;
  isMinervaInfoSheetOpen.value = false;
  showSuggestionInfoPreference.value = true;
  dontShowSuggestionInfo.value = false;
  isBannerDelayReady.value = false;
  enableAutoScroll.value = false;
  showSuggestions.value = modeShowsSuggestions;
  showSuggestionToggle.value = true;
}

function openPrototypeDialog(fromSection = false) {
  if (isEditMode.value) return;
  if (!fromSection) {
    minervaEditSectionOnly.value = null;
    readModeReturnSectionId.value = null;
  }
  isPrototypeDialogOpen.value = true;
}

function closePrototypeDialog() {
  isPrototypeDialogOpen.value = false;
}

function clearMinervaNoMoreSuggestionsState() {
  minervaNoMoreSuggestionsState.value = null;
}

function clearMinervaSuggestionSuccessState(options = {}) {
  const { keepExit = false } = options;
  if (minervaSuggestionSuccessTimer) {
    clearTimeout(minervaSuggestionSuccessTimer);
    minervaSuggestionSuccessTimer = null;
  }
  if (minervaSuggestionSuccessExitTimer) {
    clearTimeout(minervaSuggestionSuccessExitTimer);
    minervaSuggestionSuccessExitTimer = null;
  }
  minervaSuggestionSuccessState.value = null;
  if (!keepExit) {
    isMinervaSuggestionSuccessExiting.value = false;
  }
}

function clearMinervaSheetClosingState() {
  isMinervaSheetClosing.value = false;
}

function isSuccessHighlightActive(suggestionId) {
  return successHighlightSuggestionIds.value.includes(suggestionId);
}

function activateSuccessHighlight(suggestionId) {
  if (!successHighlightOnCompleteEnabled.value) return;
  if (!successHighlightSuggestionIds.value.includes(suggestionId)) {
    successHighlightSuggestionIds.value = [ ...successHighlightSuggestionIds.value, suggestionId ];
  }
  window.setTimeout(() => {
    successHighlightSuggestionIds.value = successHighlightSuggestionIds.value.filter((id) => id !== suggestionId);
  }, 4000);
}

function getNextMinervaSuggestionId(currentId) {
  const ids = getPendingSuggestionIdsForContext();
  if (!ids.length) {
    return null;
  }
  const contextIds = getSuggestionIdsForCurrentContext();
  const currentOrderIndex = contextIds.indexOf(currentId);
  return ids.find((id) => contextIds.indexOf(id) > currentOrderIndex) ?? ids[0] ?? null;
}

function queueMinervaSuccessState(currentId) {
  const successCopy = minervaSuggestionSuccessCopy[currentId];
  if (!successCopy) {
    return false;
  }
  clearMinervaSuggestionSuccessState();
  minervaSheetMode.value = 'suggestion';
  activeMinervaSuggestion.value = currentId;
  isMinervaSheetOpen.value = true;
  minervaSheetReturnDirection.value = null;
  minervaSuggestionSuccessState.value = {
    id: currentId,
    ...successCopy
  };
  updateMinervaSheetHeight();
  minervaSuggestionSuccessTimer = window.setTimeout(() => {
    isMinervaSuggestionSuccessExiting.value = true;
    minervaSuggestionSuccessExitTimer = window.setTimeout(() => {
      clearMinervaSuggestionSuccessState({ keepExit: true });
      if (maybeShowMinervaNoMoreSuggestionsState()) {
        nextTick(() => {
          updateMinervaSheetHeight();
          window.requestAnimationFrame(() => {
            isMinervaSuggestionSuccessExiting.value = false;
          });
        });
        return;
      }
      const nextId = getNextMinervaSuggestionId(currentId);
      if (!nextId) {
        closeMinervaSuggestion();
        return;
      }
      openMinervaSuggestion(nextId, { keepSuccessExit: true });
    }, 220);
  }, 2000);
  return true;
}

function closeVectorNoMoreSuggestionsDialog() {
  isVectorNoMoreSuggestionsDialogOpen.value = false;
}

function openMinervaNoMoreSuggestionsStateSheet(mode) {
  if (!noMoreSuggestionsEmptyStateEnabled.value || !isMinervaSkin.value) return false;
  clearMinervaSuggestionSuccessState();
  if (minervaNoMoreSuggestionsOpenTimer) {
    clearTimeout(minervaNoMoreSuggestionsOpenTimer);
    minervaNoMoreSuggestionsOpenTimer = null;
  }
  isMinervaSheetClosing.value = true;
  minervaNoMoreSuggestionsOpenTimer = window.setTimeout(() => {
    isMinervaSheetOpen.value = false;
    minervaSheetHeight.value = 0;
    minervaSheetMode.value = 'suggestion';
    minervaSheetReturnDirection.value = null;
    minervaNoMoreSuggestionsState.value = mode;
    isMinervaSheetOpen.value = true;
    updateMinervaSheetHeight();
    nextTick(() => {
      window.requestAnimationFrame(() => {
        clearMinervaSheetClosingState();
      });
    });
    minervaNoMoreSuggestionsOpenTimer = null;
  }, 220);
  return true;
}

function maybeShowVectorNoMoreSuggestionsDialog() {
  if (
    !noMoreSuggestionsEmptyStateEnabled.value ||
    isMinervaSkin.value ||
    !isEditMode.value ||
    !showSuggestions.value ||
    completedSuggestionCount.value <= 0 ||
    availableSuggestionCount.value !== 0
  ) {
    return false;
  }
  isVectorNoMoreSuggestionsDialogOpen.value = true;
  return true;
}

function shouldShowNoMoreSuggestionsLeftToast() {
  return (
    !minervaEditSectionOnly.value &&
    isEditMode.value &&
    showSuggestions.value &&
    availableSuggestionCount.value === 0 &&
    completedSuggestionCount.value === 0 &&
    allSuggestionsDeclined.value
  );
}

function maybeShowMinervaNoMoreSuggestionsState() {
  if (
    !noMoreSuggestionsEmptyStateEnabled.value ||
    !isMinervaSkin.value ||
    !isEditMode.value ||
    !showSuggestions.value
  ) {
    return false;
  }

  if (minervaEditSectionOnly.value && sectionSuggestionCount.value === 0 && otherSuggestionCount.value > 0) {
    return openMinervaNoMoreSuggestionsStateSheet('section');
  }

  if (!minervaEditSectionOnly.value && availableSuggestionCount.value === 0 && completedSuggestionCount.value > 0) {
    return openMinervaNoMoreSuggestionsStateSheet('article');
  }

  return false;
}

function clearEditModeUiState() {
  closeMinervaSuggestion();
  closeVectorNoMoreSuggestionsDialog();
  isEditMode.value = false;
  isBannerDelayReady.value = false;
  isBannerClosing.value = false;
  isBannerOpening.value = false;
  forceEntryBannerSection.value = null;
  if (bannerDelayTimer) {
    clearTimeout(bannerDelayTimer);
    bannerDelayTimer = null;
  }
  if (bannerCloseTimer) {
    clearTimeout(bannerCloseTimer);
    bannerCloseTimer = null;
  }
  if (bannerOpenTimer) {
    clearTimeout(bannerOpenTimer);
    bannerOpenTimer = null;
  }
}

function publishEdits() {
  const currentSnapshot = getCurrentEditSnapshot();
  editSnapshot.value = cloneEditSnapshot(currentSnapshot);
  editUndoStack.value = [cloneEditSnapshot(currentSnapshot)];
  editRedoStack.value = [];
  syncMinervaRedoButtonVisibility();
  hasUnsavedChanges.value = false;
  closeVectorNoMoreSuggestionsDialog();
  clearEditModeUiState();
}

function startPrototype() {
  applyPrototypeMode(selectedPrototype.value);
  closePrototypeDialog();
  enterEditMode();
}

function openEditAtSection(sectionId) {
  pendingScrollSection.value = sectionId;
  minervaEditSectionOnly.value = isMinervaSkin.value ? sectionId : null;
  readModeReturnSectionId.value = sectionId;
  forceEntryBannerSection.value = sectionId === 'poetry' ? 'poetry' : null;
  clearMinervaNoMoreSuggestionsState();
  if (isMinervaSkin.value && isArrowOnceMode.value) {
    minervaSectionBannerDismissed.value[sectionId] = false;
  }
  startPrototype();
}

function getEditSectionRefById(sectionId) {
  if (sectionId === 'early-life') return editSectionEarlyLife;
  if (sectionId === 'career') return editSectionCareer;
  if (sectionId === 'poetry') return editSectionPoetry;
  if (sectionId === 'prose') return editSectionProse;
  if (sectionId === 'film') return editSectionFilm;
  if (sectionId === 'theory') return editSectionTheory;
  return null;
}

function expandToFullPageEdit(sectionId, { openFirstSuggestion = false } = {}) {
  const targetRef = sectionId ? getEditSectionRefById(sectionId) : null;
  const startY = typeof window !== 'undefined' ? window.scrollY : 0;
  const startTop = targetRef?.value ? targetRef.value.getBoundingClientRect().top : 0;
  const previousAvailable = minervaEditSectionOnly.value
    ? sectionSuggestionCount.value
    : availableSuggestionCount.value;
  minervaEditSectionOnly.value = null;
  clearMinervaNoMoreSuggestionsState();
  if (isArrowOnceMode.value) {
    isBannerDelayReady.value = false;
    if (bannerDelayTimer) {
      clearTimeout(bannerDelayTimer);
    }
    bannerDelayTimer = setTimeout(() => {
      if (isEditMode.value && shouldShowBanner.value) {
        isBannerDelayReady.value = true;
      }
    }, 2000);
  }
  nextTick(() => {
    if (targetRef?.value && typeof window !== 'undefined') {
      const newTop = targetRef.value.getBoundingClientRect().top;
      window.scrollTo(0, Math.max(0, startY + (newTop - startTop)));
    }
    if (openFirstSuggestion) {
      openFirstPendingSuggestion(true, { openMinervaAfterScroll: true });
    }
  });
  if (isMinervaSkin.value && shouldShowToasts.value) {
    nextTick(() => {
      const newAvailable = availableSuggestionCount.value;
      if (newAvailable > previousAvailable && showSuggestions.value) {
        isBannerDismissed.value = false;
        isBannerDelayReady.value = true;
      }
    });
  }
}

function showFullPageEdit(event) {
  const sectionId = event?.currentTarget?.closest('.minerva-edit-section')?.dataset?.section;
  expandToFullPageEdit(sectionId);
}

function scrollReadModeSectionIntoView(sectionId) {
  if (!sectionId || typeof document === 'undefined') return;
  const target = document.querySelector(`[data-read-section="${sectionId}"]`);
  if (!(target instanceof HTMLElement)) return;
  target.scrollIntoView({ behavior: 'auto', block: 'start' });
}

function restoreReadModeSection(sectionId) {
  if (!sectionId || typeof window === 'undefined') return;
  if (isMinervaSkin.value) {
    minervaOpenSections.value = {
      'early-life': false,
      career: false,
      poetry: false,
      prose: false,
      film: false,
      theory: false
    };
    if (Object.prototype.hasOwnProperty.call(minervaOpenSections.value, sectionId)) {
      minervaOpenSections.value[sectionId] = true;
    }
  }
  nextTick(() => {
    scrollReadModeSectionIntoView(sectionId);
  });
}

function openFirstSuggestionAfterFullPageTransition() {
  nextTick(() => {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          openFirstPendingSuggestion(true, { openMinervaAfterScroll: true });
          if (suppressMinervaBannerDuringViewMoreSuggestionsTimer) {
            clearTimeout(suppressMinervaBannerDuringViewMoreSuggestionsTimer);
          }
          suppressMinervaBannerDuringViewMoreSuggestionsTimer = setTimeout(() => {
            suppressMinervaBannerDuringViewMoreSuggestions.value = false;
            suppressMinervaBannerDuringViewMoreSuggestionsTimer = null;
          }, 1200);
        });
      });
      return;
    }
    openFirstPendingSuggestion(true, { openMinervaAfterScroll: true });
    if (suppressMinervaBannerDuringViewMoreSuggestionsTimer) {
      clearTimeout(suppressMinervaBannerDuringViewMoreSuggestionsTimer);
    }
    suppressMinervaBannerDuringViewMoreSuggestionsTimer = setTimeout(() => {
      suppressMinervaBannerDuringViewMoreSuggestions.value = false;
      suppressMinervaBannerDuringViewMoreSuggestionsTimer = null;
    }, 1200);
  });
}

function handleMinervaViewMoreSuggestions() {
  if (!minervaEditSectionOnly.value) return;
  const sectionId = minervaEditSectionOnly.value;
  suppressMinervaBannerDuringViewMoreSuggestions.value = true;
  closeMinervaSuggestion();
  expandToFullPageEdit(sectionId);
  openFirstSuggestionAfterFullPageTransition();
}

function handleMinervaContinueEditing() {
  closeMinervaSuggestion();
}

function shouldRenderSection(sectionId) {
  if (!isMinervaSkin.value) return true;
  if (!minervaEditSectionOnly.value) return true;
  return minervaEditSectionOnly.value === sectionId;
}

function showEditFullPageButtons(sectionId) {
  return isMinervaSkin.value &&
    minervaEditSectionOnly.value === sectionId &&
    isEditToolbarScrolled.value;
}

function removeToneCheckHighlights(node) {
  if (!node) return;
  const highlights = node.querySelectorAll('.tone-check-highlight');
  highlights.forEach((span) => {
    span.replaceWith(document.createTextNode(span.textContent || ''));
  });
  removeEditCheckMinervaMarkers(node);
}

function removePasteCheckHighlights(node) {
  if (!node) return;
  const highlights = node.querySelectorAll('.paste-check-highlight');
  highlights.forEach((span) => {
    span.replaceWith(document.createTextNode(span.textContent || ''));
  });
  removeEditCheckMinervaMarkers(node);
}

function getEditCheckMinervaAnchor(node) {
  if (!node || !isMinervaSkin.value) return null;
  if (node.nodeType === Node.TEXT_NODE) {
    return node.parentElement?.closest('p');
  }
  return node.closest?.('p') || null;
}

function removeEditCheckMinervaMarkers(node) {
  if (!node) return;
  const anchors = node.matches?.('p') ? [node] : Array.from(node.querySelectorAll('p'));
  anchors.forEach((anchor) => {
    anchor.querySelectorAll('.edit-check-minerva-marker').forEach((marker) => marker.remove());
    anchor.classList.remove('edit-check-minerva-target');
  });
}

function refreshEditCheckMinervaMarkers(anchor) {
  if (!anchor || !isMinervaSkin.value) return;
  const hasRemainingChecks = Boolean(
    anchor.querySelector('.tone-check-highlight') ||
    anchor.querySelector('.paste-check-highlight')
  );
  if (hasRemainingChecks) {
    attachEditCheckMinervaMarkers(anchor);
  } else {
    removeEditCheckMinervaMarkers(anchor);
  }
}

function attachEditCheckMinervaMarkers(anchor) {
  if (!anchor || !isMinervaSkin.value) return;
  anchor.classList.add('edit-check-minerva-target');
  anchor.querySelectorAll('.edit-check-minerva-marker').forEach((marker) => marker.remove());

  const minervaRail = document.createElement('span');
  minervaRail.className = 'minerva-highlight-rail edit-check-minerva-marker';
  anchor.appendChild(minervaRail);

  const triggerButton = createEditCheckTriggerButton();
  triggerButton.classList.add('edit-check-minerva-marker');
  anchor.appendChild(triggerButton);
}

function syncEditCheckHoverState() {
  const isHovered = isEditCheckHighlightHovered.value;
  [ pasteCheckHighlightRef.value, toneCheckHighlightRef.value ].forEach((highlightNode) => {
    if (!highlightNode) return;
    if (isHovered) {
      highlightNode.classList.add('highlighted-text-wrapper--hover');
    } else {
      highlightNode.classList.remove('highlighted-text-wrapper--hover');
    }
  });
}

function createEditCheckHighlightSpan(matchedText, highlightClass) {
  const highlightSpan = document.createElement('span');
  highlightSpan.className = `${highlightClass} feedback-highlight feedback-highlight--warning highlighted-text-wrapper`;
  if (nonSelectedHighlightUnderlineEnabled.value) {
    highlightSpan.classList.add('feedback-underlined-unselected');
  }
  if (!isEditCheckSheetExpanded.value) {
    highlightSpan.classList.add('edit-check-highlight--collapsed');
  }
  const railSpan = document.createElement('span');
  railSpan.className = 'highlighted-text-rail';
  const contentSpan = document.createElement('span');
  contentSpan.className = 'highlighted-text-content';
  const annotationSpan = document.createElement('span');
  annotationSpan.className = 'highlighted-text-annotation';
  annotationSpan.textContent = matchedText;
  highlightSpan.addEventListener('mouseenter', () => {
    isEditCheckTextHovered.value = true;
    syncEditCheckHoverState();
  });
  highlightSpan.addEventListener('mouseleave', () => {
    isEditCheckTextHovered.value = false;
    syncEditCheckHoverState();
  });
  contentSpan.appendChild(annotationSpan);
  highlightSpan.appendChild(railSpan);
  highlightSpan.appendChild(contentSpan);
  return highlightSpan;
}

function insertToneCheckHighlight(node, phrase = 'amazing') {
  if (!node) return null;
  const lowerPhrase = phrase.toLowerCase();
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
    acceptNode(text) {
      if (!text.nodeValue || !text.nodeValue.toLowerCase().includes(lowerPhrase)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const textNode = walker.nextNode();
  if (!textNode) return null;

  const match = textNode.nodeValue.match(new RegExp(phrase, 'i'));
  const startIndex = match ? match.index : -1;
  if (startIndex === -1) return null;
  const matchedText = match ? match[0] : phrase;
  const endIndex = startIndex + matchedText.length;

  const before = textNode.nodeValue.slice(0, startIndex);
  const after = textNode.nodeValue.slice(endIndex);

  const fragment = document.createDocumentFragment();
  if (before) {
    fragment.appendChild(document.createTextNode(before));
  }
  const highlightSpan = createEditCheckHighlightSpan(matchedText, 'tone-check-highlight');
  fragment.appendChild(highlightSpan);
  if (after) {
    fragment.appendChild(document.createTextNode(after));
  }

  textNode.parentNode.replaceChild(fragment, textNode);
  const parent = textNode.parentNode;
  const anchor = getEditCheckMinervaAnchor(parent);
  attachEditCheckMinervaMarkers(anchor);
  if (!parent) return highlightSpan;
  return parent.querySelector('.tone-check-highlight') || highlightSpan;
}

function insertPasteCheckHighlight(range, pastedText) {
  if (!range) return null;
  const highlightSpan = createEditCheckHighlightSpan(pastedText, 'paste-check-highlight');
  range.insertNode(highlightSpan);
  const anchor = getEditCheckMinervaAnchor(highlightSpan);
  attachEditCheckMinervaMarkers(anchor);
  const highlightNode = highlightSpan;
  return highlightNode;
}

function createEditCheckTriggerButton() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'minerva-suggestion-trigger feedback-trigger--warning edit-check-trigger';
  button.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true">${cdxIconAlert}</svg>`;
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    if (isMinervaSheetOpen.value && minervaSheetMode.value === 'edit-check') {
      closeMinervaSuggestion();
      return;
    }
    minervaSheetMode.value = 'edit-check';
    isMinervaSheetOpen.value = true;
    updateMinervaSheetHeight();
  });
  return button;
}

function createSuggestionTriggerHandler(id) {
  return (event) => {
    event.stopPropagation();
    if (!showSuggestions.value) return;
    activeMinervaSuggestion.value = id;
    isMinervaSheetOpen.value = true;
  };
}

function updateToneCheckFromContent() {
  if (!pageRoot.value) return;
  const nodes = pageRoot.value.querySelectorAll('.article-text-editable');
  let hasAmazing = false;

  if (toneCheckActive.value && !toneCheckDismissed.value) {
    const highlightText = toneCheckHighlightRef.value?.textContent?.trim().toLowerCase();
    if (toneCheckHighlightRef.value?.isConnected && highlightText === 'amazing') {
      return;
    }
    clearToneCheck(false, false);
  }
  toneCheckHighlightRef.value = null;

  nodes.forEach((node) => {
    removeToneCheckHighlights(node);
    if (node.textContent && node.textContent.toLowerCase().includes('amazing')) {
      hasAmazing = true;
    }
  });

  if (!hasAmazing) {
    toneCheckDismissed.value = false;
    toneCheckActive.value = false;
    toneCheckEnterArmed.value = false;
    toneCheckTriggeredByAmazing.value = false;
    return;
  }

  if (!isEditMode.value) {
    toneCheckActive.value = false;
    toneCheckEnterArmed.value = false;
    return;
  }

  if (toneCheckDismissed.value) {
    toneCheckActive.value = false;
    toneCheckEnterArmed.value = false;
    toneCheckTriggeredByAmazing.value = false;
    return;
  }

  if (!toneCheckEnterArmed.value || !toneCheckTriggeredByAmazing.value) {
    toneCheckActive.value = false;
    toneCheckEnterArmed.value = false;
    toneCheckTriggeredByAmazing.value = false;
    return;
  }

  let highlightNode = null;
  nodes.forEach((node) => {
    if (!highlightNode) {
      highlightNode = insertToneCheckHighlight(node, 'amazing');
    }
  });
  toneCheckHighlightRef.value = highlightNode;
  toneCheckActive.value = Boolean(highlightNode);
  if (toneCheckActive.value) {
    activeEditCheckTypeOverride.value = 'tone';
  }
  toneCheckEnterArmed.value = false;
  toneCheckTriggeredByAmazing.value = false;
  isEditCheckExpanded.value = false;
  nextTick(() => {
    alignToneCheckCard();
    updateSuggestionVisibility();
    syncEditCheckHighlightState();
  });
}

function handleToneCheckKeydown(event) {
  if (event.key === 'Enter') {
    const wordRange = getWordRangeBeforeCursor(event.currentTarget, 'amazing');
    if (wordRange) {
      event.preventDefault();
      toneCheckDismissed.value = false;
      toneCheckEnterArmed.value = true;
      toneCheckTriggeredByAmazing.value = true;
      toneCheckHighlightRef.value = insertToneCheckHighlightFromRange(wordRange);
      toneCheckActive.value = Boolean(toneCheckHighlightRef.value);
      if (toneCheckActive.value) {
        activeEditCheckTypeOverride.value = 'tone';
      }
      toneCheckEnterArmed.value = false;
      toneCheckTriggeredByAmazing.value = false;
      isEditCheckExpanded.value = false;
      nextTick(() => {
        syncEditCheckHighlightState();
        alignToneCheckCard();
        updateSuggestionVisibility();
        document.execCommand('insertParagraph');
      });
    } else {
      toneCheckEnterArmed.value = false;
      toneCheckTriggeredByAmazing.value = false;
    }
  }
}

function getLastTextNode(node) {
  if (!node) return null;
  if (node.nodeType === Node.TEXT_NODE) {
    return node;
  }
  for (let index = node.childNodes.length - 1; index >= 0; index -= 1) {
    const textNode = getLastTextNode(node.childNodes[index]);
    if (textNode) {
      return textNode;
    }
  }
  return null;
}

function handlePaste(event) {
  if (!isEditMode.value) return;
  const pastedText = event?.clipboardData?.getData('text/plain');
  if (!pastedText) return;
  event.preventDefault();
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  range.deleteContents();
  const highlightNode = insertPasteCheckHighlight(range, pastedText);
  if (!highlightNode) return;
  range.setStartAfter(highlightNode);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  pasteCheckHighlightRef.value = highlightNode;
  pasteCheckActive.value = true;
  activeEditCheckTypeOverride.value = 'paste';
  pasteCheckDismissed.value = false;
  isEditCheckExpanded.value = false;
  nextTick(() => {
    alignPasteCheckCard();
    updateSuggestionVisibility();
    syncEditCheckHighlightState();
  });
}

function getWordBeforeCursor(target) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return '';
  const range = selection.getRangeAt(0);
  const node = range.startContainer;
  if (target && !target.contains(node)) return '';
  const textRange = range.cloneRange();
  if (target) {
    textRange.selectNodeContents(target);
  }
  textRange.setEnd(range.startContainer, range.startOffset);
  const before = textRange.toString();
  const match = before.match(/([A-Za-z]+)$/);
  return match ? match[1] : '';
}

function getWordRangeBeforeCursor(target, expectedWord) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  let node = range.startContainer;
  let offset = range.startOffset;
  if (target && !target.contains(node)) return null;
  if (node.nodeType !== Node.TEXT_NODE) {
    const fallback = node.childNodes[Math.max(0, offset - 1)] || node.childNodes[node.childNodes.length - 1];
    const textNode = getLastTextNode(fallback);
    if (!textNode) return null;
    node = textNode;
    offset = textNode.textContent ? textNode.textContent.length : 0;
  }
  const text = node.textContent || '';
  const before = text.slice(0, offset);
  if (!before.toLowerCase().endsWith(expectedWord.toLowerCase())) return null;
  const wordRange = document.createRange();
  wordRange.setStart(node, offset - expectedWord.length);
  wordRange.setEnd(node, offset);
  return wordRange;
}

function insertToneCheckHighlightFromRange(range) {
  if (!range) return null;
  const matchedText = range.toString();
  if (!matchedText) return null;
  range.deleteContents();
  const highlightSpan = createEditCheckHighlightSpan(matchedText, 'tone-check-highlight');
  range.insertNode(highlightSpan);
  const anchor = getEditCheckMinervaAnchor(highlightSpan);
  attachEditCheckMinervaMarkers(anchor);
  const selection = window.getSelection();
  const afterRange = document.createRange();
  afterRange.setStartAfter(highlightSpan);
  afterRange.collapse(true);
  selection?.removeAllRanges();
  selection?.addRange(afterRange);
  return highlightSpan;
}

function alignToneCheckCard() {
  if (!toneCheckHighlightRef.value) return;
  nextTick(() => {
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    const textRect = toneCheckHighlightRef.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    const offset = textRect.top - containerRect.top - suggestionsTopOffset.value;
    toneCheckTopOffset.value = offset;
  });
}

function alignPasteCheckCard() {
  if (!pasteCheckHighlightRef.value) return;
  nextTick(() => {
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    const textRect = pasteCheckHighlightRef.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    const offset = textRect.top - containerRect.top - suggestionsTopOffset.value;
    pasteCheckTopOffset.value = offset;
  });
}

function unwrapCheckHighlight(highlightNode) {
  if (!highlightNode) return;
  const anchor = getEditCheckMinervaAnchor(highlightNode);
  const text = highlightNode.textContent || '';
  highlightNode.replaceWith(document.createTextNode(text));
  refreshEditCheckMinervaMarkers(anchor);
}

function removeCheckHighlight(highlightNode) {
  if (!highlightNode) return;
  const anchor = getEditCheckMinervaAnchor(highlightNode);
  highlightNode.remove();
  refreshEditCheckMinervaMarkers(anchor);
}

function clearToneCheck(removeHighlight = false, dismiss = false) {
  if (toneCheckHighlightRef.value) {
    if (removeHighlight) {
      removeCheckHighlight(toneCheckHighlightRef.value);
    } else {
      unwrapCheckHighlight(toneCheckHighlightRef.value);
    }
  }
  toneCheckHighlightRef.value = null;
  toneCheckActive.value = false;
  if (activeEditCheckTypeOverride.value === 'tone') {
    activeEditCheckTypeOverride.value = null;
  }
  toneCheckDismissed.value = dismiss;
  toneCheckEnterArmed.value = false;
  toneCheckTriggeredByAmazing.value = false;
  if (isMinervaSkin.value && minervaSheetMode.value === 'edit-check' && !pasteCheckActive.value) {
    closeMinervaSuggestion();
  }
}

function clearPasteCheck(removeHighlight = false) {
  if (pasteCheckHighlightRef.value) {
    if (removeHighlight) {
      removeCheckHighlight(pasteCheckHighlightRef.value);
    } else {
      unwrapCheckHighlight(pasteCheckHighlightRef.value);
    }
  }
  pasteCheckHighlightRef.value = null;
  pasteCheckActive.value = false;
  if (activeEditCheckTypeOverride.value === 'paste') {
    activeEditCheckTypeOverride.value = null;
  }
  pasteCheckDismissed.value = false;
  if (isMinervaSkin.value && minervaSheetMode.value === 'edit-check' && !toneCheckActive.value) {
    closeMinervaSuggestion();
  }
}

function syncEditCheckHighlightState() {
  const isExpanded = isEditCheckSheetExpanded.value;
  [ pasteCheckHighlightRef.value, toneCheckHighlightRef.value ].forEach((highlightNode) => {
    if (!highlightNode) return;
    if (isExpanded) {
      highlightNode.classList.remove('edit-check-highlight--collapsed');
    } else {
      highlightNode.classList.add('edit-check-highlight--collapsed');
    }
  });
}

watch(isEditCheckHighlightHovered, () => {
  syncEditCheckHoverState();
});

function handlePasteCheckKeep() {
  if (isMinervaSkin.value && isPaginationMode.value && isEditCheckSheet.value) {
    clearPasteCheck(false);
    isEditCheckExpanded.value = false;
    isEditCheckTextHovered.value = false;
    advanceMinervaEditCheck('paste');
    updateSuggestionVisibility();
    return;
  }
  clearPasteCheck(false);
  clearToneCheck(false, true);
  isEditCheckExpanded.value = false;
  isEditCheckTextHovered.value = false;
  updateSuggestionVisibility();
}

function handlePasteCheckRemove() {
  if (isMinervaSkin.value && isPaginationMode.value && isEditCheckSheet.value) {
    clearPasteCheck(true);
    isEditCheckExpanded.value = false;
    isEditCheckTextHovered.value = false;
    advanceMinervaEditCheck('paste');
    updateSuggestionVisibility();
    return;
  }
  clearPasteCheck(true);
  clearToneCheck(false, true);
  isEditCheckExpanded.value = false;
  isEditCheckTextHovered.value = false;
  updateSuggestionVisibility();
}

function toggleEditCheckExpand() {
  if (isMinervaSkin.value) return;
  isEditCheckExpanded.value = !isEditCheckExpanded.value;
  syncEditCheckHighlightState();
}

function handleToneCheckRevise() {
  if (isMinervaSkin.value && isPaginationMode.value && isEditCheckSheet.value) {
    clearToneCheck(false, true);
    isEditCheckExpanded.value = false;
    isEditCheckTextHovered.value = false;
    advanceMinervaEditCheck('tone');
    updateSuggestionVisibility();
    return;
  }
  clearToneCheck(false, true);
  clearPasteCheck(false);
  isEditCheckExpanded.value = false;
  isEditCheckTextHovered.value = false;
}

function handleToneCheckDecline() {
  if (isMinervaSkin.value && isPaginationMode.value && isEditCheckSheet.value) {
    clearToneCheck(false, true);
    isEditCheckExpanded.value = false;
    isEditCheckTextHovered.value = false;
    advanceMinervaEditCheck('tone');
    updateSuggestionVisibility();
    return;
  }
  clearToneCheck(false, true);
  clearPasteCheck(false);
  isEditCheckExpanded.value = false;
  isEditCheckTextHovered.value = false;
}

function handleHideSuggestionsBanner() {
  showSuggestions.value = !showSuggestions.value;
}

function handleBannerToggleClick() {
  showSuggestions.value = !showSuggestions.value;
}

function dismissSuggestionInfo() {
  isSuggestionInfoOpen.value = false;
  isMinervaInfoSheetOpen.value = false;
  if (dontShowSuggestionInfo.value) {
    showSuggestionInfoPreference.value = false;
  }
}

function toggleMinervaAddMenu() {
  isMinervaAddMenuOpen.value = !isMinervaAddMenuOpen.value;
  if (isMinervaAddMenuOpen.value) {
    closeTextStyleMenu();
    closeMinervaEditMenu();
  }
}

function closeMinervaAddMenu() {
  isMinervaAddMenuOpen.value = false;
  isMinervaAddMenuExpanded.value = false;
}

function toggleMinervaEditMenu() {
  isMinervaEditMenuOpen.value = !isMinervaEditMenuOpen.value;
  if (isMinervaEditMenuOpen.value) {
    closeTextStyleMenu();
    closeMinervaAddMenu();
  }
}

function closeMinervaEditMenu() {
  isMinervaEditMenuOpen.value = false;
}

function handleMinervaEditMenuItem() {
  closeMinervaEditMenu();
}

function handleMinervaEditMenuSwitchChange(value, nextValue) {
  if (value === 'suggestion-mode') {
    showSuggestions.value = nextValue;
  }
  if (value === 'source-editing') {
    minervaSourceEditingEnabled.value = nextValue;
  }
}

function toggleTextStyleMenu() {
  isTextStyleMenuOpen.value = !isTextStyleMenuOpen.value;
  if (isTextStyleMenuOpen.value) {
    isTextStyleMenuExpanded.value = false;
    closeMinervaAddMenu();
    closeMinervaEditMenu();
    updateInlineTextStyleState();
  }
}

function closeTextStyleMenu() {
  isTextStyleMenuOpen.value = false;
  isTextStyleMenuExpanded.value = false;
}

function isTrackedInlineTextStyle(value) {
  return Object.prototype.hasOwnProperty.call(trackedInlineTextStyleCommands, value);
}

function isInlineTextStyleActive(value) {
  return Boolean(inlineTextStyleState.value[value]);
}

function updateInlineTextStyleState() {
  if (typeof document === 'undefined' || typeof window === 'undefined' || typeof document.queryCommandState !== 'function') {
    return;
  }
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const element = container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement;
  if (!element || !element.closest('.article-text-editable')) return;
  inlineTextStyleState.value = Object.fromEntries(
    Object.entries(trackedInlineTextStyleCommands).map(([ value, command ]) => [
      value,
      Boolean(document.queryCommandState(command))
    ])
  );
}

function restoreSavedArticleSelection() {
  if (typeof window === 'undefined' || !savedArticleSelectionRange) return false;
  const selection = window.getSelection();
  if (!selection) return false;
  selection.removeAllRanges();
  selection.addRange(savedArticleSelectionRange);
  if (lastArticleEditableElement && typeof lastArticleEditableElement.focus === 'function') {
    lastArticleEditableElement.focus();
  }
  return true;
}

function applyInlineTextStyle(command) {
  if (typeof document === 'undefined') return false;
  if (!restoreSavedArticleSelection()) return false;
  const applied = document.execCommand(command, false);
  if (!applied) return false;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    savedArticleSelectionRange = selection.getRangeAt(0).cloneRange();
  }
  updateInlineTextStyleState();
  markArticleEdited();
  return true;
}

function handleTextStyleItemSelect(value) {
  const command = trackedInlineTextStyleCommands[value];
  if (command) {
    applyInlineTextStyle(command);
  }
  closeTextStyleMenu();
}

function toggleTextStyleMenuExpanded() {
  isTextStyleMenuExpanded.value = !isTextStyleMenuExpanded.value;
}

function getToggleRootElement(toggleRef) {
  const candidate = toggleRef?.value;
  if (!candidate) return null;
  if (candidate.$el instanceof HTMLElement) return candidate.$el;
  if (candidate instanceof HTMLElement) return candidate;
  return null;
}

function animateMinervaRailToggleToMenuBadge() {
  const railToggle = getToggleRootElement(minervaRailToggleRef);
  const ellipsis = minervaEditMenuEllipsisRef.value instanceof HTMLElement
    ? minervaEditMenuEllipsisRef.value
    : null;
  if (!railToggle || !ellipsis) return;

  const startRect = railToggle.getBoundingClientRect();
  const endRect = ellipsis.getBoundingClientRect();
  const startX = startRect.left + startRect.width / 2 - 4;
  const startY = startRect.top + startRect.height / 2 - 4;
  const endX = endRect.right - 7;
  const endY = endRect.top - 1;

  if (minervaRailToMenuBadgeTimer) {
    clearTimeout(minervaRailToMenuBadgeTimer);
    minervaRailToMenuBadgeTimer = null;
  }

  showMinervaRailToMenuBadgeAnimation.value = true;
  minervaRailToMenuBadgeStyle.value = {
    left: `${startX}px`,
    top: `${startY}px`,
    opacity: '1'
  };

  requestAnimationFrame(() => {
    minervaRailToMenuBadgeStyle.value = {
      left: `${endX}px`,
      top: `${endY}px`,
      opacity: '1'
    };
  });

  minervaRailToMenuBadgeTimer = setTimeout(() => {
    showMinervaRailToMenuBadgeAnimation.value = false;
    minervaRailToMenuBadgeStyle.value = {};
    minervaRailToMenuBadgeTimer = null;
  }, 320);
}

function handleMinervaRailToggleChange(nextValue) {
  if (isMinervaSkin.value && activePrototype.value === 'option-4') {
    isMinervaOverviewSheetOpen.value = nextValue;
    return;
  }
  if (isMinervaSkin.value && isPaginationManualMode.value) {
    if (!showSuggestions.value) {
      showSuggestions.value = true;
    }
    openNextPaginationSuggestion();
    return;
  }
  const shouldAnimateToEllipsis = (
    showSuggestions.value &&
    !nextValue &&
    minervaMenuToggleEnabled.value &&
    minervaRailToggleEnabled.value &&
    toggleBadgeCount.value > 0
  );

  if (shouldAnimateToEllipsis) {
    animateMinervaRailToggleToMenuBadge();
  }

  showSuggestions.value = nextValue;
}

function openNextPaginationSuggestion() {
  const ids = getPendingSuggestionIdsForContext();
  if (!ids.length) {
    closeMinervaSuggestion();
    return;
  }
  const contextIds = getSuggestionIdsForCurrentContext();
  const currentOrderIndex = contextIds.indexOf(activeMinervaSuggestion.value);
  const nextId = ids.find((id) => contextIds.indexOf(id) > currentOrderIndex) ?? ids[0];
  const targetRef = getSuggestionRefById(nextId);
  if (!targetRef) return;
  suppressMinervaReturnDirectionDuringPaginationScroll();
  openSuggestionAtTarget(nextId, targetRef, true, { openMinervaAfterScroll: true });
}

function handleMinervaRailControlsToggleChange(nextValue) {
  if (isMinervaSkin.value && isMinervaSheetOpen.value && !isEditCheckSheet.value) {
    if (isPaginationManualMode.value) {
      handleMinervaRailToggleChange(nextValue);
      return;
    }
    closeMinervaSuggestion();
    nextTick(() => {
      handleMinervaRailToggleChange(nextValue);
    });
    return;
  }
  handleMinervaRailToggleChange(nextValue);
}

function handleMinervaCollapsedRailToggleControlsChange(nextValue) {
  if (isMinervaSkin.value && isMinervaSheetOpen.value && !isEditCheckSheet.value) {
    closeMinervaSuggestion();
    nextTick(() => {
      handleMinervaCollapsedCountToggleChange(nextValue);
    });
    return;
  }
  handleMinervaCollapsedCountToggleChange(nextValue);
}

function handleMinervaRailArrowClick(direction) {
  const suggestionIdToSkip = isMinervaSkin.value && isMinervaSheetOpen.value && !isEditCheckSheet.value
    ? activeMinervaSuggestion.value
    : null;
  if (suggestionIdToSkip !== null) {
    suppressMinervaReturnDirectionDuringAutoScroll(500);
    scrollToSuggestionByDirection(direction, suggestionIdToSkip, { keepMinervaSheetClear: true });
    return;
  }
  scrollToSuggestionByDirection(direction, null, { keepMinervaSheetClear: true });
}

function suppressMinervaReturnDirectionDuringAutoScroll(duration = 1200) {
  suppressMinervaSheetReturnDirection.value = true;
  minervaSheetReturnDirection.value = null;
  if (suppressMinervaSheetReturnDirectionTimer) {
    clearTimeout(suppressMinervaSheetReturnDirectionTimer);
  }
  suppressMinervaSheetReturnDirectionTimer = setTimeout(() => {
    suppressMinervaSheetReturnDirection.value = false;
    suppressMinervaSheetReturnDirectionTimer = null;
    updateMinervaSheetReturnDirection();
  }, duration);
}

function suppressMinervaReturnDirectionDuringPaginationScroll() {
  if (!isMinervaSkin.value || !isPaginationMode.value) return;
  suppressMinervaReturnDirectionDuringAutoScroll(1400);
}

function handleMinervaRailFilterClick() {
  if (isMinervaSkin.value && isMinervaSheetOpen.value && !isEditCheckSheet.value) {
    closeMinervaSuggestion();
    nextTick(() => {
      handleFilterSuggestionsClick();
    });
    return;
  }
  handleFilterSuggestionsClick();
}

function handleDesktopPaginationPrev() {
  if (isDesktopPaginationPrevDisabled.value) return;
  const nextIndex = (desktopPaginationIndex.value - 1 + desktopPaginationIds.value.length) % desktopPaginationIds.value.length;
  const nextId = desktopPaginationIds.value[nextIndex];
  const targetRef = getSuggestionRefById(nextId);
  if (targetRef) {
    openSuggestionAtTarget(nextId, targetRef, true, { keepDesktopPaginationClear: true });
  }
}

function handleDesktopPaginationNext() {
  if (isDesktopPaginationNextDisabled.value) return;
  const nextIndex = (desktopPaginationIndex.value + 1) % desktopPaginationIds.value.length;
  const nextId = desktopPaginationIds.value[nextIndex];
  const targetRef = getSuggestionRefById(nextId);
  if (targetRef) {
    openSuggestionAtTarget(nextId, targetRef, true, { keepDesktopPaginationClear: true });
  }
}

function closeMinervaOverviewSheet() {
  isMinervaOverviewSheetOpen.value = false;
}

function handleOverviewSuggestionClick(suggestionId) {
  const targetRef = getSuggestionRefById(suggestionId);
  if (!targetRef) return;
  isMinervaOverviewSheetOpen.value = false;
  openSuggestionAtTarget(suggestionId, targetRef, true);
}

function handleMinervaCollapsedCountToggleChange(nextValue) {
  if (bannerCloseTimer) {
    clearTimeout(bannerCloseTimer);
    bannerCloseTimer = null;
  }
  isBannerDismissed.value = false;
  isBannerDelayReady.value = true;
  isBannerOpening.value = true;
  if (bannerOpenTimer) {
    clearTimeout(bannerOpenTimer);
  }
  bannerOpenTimer = setTimeout(() => {
    isBannerOpening.value = false;
    bannerOpenTimer = null;
  }, 220);
}

function handleMinervaSuggestionsMenuToggle() {
  showSuggestions.value = !showSuggestions.value;
  closeMinervaEditMenu();
}

function handleMinervaAddItem(value) {
  if (value === 'more') {
    isMinervaAddMenuExpanded.value = true;
    return;
  }
  if (value === 'fewer') {
    isMinervaAddMenuExpanded.value = false;
    return;
  }
  if (value === 'link') {
    openMinervaLinkDialog();
    closeMinervaAddMenu();
    return;
  }
  if (value === 'cite') {
    openMinervaCitationDialog();
    closeMinervaAddMenu();
    return;
  }
  closeMinervaAddMenu();
}

function getLinkableSelectionText(rangeOverride = null) {
  if (typeof window === 'undefined') return '';
  const selection = window.getSelection();
  const range = rangeOverride ||
    (selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null);
  if (!range) return '';
  const container = range.commonAncestorContainer;
  const element = container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement;
  if (!element || !element.closest('.article-text-editable')) {
    return '';
  }
  if (element.closest('a')) {
    return '';
  }
  const selectedText = range.toString().trim();
  if (selectedText) return selectedText;
  const resolveTextNode = (node, offset) => {
    if (node.nodeType === Node.TEXT_NODE) return { node, offset };
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const child = node.childNodes[offset] || node.childNodes[offset - 1];
    if (!child) return null;
    let current = child;
    while (current && current.nodeType !== Node.TEXT_NODE) {
      current = current.firstChild;
    }
    return current ? { node: current, offset: 0 } : null;
  };
  const resolved = resolveTextNode(range.startContainer, range.startOffset || 0);
  if (!resolved || !resolved.node || resolved.node.nodeType !== Node.TEXT_NODE) return '';
  const nodeText = resolved.node.textContent || '';
  const offset = resolved.offset ?? 0;
  const leftPart = nodeText.slice(0, offset);
  const rightPart = nodeText.slice(offset);
  const leftMatch = leftPart.match(/\\b[\\w-]+$/);
  const rightMatch = rightPart.match(/^[\\w-]+/);
  const word = `${leftMatch ? leftMatch[0] : ''}${rightMatch ? rightMatch[0] : ''}`.trim();
  return word;
}

function getLinkableWordRange(rangeOverride = null) {
  if (typeof window === 'undefined') return null;
  const selection = window.getSelection();
  const range = rangeOverride ||
    (selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null);
  if (!range) return null;
  const container = range.commonAncestorContainer;
  const element = container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement;
  if (!element || !element.closest('.article-text-editable')) return null;
  if (element.closest('a')) return null;
  const selectedText = range.toString().trim();
  if (selectedText) {
    return { text: selectedText, range: range.cloneRange() };
  }
  const resolveTextNode = (node, offset) => {
    if (node.nodeType === Node.TEXT_NODE) return { node, offset };
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const child = node.childNodes[offset] || node.childNodes[offset - 1];
    if (!child) return null;
    let current = child;
    while (current && current.nodeType !== Node.TEXT_NODE) {
      current = current.firstChild;
    }
    return current ? { node: current, offset: 0 } : null;
  };
  const resolved = resolveTextNode(range.startContainer, range.startOffset || 0);
  if (!resolved || !resolved.node || resolved.node.nodeType !== Node.TEXT_NODE) return null;
  const nodeText = resolved.node.textContent || '';
  const offset = resolved.offset ?? 0;
  const leftPart = nodeText.slice(0, offset);
  const rightPart = nodeText.slice(offset);
  const leftMatch = leftPart.match(/\\b[\\w-]+$/);
  const rightMatch = rightPart.match(/^[\\w-]+/);
  const word = `${leftMatch ? leftMatch[0] : ''}${rightMatch ? rightMatch[0] : ''}`.trim();
  if (!word) return null;
  const startOffset = offset - (leftMatch ? leftMatch[0].length : 0);
  const endOffset = offset + (rightMatch ? rightMatch[0].length : 0);
  const wordRange = document.createRange();
  wordRange.setStart(resolved.node, Math.max(0, startOffset));
  wordRange.setEnd(resolved.node, Math.max(startOffset, endOffset));
  return { text: word, range: wordRange };
}

function openMinervaLinkDialog() {
  const range = savedArticleSelectionRange ? savedArticleSelectionRange.cloneRange() : null;
  const wordInfo = getLinkableWordRange(range);
  if (!wordInfo) return;
  const selection = window.getSelection();
  if (selection && wordInfo.range) {
    selection.removeAllRanges();
    selection.addRange(wordInfo.range);
  }
  linkDialogText.value = wordInfo.text;
  linkDialogQuery.value = wordInfo.text;
  linkDialogExternalUrl.value = '';
  linkDialogTab.value = 'wikipedia';
  isMinervaAddLinkDialogOpen.value = true;
  nextTick(() => {
    onLinkSearchInput(wordInfo.text);
    const input = document.querySelector('#link-typeahead-search input');
    if (input) {
      input.value = wordInfo.text;
      input.dispatchEvent(new Event('input'));
    }
  });
}

function closeMinervaLinkDialog() {
  isMinervaAddLinkDialogOpen.value = false;
}

function openMinervaCitationDialog() {
  const range = savedArticleSelectionRange ? savedArticleSelectionRange.cloneRange() : null;
  const wordInfo = getLinkableWordRange(range);
  if (!wordInfo) return;
  const selection = window.getSelection();
  if (selection && wordInfo.range) {
    selection.removeAllRanges();
    selection.addRange(wordInfo.range);
  }
  citationDialogUrl.value = '';
  isMinervaAddCitationDialogOpen.value = true;
}

function closeMinervaCitationDialog() {
  isMinervaAddCitationDialogOpen.value = false;
}

function handleToolbarMouseDown() {
  if (typeof window === 'undefined') return;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const anchorNode = selection.anchorNode;
  if (!anchorNode) return;
  const element = anchorNode.nodeType === Node.ELEMENT_NODE ? anchorNode : anchorNode.parentElement;
  if (!element || !element.closest('.article-text-editable')) return;
  savedArticleSelectionRange = selection.getRangeAt(0).cloneRange();
  lastArticleEditableElement = element.closest('.article-text-editable');
}

function handleToolbarClick() {
  if (typeof window === 'undefined') return;
  if (!savedArticleSelectionRange) return;
  requestAnimationFrame(() => {
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(savedArticleSelectionRange);
    if (lastArticleEditableElement && typeof lastArticleEditableElement.focus === 'function') {
      lastArticleEditableElement.focus();
    }
  });
}

function openEditCheckFromSelection(selectionContainer) {
  const toneHighlight = toneCheckHighlightRef.value;
  const pasteHighlight = pasteCheckHighlightRef.value;
  const isInToneCheck = toneHighlight && toneHighlight.contains(selectionContainer);
  const isInPasteCheck = pasteHighlight && pasteHighlight.contains(selectionContainer);

  if (!isInToneCheck && !isInPasteCheck) {
    return false;
  }

  activeEditCheckTypeOverride.value = isInToneCheck ? 'tone' : 'paste';
  if (isMinervaSkin.value) {
    minervaSheetMode.value = 'edit-check';
    isMinervaSheetOpen.value = true;
    updateMinervaSheetHeight();
  } else {
    isEditCheckExpanded.value = true;
  }
  syncEditCheckHighlightState();
  return true;
}

function handleSelectionChange() {
  if (typeof window === 'undefined') return;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  const element = container.nodeType === Node.ELEMENT_NODE ? container : container.parentElement;
  if (element && openEditCheckFromSelection(element)) {
    return;
  }
  if (!element || !element.closest('.article-text-editable')) return;
  if (element.closest('a')) return;
  savedArticleSelectionRange = range.cloneRange();
  lastArticleEditableElement = element.closest('.article-text-editable');
}

function handleDocumentClick(event) {
  const target = event.target;
  if (isSkinMenuOpen.value) {
    const menuBtn = pageRoot.value?.querySelector('.menu-button');
    const menuPopup = pageRoot.value?.querySelector('.menu-popup');
    if (menuBtn && menuPopup) {
      if (!menuBtn.contains(target) && !menuPopup.contains(target)) {
        isSkinMenuOpen.value = false;
      }
    }
  }
  const getRefElement = (refValue) => {
    if (!refValue) return null;
    if (refValue instanceof HTMLElement) return refValue;
    if (refValue.$el instanceof HTMLElement) return refValue.$el;
    return null;
  };
  const tocButtonElement = getRefElement(minervaFullPageTocButtonRef.value);
  const tocPanelElement = getRefElement(minervaFullPageTocPanelRef.value);
  const sectionsButtonElement = getRefElement(minervaFullPageSectionsButtonRef.value);
  const sectionsPanelElement = getRefElement(minervaFullPageSectionsPanelRef.value);
  const shouldHandleFullPageTocOutsideClick = (
    isMinervaFullPageTocOpen.value ||
    showMinervaFullPageTocButtonUi.value ||
    showMinervaFullPageSectionsButtonUi.value
  );

  if (shouldHandleFullPageTocOutsideClick) {
    const clickedInsideTocButtonMode =
      tocPanelElement?.contains(target) ||
      tocButtonElement?.contains(target);
    const clickedInsideSectionsButtonMode =
      sectionsPanelElement?.contains(target) ||
      sectionsButtonElement?.contains(target);
    if (!clickedInsideTocButtonMode && !clickedInsideSectionsButtonMode) {
      if (isMinervaFullPageExpandableRailMode.value) {
        // No outside-click close in expandable rail mode.
      } else if (isMinervaFullPageSectionsButtonMode.value) {
        hideMinervaFullPageTocUi();
      } else {
        isMinervaFullPageTocOpen.value = false;
      }
    }
  }
  if (!isMinervaAddMenuOpen.value && !isMinervaEditMenuOpen.value && !isTextStyleMenuOpen.value) return;
  if (minervaAddMenuPanelRef.value?.contains(target)) return;
  if (minervaAddMenuTriggerRef.value?.contains(target)) return;
  if (minervaEditMenuPanelRef.value?.contains(target)) return;
  if (minervaEditMenuTriggerRef.value?.contains(target)) return;
  if (textStyleMenuPanelRef.value?.contains(target)) return;
  if (textStyleMenuTriggerRef.value?.contains(target)) return;
  closeMinervaAddMenu();
  closeMinervaEditMenu();
  closeTextStyleMenu();
}

function getSuggestionRefById(suggestionId) {
  if (suggestionId === 1) return highlightedTextRef;
  if (suggestionId === 2) return highlightedTextRef2;
  if (suggestionId === 3) return highlightedTextRef3;
  if (suggestionId === 4) return highlightedTextRef4;
  if (suggestionId === 5) return highlightedTextRef5;
  if (suggestionId === 6) return highlightedTextRef6;
  if (suggestionId === 7) return highlightedTextRef7;
  if (suggestionId === 8) return highlightedTextRef8;
  return null;
}

function handleMinervaPaginationPrev() {
  if (isMinervaPaginationPrevDisabled.value) return;
  const nextIndex = (minervaPaginationIndex.value - 1 + minervaPaginationItems.value.length) % minervaPaginationItems.value.length;
  const nextId = minervaPaginationItems.value[nextIndex];
  if (isEditCheckSheet.value) {
    openEditCheckAtType(nextId);
    return;
  }
  const targetRef = getSuggestionRefById(nextId);
  if (targetRef) {
    suppressMinervaReturnDirectionDuringPaginationScroll();
    openSuggestionAtTarget(nextId, targetRef, true);
  }
}

function handleMinervaPaginationNext() {
  if (isMinervaPaginationNextDisabled.value) return;
  const nextIndex = (minervaPaginationIndex.value + 1) % minervaPaginationItems.value.length;
  const nextId = minervaPaginationItems.value[nextIndex];
  if (isEditCheckSheet.value) {
    openEditCheckAtType(nextId);
    return;
  }
  const targetRef = getSuggestionRefById(nextId);
  if (targetRef) {
    suppressMinervaReturnDirectionDuringPaginationScroll();
    openSuggestionAtTarget(nextId, targetRef, true);
  }
}

function getEditCheckTargetByType(type) {
  if (type === 'paste') return pasteCheckHighlightRef.value;
  if (type === 'tone') return toneCheckHighlightRef.value;
  return null;
}

function openEditCheckAtType(type, expandAfterScroll = true) {
  if (!type || !isMinervaSkin.value) return;
  clearMinervaNoMoreSuggestionsState();
  const target = getEditCheckTargetByType(type);
  if (!target) return;
  activeEditCheckTypeOverride.value = type;
  minervaSheetMode.value = 'edit-check';
  isMinervaSheetOpen.value = true;
  syncEditCheckHighlightState();
  updateMinervaSheetHeight();
  if (expandAfterScroll && !isTargetVisibleInViewport(target)) {
    suppressMinervaReturnDirectionDuringAutoScroll(1400);
    startAutoScrollIndicator();
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function triggerMinervaDismiss(suggestionId) {
  dismissedSuggestionId.value = suggestionId;
  setTimeout(() => {
    if (dismissedSuggestionId.value === suggestionId) {
      dismissedSuggestionId.value = null;
    }
  }, 260);
}

function showPaginationNoMoreSuggestionsToast() {
  if (!shouldShowNoMoreSuggestionsLeftToast()) return;
  if (paginationNoSuggestionsToastTimer) {
    clearTimeout(paginationNoSuggestionsToastTimer);
  }
  showPaginationNoSuggestionsToast.value = true;
  paginationNoSuggestionsToastTimer = setTimeout(() => {
    showPaginationNoSuggestionsToast.value = false;
    paginationNoSuggestionsToastTimer = null;
  }, 2000);
}

function triggerSuggestionSuccessToast() {
  if (!toastsEnabled.value) return;
  if (suggestionSuccessToastTimer) {
    clearTimeout(suggestionSuccessToastTimer);
  }
  showSuggestionSuccessToast.value = true;
  suggestionSuccessToastTimer = setTimeout(() => {
    showSuggestionSuccessToast.value = false;
    suggestionSuccessToastTimer = null;
  }, 4000);
}

function getSuggestionSuccessAutoAdvanceDelay(wasCompleted = false) {
  return 0;
}

function shouldAdvanceMinervaSuggestionAfterResolve() {
  if (shouldAutoAdvancePaginationSuggestion.value) {
    return true;
  }
  if (isPaginationManualMode.value) {
    return false;
  }
  return showMinervaPagination.value;
}

function advanceMinervaSuggestion(currentId) {
  nextTick(() => {
    const ids = isPaginationMode.value
      ? getPendingSuggestionIdsForContext()
      : (currentId === 2 || currentId === 4)
        ? minervaPaginationIds.value.filter((id) => id === 2 || id === 4)
        : minervaPaginationIds.value;
    if (!ids.length) {
      closeMinervaSuggestion();
      showPaginationNoMoreSuggestionsToast();
      return;
    }
    const contextIds = getSuggestionIdsForCurrentContext();
    const currentOrderIndex = contextIds.indexOf(currentId);
    const nextId = isPaginationMode.value
      ? ids.find((id) => contextIds.indexOf(id) > currentOrderIndex) ?? ids[0]
      : ids[Math.max(0, Math.min(ids.indexOf(currentId), ids.length - 1))];
    const targetRef = getSuggestionRefById(nextId);
    if (targetRef) {
      openSuggestionAtTarget(nextId, targetRef, false);
    } else {
      closeMinervaSuggestion();
    }
  });
}

function advanceDesktopPaginationSuggestion(currentId) {
  nextTick(() => {
    const ids = getPendingSuggestionIdsForContext();
    if (!ids.length) {
      showPaginationNoMoreSuggestionsToast();
      return;
    }
    const contextIds = getSuggestionIdsForCurrentContext();
    const currentOrderIndex = contextIds.indexOf(currentId);
    const nextId = ids.find((id) => contextIds.indexOf(id) > currentOrderIndex) ?? ids[0];
    const targetRef = getSuggestionRefById(nextId);
    if (targetRef) {
      openSuggestionAtTarget(nextId, targetRef, true);
    }
  });
}

function advanceMinervaEditCheck(currentType) {
  nextTick(() => {
    const types = editCheckPaginationTypes.value;
    if (!types.length) {
      closeMinervaSuggestion();
      return;
    }
    const order = ['paste', 'tone'];
    const currentOrderIndex = order.indexOf(currentType);
    const nextType = types.find((type) => order.indexOf(type) > currentOrderIndex) ?? types[0];
    openEditCheckAtType(nextType, false);
  });
}

function handleMinervaSuggestionResolutionAfterAction(currentId, wasCompleted = false) {
  if (wasCompleted && isMinervaSkin.value && successHighlightOnCompleteEnabled.value && queueMinervaSuccessState(currentId)) {
    return;
  }
  const delay = getSuggestionSuccessAutoAdvanceDelay(wasCompleted);
  window.setTimeout(() => {
    nextTick(() => {
      if (maybeShowMinervaNoMoreSuggestionsState()) {
        return;
      }
      if (shouldAdvanceMinervaSuggestionAfterResolve()) {
        advanceMinervaSuggestion(currentId);
      } else {
        closeMinervaSuggestion();
      }
    });
  }, delay);
}

function handleBannerClose() {
  if (isBannerClosing.value || isBannerDismissed.value) return;
  forceEntryBannerSection.value = null;
  isBannerClosing.value = true;
  if (bannerCloseTimer) {
    clearTimeout(bannerCloseTimer);
  }
  bannerCloseTimer = setTimeout(() => {
    isBannerDismissed.value = true;
    isBannerClosing.value = false;
    bannerCloseTimer = null;
  }, 220);
}

function scheduleBannerReappear(delayMs = bannerReappearDelayMs) {
  if (isArrowOnceMode.value) return;
  if (!showSuggestions.value) return;
  if (activePrototype.value === 'option-2') {
    isArrowBounceActive.value = true;
  }
  isBannerDelayReady.value = false;
  if (bannerDelayTimer) {
    clearTimeout(bannerDelayTimer);
  }
  bannerDelayTimer = setTimeout(() => {
    if (isEditMode.value && showSuggestions.value && shouldShowBanner.value) {
      isBannerDelayReady.value = true;
    }
  }, delayMs);
}

function handleBannerClick() {
  const wasSuggestionsOff = !showSuggestions.value;
  forceEntryBannerSection.value = null;
  if (!showSuggestions.value) {
    showSuggestions.value = true;
  }
  if (activePrototype.value === 'option-4' || activePrototype.value === 'option-3') {
    startAutoScrollIndicator();
  }
  if (isFirstSuggestionNavigationMode.value) {
    isArrowBounceActive.value = false;
  }
  if (activePrototype.value === 'option-3' && isMinervaSkin.value) {
    hasUsedOption4Button.value = true;
  }
  nextTick(() => {
    openFirstPendingSuggestionForContext({
      openMinervaAfterScroll: isMinervaSkin.value && isPaginationMode.value
    });
  });
  if (isArrowOnceMode.value && isMinervaSkin.value && minervaEditSectionOnly.value) {
    minervaSectionBannerDismissed.value[minervaEditSectionOnly.value] = true;
  }
  if (wasSuggestionsOff && shouldShowToasts.value) {
    if (minervaToggleOnToastTimer) {
      clearTimeout(minervaToggleOnToastTimer);
    }
    minervaToggleOnToastTimer = setTimeout(() => {
      showMinervaToggleOnToast.value = true;
      minervaToggleOnToastTimer = setTimeout(() => {
        showMinervaToggleOnToast.value = false;
        minervaToggleOnToastTimer = null;
      }, 2000);
    }, 500);
  }
}

function handleBannerKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleBannerClick();
  }
}

function openFirstPendingSuggestionForContext({ openMinervaAfterScroll = false } = {}) {
  if (!isEditMode.value || !showSuggestions.value) return;

  if (isMinervaSkin.value && minervaEditSectionOnly.value) {
    const sectionToSuggestionId = {
      career: 1,
      poetry: 8,
      prose: 7
    };
    const sectionId = minervaEditSectionOnly.value;
    const suggestionId = sectionToSuggestionId[sectionId];
    const targetRef = getSuggestionRefById(suggestionId);
    if (suggestionId && targetRef && targetRef.value) {
      openSuggestionAtTarget(suggestionId, targetRef, true, { openMinervaAfterScroll });
      return;
    }
  }

  openFirstPendingSuggestion(true, { openMinervaAfterScroll });
}

function isFirstPendingSuggestionVisibleInViewport() {
  const firstId = getPendingSuggestionIdsForContext()[0];
  if (!firstId) return false;
  const targetRef = getSuggestionRefById(firstId);
  return Boolean(targetRef?.value && isTargetVisibleInViewport(targetRef.value));
}

function isAnyPendingSuggestionVisibleInViewport() {
  return getPendingSuggestionIdsForContext().some((id) => {
    const targetRef = getSuggestionRefById(id);
    return Boolean(targetRef?.value && isTargetVisibleInViewport(targetRef.value));
  });
}

function getSuggestionIdsForCurrentContext() {
  if (isMinervaSkin.value && minervaEditSectionOnly.value) {
    if (minervaEditSectionOnly.value === 'career') return [1];
    if (minervaEditSectionOnly.value === 'poetry') return [8, 6, 2, 4];
    if (minervaEditSectionOnly.value === 'prose') return [7, 3];
    if (minervaEditSectionOnly.value === 'theory') return [5];
    return [];
  }
  return [1, 8, 6, 2, 4, 7, 3, 5];
}

function getPendingSuggestionIdsForContext() {
  const ids = [];
  if (isMinervaSkin.value && minervaEditSectionOnly.value) {
    if (minervaEditSectionOnly.value === 'career' && isSuggestion1Pending.value) ids.push(1);
    if (minervaEditSectionOnly.value === 'poetry' && isSuggestion8Pending.value) ids.push(8);
    if (minervaEditSectionOnly.value === 'poetry' && isSuggestion6Pending.value) ids.push(6);
    if (minervaEditSectionOnly.value === 'poetry' && isSuggestion2Pending.value) ids.push(2);
    if (minervaEditSectionOnly.value === 'poetry' && isSuggestion4Pending.value) ids.push(4);
    if (minervaEditSectionOnly.value === 'prose' && isSuggestion7Pending.value) ids.push(7);
    if (minervaEditSectionOnly.value === 'prose' && isSuggestion3Pending.value) ids.push(3);
    if (minervaEditSectionOnly.value === 'theory' && isSuggestion5Pending.value) ids.push(5);
    return ids;
  }
  if (isSuggestion1Pending.value) ids.push(1);
  if (isSuggestion8Pending.value) ids.push(8);
  if (isSuggestion6Pending.value) ids.push(6);
  if (isSuggestion2Pending.value) ids.push(2);
  if (isSuggestion4Pending.value) ids.push(4);
  if (isSuggestion7Pending.value) ids.push(7);
  if (isSuggestion3Pending.value) ids.push(3);
  if (isSuggestion5Pending.value) ids.push(5);
  return ids;
}

function updateBannerArrowDirections() {
  if (
    !showSuggestions.value ||
    !(isFirstSuggestionNavigationMode.value || activePrototype.value === 'option-3')
  ) {
    showBannerArrowUp.value = false;
    showBannerArrowDown.value = true;
    return;
  }
  if (typeof window === 'undefined') return;
  const ids = getPendingSuggestionIdsForContext();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  let hasAbove = false;
  let hasBelow = false;
  ids.forEach((id) => {
    const targetRef = getSuggestionRefById(id);
    if (!targetRef || !targetRef.value) return;
    const rect = targetRef.value.getBoundingClientRect();
    if (rect.bottom <= 0) {
      hasAbove = true;
    } else if (rect.top >= viewportHeight) {
      hasBelow = true;
    }
  });
  showBannerArrowUp.value = hasAbove;
  showBannerArrowDown.value = isFirstSuggestionNavigationMode.value
    ? (hasBelow || (!hasAbove && !hasBelow))
    : hasBelow;
}

function updatePrimaryBannerDirection() {
  if (typeof window === 'undefined') return;
  const ids = getPendingSuggestionIdsForContext();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  let nearestDirection = null;
  let nearestDistance = Number.POSITIVE_INFINITY;
  ids.forEach((id) => {
    const targetRef = getSuggestionRefById(id);
    if (!targetRef || !targetRef.value) return;
    const rect = targetRef.value.getBoundingClientRect();
    if (rect.bottom <= 0) {
      const distance = Math.abs(rect.bottom);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestDirection = 'up';
      }
    } else if (rect.top >= viewportHeight) {
      const distance = rect.top - viewportHeight;
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestDirection = 'down';
      }
    }
  });
  showBannerPrimaryArrowUp.value = nearestDirection === 'up';
}

function syncMinervaArrowOnlyVisibility() {
  if (
    activePrototype.value !== 'option-3' ||
    !isMinervaSkin.value ||
    !isEditMode.value ||
    !showSuggestions.value ||
    availableSuggestionCount.value === 0 ||
    anySuggestionVisible.value
  ) {
    showMinervaArrowOnly.value = false;
    return;
  }

  showMinervaArrowOnly.value = true;
}

function clearScrollReappear() {
  if (scrollReappearTimer) {
    clearTimeout(scrollReappearTimer);
    scrollReappearTimer = null;
  }
}

function clearMinervaFullPageTocVisibilityTimer() {
  if (minervaFullPageTocShowTimer) {
    clearTimeout(minervaFullPageTocShowTimer);
    minervaFullPageTocShowTimer = null;
  }
  if (minervaFullPageTocHideTimer) {
    clearTimeout(minervaFullPageTocHideTimer);
    minervaFullPageTocHideTimer = null;
  }
  if (minervaFullPageTocScrollingTimer) {
    clearTimeout(minervaFullPageTocScrollingTimer);
    minervaFullPageTocScrollingTimer = null;
  }
  minervaFullPageTocScrollStartedAt = 0;
  isMinervaFullPageTocScrolling = false;
}

function clearMinervaFullPageManualScrollIntent() {
  if (minervaFullPageManualScrollIntentTimer) {
    clearTimeout(minervaFullPageManualScrollIntentTimer);
    minervaFullPageManualScrollIntentTimer = null;
  }
  isMinervaFullPageManualScrollIntent.value = false;
}

function clearMinervaFullPageSectionsPanelInactivityTimer() {
  if (minervaFullPageSectionsPanelInactivityTimer) {
    clearTimeout(minervaFullPageSectionsPanelInactivityTimer);
    minervaFullPageSectionsPanelInactivityTimer = null;
  }
}

function scheduleMinervaFullPageSectionsPanelInactivityClose() {
  if (!isMinervaFullPageSectionsButtonMode.value || !isMinervaFullPageTocOpen.value) return;
  clearMinervaFullPageSectionsPanelInactivityTimer();
  minervaFullPageSectionsPanelInactivityTimer = setTimeout(() => {
    isMinervaFullPageTocOpen.value = false;
    minervaFullPageSectionsPanelInactivityTimer = null;
  }, 3000);
}

function markMinervaFullPageManualScrollIntent() {
  if (!showMinervaFullPageSuggestionNavigation.value || !isMinervaFullPageSectionsButtonMode.value) {
    return;
  }
  isMinervaFullPageManualScrollIntent.value = true;
  if (minervaFullPageManualScrollIntentTimer) {
    clearTimeout(minervaFullPageManualScrollIntentTimer);
  }
  minervaFullPageManualScrollIntentTimer = setTimeout(() => {
    isMinervaFullPageManualScrollIntent.value = false;
    minervaFullPageManualScrollIntentTimer = null;
  }, 300);
}

function updateMinervaFullPageSectionsButtonPosition() {
  if (typeof window === 'undefined') return;
  const topOffset = Number.parseFloat(minervaFullPageSectionsNavTopOffset.value) || 0;
  const buttonHeight = 44;
  const viewportHeight = window.innerHeight;
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
  const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
  const availableTrack = Math.max(0, viewportHeight - topOffset - buttonHeight);
  minervaFullPageSectionsButtonTop.value = Math.round(progress * availableTrack);
}

function getMinervaFullPageSectionsTriggerButtonElement() {
  return minervaFullPageSectionsButtonRef.value?.$el?.querySelector?.('.cdx-button__button')
    ?? minervaFullPageSectionsButtonRef.value?.$el
    ?? minervaFullPageSectionsButtonRef.value
    ?? null;
}

function cleanupMinervaFullPageSectionsButtonDragState() {
  const triggerButton = getMinervaFullPageSectionsTriggerButtonElement();
  if (triggerButton instanceof Element && minervaFullPageSectionsButtonPointerId !== null && triggerButton.hasPointerCapture?.(minervaFullPageSectionsButtonPointerId)) {
    triggerButton.releasePointerCapture(minervaFullPageSectionsButtonPointerId);
  }
  isMinervaFullPageSectionsButtonDragging.value = false;
  minervaFullPageSectionsButtonPendingActivation = false;
  minervaFullPageSectionsButtonPointerId = null;
  minervaFullPageSectionsButtonPointerOffsetY = 22;
  minervaFullPageSectionsButtonPressStartY = 0;
  minervaFullPageSectionsButtonDragMoved = false;
  minervaFullPageSectionsButtonOpenedOnPointerDown = false;
  minervaFullPageSectionsButtonWasOpenOnPointerDown = false;
  window.removeEventListener('pointermove', handleMinervaFullPageSectionsButtonPointerMove);
  window.removeEventListener('pointerup', handleMinervaFullPageSectionsButtonPointerUp);
  window.removeEventListener('pointercancel', handleMinervaFullPageSectionsButtonPointerUp);
  window.removeEventListener('mouseup', handleMinervaFullPageSectionsButtonPointerUp);
  window.removeEventListener('touchend', handleMinervaFullPageSectionsButtonPointerUp);
  window.removeEventListener('touchcancel', handleMinervaFullPageSectionsButtonPointerUp);
}

function handleMinervaFullPageSectionsButtonPointerMove(event) {
  if (typeof window === 'undefined') return;
  if (minervaFullPageSectionsButtonPointerId !== null && typeof event.pointerId === 'number' && event.pointerId !== minervaFullPageSectionsButtonPointerId) return;
  if (minervaFullPageSectionsButtonPendingActivation && !isMinervaFullPageSectionsButtonDragging.value) {
    if (Math.abs(event.clientY - minervaFullPageSectionsButtonPressStartY) < 4) {
      return;
    }
    const triggerButton = getMinervaFullPageSectionsTriggerButtonElement();
    if (triggerButton instanceof Element && minervaFullPageSectionsButtonPointerId !== null) {
      triggerButton.setPointerCapture?.(minervaFullPageSectionsButtonPointerId);
    }
    minervaFullPageSectionsButtonPendingActivation = false;
    isMinervaFullPageSectionsButtonDragging.value = true;
  }
  if (!isMinervaFullPageSectionsButtonDragging.value) return;

  const topOffset = Number.parseFloat(minervaFullPageSectionsNavTopOffset.value) || 0;
  const buttonHeight = 44;
  const viewportHeight = window.innerHeight;
  const availableTrack = Math.max(0, viewportHeight - topOffset - buttonHeight);
  const pointerOffsetY = Number.isFinite(minervaFullPageSectionsButtonPointerOffsetY)
    ? minervaFullPageSectionsButtonPointerOffsetY
    : buttonHeight / 2;
  const nextTop = Math.max(0, Math.min(availableTrack, event.clientY - topOffset - pointerOffsetY));
  const progress = availableTrack > 0 ? nextTop / availableTrack : 0;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight);

  minervaFullPageSectionsButtonDragMoved = true;
  minervaFullPageSectionsButtonTop.value = Math.round(nextTop);
  clearMinervaFullPageSectionsPanelInactivityTimer();
  isMinervaFullPageTocOpen.value = true;
  showMinervaFullPageTocOnScroll.value = true;
  window.scrollTo({ top: progress * maxScroll, behavior: 'auto' });
}

function handleMinervaFullPageSectionsButtonPointerUp(event) {
  if (minervaFullPageSectionsButtonPendingActivation && !isMinervaFullPageSectionsButtonDragging.value) {
    const shouldCloseOpenPanel = minervaFullPageSectionsButtonWasOpenOnPointerDown && isMinervaFullPageTocOpen.value;
    cleanupMinervaFullPageSectionsButtonDragState();
    if (shouldCloseOpenPanel) {
      minervaFullPageSectionsButtonSuppressNextClick = true;
      hideMinervaFullPageTocUi();
    }
    return;
  }
  if (!isMinervaFullPageSectionsButtonDragging.value) return;
  const eventPointerId = typeof event?.pointerId === 'number' ? event.pointerId : null;
  if (minervaFullPageSectionsButtonPointerId !== null && eventPointerId !== null && eventPointerId !== minervaFullPageSectionsButtonPointerId) return;

  const hadDragMovement = minervaFullPageSectionsButtonDragMoved;
  if (minervaFullPageSectionsButtonDragMoved) {
    minervaFullPageSectionsButtonOpenedOnPointerDown = false;
  }
  cleanupMinervaFullPageSectionsButtonDragState();
  if (hadDragMovement) {
    minervaFullPageSectionsButtonSuppressNextClick = true;
  }
  scheduleMinervaFullPageTocHideDelay();
}

function handleMinervaFullPageSectionsButtonPointerDown(event) {
  if (!isMinervaFullPageSectionsButtonMode.value) return;
  const triggerButton = event.currentTarget instanceof Element
    ? event.currentTarget
    : getMinervaFullPageSectionsTriggerButtonElement();
  minervaFullPageSectionsButtonWasOpenOnPointerDown = isMinervaFullPageTocOpen.value;
  markMinervaFullPageManualScrollIntent();
  minervaFullPageSectionsButtonPointerId = event.pointerId ?? null;
  if (triggerButton instanceof Element) {
    const rect = triggerButton.getBoundingClientRect();
    minervaFullPageSectionsButtonPointerOffsetY = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
  } else {
    minervaFullPageSectionsButtonPointerOffsetY = 22;
  }
  minervaFullPageSectionsButtonPressStartY = event.clientY;
  clearMinervaFullPageSectionsPanelInactivityTimer();
  showMinervaFullPageTocOnScroll.value = true;
  if (isMinervaFullPageTocOpen.value) {
    isMinervaFullPageSectionsButtonDragging.value = false;
    minervaFullPageSectionsButtonPendingActivation = true;
    minervaFullPageSectionsButtonDragMoved = false;
    minervaFullPageSectionsButtonOpenedOnPointerDown = false;
    window.addEventListener('pointermove', handleMinervaFullPageSectionsButtonPointerMove);
    window.addEventListener('pointerup', handleMinervaFullPageSectionsButtonPointerUp);
    window.addEventListener('pointercancel', handleMinervaFullPageSectionsButtonPointerUp);
    window.addEventListener('mouseup', handleMinervaFullPageSectionsButtonPointerUp);
    window.addEventListener('touchend', handleMinervaFullPageSectionsButtonPointerUp);
    window.addEventListener('touchcancel', handleMinervaFullPageSectionsButtonPointerUp);
    return;
  }
  isMinervaFullPageSectionsButtonDragging.value = true;
  minervaFullPageSectionsButtonPendingActivation = false;
  minervaFullPageSectionsButtonDragMoved = false;
  minervaFullPageSectionsButtonOpenedOnPointerDown = true;
  if (triggerButton instanceof Element && minervaFullPageSectionsButtonPointerId !== null) {
    triggerButton.setPointerCapture?.(minervaFullPageSectionsButtonPointerId);
  }
  isMinervaFullPageTocOpen.value = true;
  updateMinervaFullPageTocActiveSection();
  window.addEventListener('pointermove', handleMinervaFullPageSectionsButtonPointerMove);
  window.addEventListener('pointerup', handleMinervaFullPageSectionsButtonPointerUp);
  window.addEventListener('pointercancel', handleMinervaFullPageSectionsButtonPointerUp);
  window.addEventListener('mouseup', handleMinervaFullPageSectionsButtonPointerUp);
  window.addEventListener('touchend', handleMinervaFullPageSectionsButtonPointerUp);
  window.addEventListener('touchcancel', handleMinervaFullPageSectionsButtonPointerUp);
}

function hideMinervaFullPageTocUi() {
  cleanupMinervaFullPageSectionsButtonDragState();
  clearMinervaFullPageManualScrollIntent();
  clearMinervaFullPageTocVisibilityTimer();
  clearMinervaFullPageSectionsPanelInactivityTimer();
  if (isMinervaFullPageSectionsButtonMode.value || !showSuggestions.value) {
    showMinervaFullPageTocOnScroll.value = false;
  }
  isMinervaFullPageTocOpen.value = false;
}

function suppressMinervaFullPageTocScrollVisibility(duration = 1400) {
  if (suppressMinervaFullPageTocScrollVisibilityTimer) {
    clearTimeout(suppressMinervaFullPageTocScrollVisibilityTimer);
  }
  hideMinervaFullPageTocUi();
  suppressMinervaFullPageTocScrollVisibilityTimer = setTimeout(() => {
    suppressMinervaFullPageTocScrollVisibilityTimer = null;
  }, duration);
}

function scheduleMinervaFullPageTocHideDelay() {
  if (!showMinervaFullPageTocOnScroll.value || isMinervaFullPageTocOpen.value || showSuggestions.value) return;
  if (minervaFullPageTocHideTimer) {
    clearTimeout(minervaFullPageTocHideTimer);
  }
  minervaFullPageTocHideTimer = setTimeout(() => {
    if (isMinervaFullPageTocOpen.value) {
      minervaFullPageTocHideTimer = null;
      return;
    }
    showMinervaFullPageTocOnScroll.value = false;
    isMinervaFullPageTocOpen.value = false;
    minervaFullPageTocHideTimer = null;
  }, isMinervaFullPageSectionsButtonMode.value ? 2500 : 3000);
}

function handleMinervaFullPageTocInteraction() {
  if (!showMinervaFullPageSuggestionNavigation.value || isLoading.value || !isMinervaFullPageTocReady.value) {
    return;
  }
  if (!showSuggestions.value || isMinervaFullPageSectionsButtonMode.value) {
    showMinervaFullPageTocOnScroll.value = true;
  }
  if (minervaFullPageTocShowTimer) {
    clearTimeout(minervaFullPageTocShowTimer);
    minervaFullPageTocShowTimer = null;
  }
  if (!showSuggestions.value || isMinervaFullPageSectionsButtonMode.value) {
    scheduleMinervaFullPageTocHideDelay();
  }
}

function handleMinervaFullPageSectionsPanelInteraction() {
  handleMinervaFullPageTocInteraction();
  if (isMinervaFullPageTocOpen.value) {
    scheduleMinervaFullPageSectionsPanelInactivityClose();
  }
}

function handleMinervaFullPageSectionsButtonClick() {
  if (minervaFullPageSectionsButtonSuppressNextClick) {
    minervaFullPageSectionsButtonSuppressNextClick = false;
    return;
  }
  if (minervaFullPageSectionsButtonDragMoved) {
    minervaFullPageSectionsButtonDragMoved = false;
    return;
  }
  if (minervaFullPageSectionsButtonOpenedOnPointerDown) {
    minervaFullPageSectionsButtonOpenedOnPointerDown = false;
    scheduleMinervaFullPageSectionsPanelInactivityClose();
    return;
  }
  if (isMinervaFullPageTocOpen.value) {
    hideMinervaFullPageTocUi();
    return;
  }
  toggleMinervaFullPageToc();
  scheduleMinervaFullPageSectionsPanelInactivityClose();
}

function handleMinervaFullPageTocScrollVisibility() {
  if (!showMinervaFullPageSuggestionNavigation.value || isLoading.value) {
    hideMinervaFullPageTocUi();
    return;
  }
  if (isMinervaFullPageSectionsButtonMode.value && hasMinervaExpandedSheet.value) {
    hideMinervaFullPageTocUi();
    return;
  }
  if (suppressMinervaFullPageTocScrollVisibilityTimer) {
    updateMinervaFullPageSectionsButtonPosition();
    return;
  }
  updateMinervaFullPageSectionsButtonPosition();
  if (isMinervaFullPageTocButtonMode.value && showSuggestions.value) {
    return;
  }
  if (isMinervaFullPageSectionsButtonMode.value && !isMinervaFullPageManualScrollIntent.value) {
    if (isMinervaFullPageTocOpen.value) {
      scheduleMinervaFullPageSectionsPanelInactivityClose();
    }
    if (showMinervaFullPageTocOnScroll.value && !isMinervaFullPageTocOpen.value) {
      scheduleMinervaFullPageTocHideDelay();
    }
    return;
  }
  if (isMinervaFullPageSectionsButtonMode.value && isMinervaFullPageTocOpen.value) {
    scheduleMinervaFullPageSectionsPanelInactivityClose();
  }
  if (!isMinervaFullPageTocScrolling) {
    isMinervaFullPageTocScrolling = true;
    minervaFullPageTocScrollStartedAt = Date.now();
    if (isMinervaFullPageSectionsButtonMode.value) {
      if (minervaFullPageTocShowTimer) {
        clearTimeout(minervaFullPageTocShowTimer);
      }
      minervaFullPageTocShowTimer = setTimeout(() => {
        minervaFullPageTocShowTimer = null;
        if (!showMinervaFullPageSuggestionNavigation.value || isLoading.value || !isMinervaFullPageTocScrolling) {
          return;
        }
        showMinervaFullPageTocOnScroll.value = true;
      }, 500);
    } else {
      showMinervaFullPageTocOnScroll.value = true;
    }
  }
  if (minervaFullPageTocHideTimer) {
    clearTimeout(minervaFullPageTocHideTimer);
    minervaFullPageTocHideTimer = null;
  }
  if (minervaFullPageTocScrollingTimer) {
    clearTimeout(minervaFullPageTocScrollingTimer);
  }
  minervaFullPageTocScrollingTimer = setTimeout(() => {
    isMinervaFullPageTocScrolling = false;
    minervaFullPageTocScrollStartedAt = 0;
    if (minervaFullPageTocShowTimer) {
      clearTimeout(minervaFullPageTocShowTimer);
      minervaFullPageTocShowTimer = null;
    }
    if (showMinervaFullPageTocOnScroll.value && !isMinervaFullPageTocOpen.value) {
      scheduleMinervaFullPageTocHideDelay();
    }
    if (isMinervaFullPageTocOpen.value && isMinervaFullPageSectionsButtonMode.value) {
      scheduleMinervaFullPageSectionsPanelInactivityClose();
    }
    minervaFullPageTocScrollingTimer = null;
  }, 180);
}

function handleScrollReappear() {
  if (activePrototype.value !== 'option-3') return;
  if (!isMinervaSkin.value) return;
  if (!showSuggestions.value) {
    clearScrollReappear();
    return;
  }
  if (anySuggestionVisible.value) {
    clearScrollReappear();
    return;
  }
  if (scrollReappearTimer) return;
  scrollReappearTimer = setTimeout(() => {
    if (activePrototype.value !== 'option-3') {
      scrollReappearTimer = null;
      return;
    }
    if (!isMinervaSkin.value) {
      scrollReappearTimer = null;
      return;
    }
    if (!showSuggestions.value || anySuggestionVisible.value) {
      scrollReappearTimer = null;
      return;
    }
    showMinervaArrowOnly.value = true;
    isBannerDismissed.value = false;
    isBannerDelayReady.value = true;
    isArrowBounceActive.value = true;
    updateBannerArrowDirections();
    scrollReappearTimer = null;
  }, 1000);
}

const editSectionRefs = {
  'early-life': editSectionEarlyLife,
  career: editSectionCareer,
  poetry: editSectionPoetry,
  prose: editSectionProse,
  film: editSectionFilm,
  theory: editSectionTheory
};

function getEditModeToolbarHeight() {
  if (typeof document === 'undefined') return 0;
  const toolbar = document.querySelector('.editor-toolbar');
  return toolbar instanceof HTMLElement ? toolbar.offsetHeight : 0;
}

function getMinervaEditToolbarHeight() {
  return getEditModeToolbarHeight();
}

function getEditSectionHeadingElement(sectionElement) {
  if (!(sectionElement instanceof HTMLElement)) return null;
  return sectionElement.querySelector('.heading-text-edit');
}

function scrollToEditSection(sectionId) {
  const targetRef = editSectionRefs[sectionId];
  const sectionElement = targetRef?.value;
  if (!(sectionElement instanceof HTMLElement) || typeof window === 'undefined') return;
  const heading = getEditSectionHeadingElement(sectionElement) || sectionElement;
  const toolbarHeight = getEditModeToolbarHeight();
  const targetTop = window.scrollY + heading.getBoundingClientRect().top - toolbarHeight;
  window.scrollTo({
    top: Math.max(0, Math.round(targetTop)),
    behavior: 'smooth'
  });
}

function getMinervaFullPageTocTargetElement(item) {
  if (!item || typeof document === 'undefined') return null;
  if (item.sectionId === 'top') return document.documentElement;
  const sectionRef = getEditSectionRefById(item.sectionId);
  if (!sectionRef?.value) return null;
  if (!item.subsectionTitle) return sectionRef.value;

  const sectionContainer = sectionRef.value.closest('.minerva-edit-section');
  if (!sectionContainer) return sectionRef.value;

  const candidateElements = Array.from(sectionContainer.querySelectorAll('.subsection-title, em'));
  const normalizedTarget = item.subsectionTitle.trim().toLowerCase();
  const match = candidateElements.find((element) => element.textContent?.trim().toLowerCase() === normalizedTarget);
  return match instanceof HTMLElement ? match : sectionRef.value;
}

function updateMinervaFullPageTocActiveSection() {
  if (!showMinervaFullPageSuggestionNavigation.value || typeof window === 'undefined') {
    activeMinervaFullPageTocSectionId.value = 'top';
    return;
  }
  const threshold = window.scrollY + getMinervaEditToolbarHeight() + 16;
  let activeSectionId = 'top';
  minervaFullPageTocFlatItems.value
    .filter((item) => item.id !== 'top')
    .forEach((item) => {
      const target = getMinervaFullPageTocTargetElement(item);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY;
      if (top <= threshold) {
        activeSectionId = item.id;
      }
    });
  activeMinervaFullPageTocSectionId.value = activeSectionId;
}

function scheduleMinervaFullPageTocReady() {
  if (typeof window === 'undefined') {
    isMinervaFullPageTocReady.value = true;
    return;
  }

  nextTick(() => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        if (!showMinervaFullPageSuggestionNavigation.value || isLoading.value) {
          return;
        }
        isMinervaFullPageTocReady.value = true;
        updateMinervaFullPageTocActiveSection();
      });
    });
  });
}

function toggleMinervaFullPageToc() {
  isMinervaFullPageTocOpen.value = !isMinervaFullPageTocOpen.value;
  handleMinervaFullPageTocInteraction();
  if (isMinervaFullPageTocOpen.value) {
    updateMinervaFullPageTocActiveSection();
  }
}

function isMinervaFullPageTocItemOpen(itemId) {
  return Boolean(
    minervaFullPageTocExpandedItems.value[itemId] ||
    minervaFullPageTocActivePathIds.value.includes(itemId)
  );
}

function toggleMinervaFullPageTocItem(itemId) {
  handleMinervaFullPageTocInteraction();
  minervaFullPageTocExpandedItems.value[itemId] = !isMinervaFullPageTocItemOpen(itemId);
}

function scrollToMinervaFullPageTocSection(item) {
  if (typeof window === 'undefined') return;
  if (!item || item.sectionId === 'top') {
    window.scrollTo({ top: 0, behavior: 'auto' });
    return;
  }
  const target = getMinervaFullPageTocTargetElement(item);
  if (!target) return;
  const toolbarHeight = getMinervaEditToolbarHeight();
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  const offsetTop = Math.max(0, targetTop - toolbarHeight - 8);
  window.scrollTo({ top: offsetTop, behavior: 'auto' });
}

function handleMinervaFullPageTocItemClick(item) {
  if (!item) return;
  activeMinervaFullPageTocSectionId.value = item.id;
  hideMinervaFullPageTocUi();
  if (isMinervaFullPageTocButtonMode.value && showSuggestions.value) {
    showMinervaFullPageTocOnScroll.value = true;
  } else {
    clearMinervaFullPageManualScrollIntent();
    suppressMinervaFullPageTocScrollVisibility();
  }
  scrollToMinervaFullPageTocSection(item);
}

function handleMinervaExpandableRailItemClick(item) {
  if (!item) return;
  activeMinervaFullPageTocSectionId.value = item.id;
  scrollToMinervaFullPageTocSection(item);
}

function updateSuggestionVisibility() {
  if (!showSuggestions.value) {
    anySuggestionVisible.value = false;
    updateVectorSuggestionsControlsVisibility();
    updateMinervaSheetReturnDirection();
    return;
  }
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const isVisible = (el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < viewportHeight;
  };
  const isQuarterVisible = (el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const height = rect.height || 1;
    const visibleTop = Math.max(rect.top, 0);
    const visibleBottom = Math.min(rect.bottom, viewportHeight);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    return visibleHeight / height >= 0.75;
  };
  anySuggestionVisible.value =
    isVisible(highlightedTextRef.value) ||
    isVisible(highlightedTextRef2.value) ||
    isVisible(highlightedTextRef4.value) ||
    isVisible(highlightedTextRef3.value) ||
    isVisible(highlightedTextRef6.value) ||
    isVisible(highlightedTextRef7.value) ||
    isVisible(highlightedTextRef8.value) ||
    isVisible(toneCheckHighlightRef.value) ||
    isVisible(pasteCheckHighlightRef.value);
  const pendingIds = getPendingSuggestionIdsForContext();
  const getRefForId = (id) => getSuggestionRefById(id);
  const fullyVisible = pendingIds
    .map((id) => {
      const ref = getRefForId(id);
      if (!ref || !ref.value) return null;
      const rect = ref.value.getBoundingClientRect();
      return { id, rect, ref: ref.value };
    })
    .filter((item) => item && isQuarterVisible(item.ref));
  const firstFullyVisibleId = fullyVisible.length
    ? fullyVisible.sort((a, b) => a.rect.top - b.rect.top)[0].id
    : null;

  if (firstSuggestionExpansionMode.value === 'auto-expand' &&
    firstFullyVisibleId &&
    firstSuggestionAutoExpandedId.value === null
  ) {
    firstSuggestionAutoExpandedId.value = firstFullyVisibleId;
    if (isMinervaSkin.value) {
      openMinervaSuggestion(firstFullyVisibleId);
    } else {
      isCardExpanded.value = firstFullyVisibleId === 1;
      isCardExpanded2.value = firstFullyVisibleId === 2;
      isCardExpanded4.value = firstFullyVisibleId === 4;
      isCardExpanded3.value = firstFullyVisibleId === 3;
    }
  }

  if (firstSuggestionExpansionMode.value === 'mobile-bounce-desktop-auto') {
    if (firstFullyVisibleId && firstSuggestionBounceDoneId.value === null) {
      firstSuggestionBounceActiveId.value = firstFullyVisibleId;
    } else if (!firstFullyVisibleId) {
      firstSuggestionBounceActiveId.value = null;
    }
  }
  syncMinervaSheetToVisibleSuggestion(viewportHeight);
  updateBannerArrowDirections();
  updatePrimaryBannerDirection();
  updateVectorSuggestionsControlsVisibility();
  updateMinervaSheetReturnDirection();
}

function updateVectorSuggestionsControlsVisibility() {
  if (
    isMinervaSkin.value ||
    !isEditMode.value ||
    !showDesktopFeedbackControls.value ||
    !vectorSuggestionsControlsRef.value
  ) {
    desktopSuggestionsControlsHidden.value = false;
    return;
  }

  const controlsRect = vectorSuggestionsControlsRef.value.getBoundingClientRect();
  const threshold = 200;
  const suggestionCardRefs = [
    suggestionsSidebarRef,
    suggestionsSidebarRef2,
    suggestionsSidebarRef3,
    suggestionsSidebarRef4,
    suggestionsSidebarRef5,
    suggestionsSidebarRef6,
    suggestionsSidebarRef7,
    suggestionsSidebarRef8
  ];

  desktopSuggestionsControlsHidden.value = suggestionCardRefs
    .map((ref) => ref.value)
    .filter(Boolean)
    .some((card) => {
      const rect = card.getBoundingClientRect();
      return rect.bottom > controlsRect.top - threshold && rect.top <= controlsRect.bottom + threshold;
    });
}

function syncMinervaSheetToVisibleSuggestion(viewportHeight = window.innerHeight || document.documentElement.clientHeight) {
  if (
    !isMinervaSkin.value ||
    activePrototype.value !== 'option-3' ||
    !isMinervaSheetOpen.value ||
    isEditCheckSheet.value
  ) {
    minervaLastScrollY.value = typeof window !== 'undefined' ? window.scrollY : 0;
    return;
  }
  const sheet = minervaSheetRef.value;
  if (!sheet) {
    minervaLastScrollY.value = window.scrollY;
    return;
  }
  const availableBottom = sheet.getBoundingClientRect().top;
  const scrollY = window.scrollY;
  const scrollDirection = scrollY > minervaLastScrollY.value
    ? 'down'
    : scrollY < minervaLastScrollY.value
      ? 'up'
      : null;
  minervaLastScrollY.value = scrollY;

  const visibleSuggestions = getPendingSuggestionIdsForContext()
    .map((id) => {
      const targetRef = getSuggestionRefById(id);
      if (!targetRef || !targetRef.value) return null;
      const rect = targetRef.value.getBoundingClientRect();
      const isVisibleAboveSheet = rect.bottom > 0 && rect.top < availableBottom;
      if (!isVisibleAboveSheet) return null;
      return { id, rect };
    })
    .filter(Boolean)
    .sort((a, b) => a.rect.top - b.rect.top);

  if (!visibleSuggestions.length) {
    return;
  }
  let nextVisibleSuggestion = visibleSuggestions[0];
  if (visibleSuggestions.some((item) => item.id === activeMinervaSuggestion.value)) {
    if (scrollDirection === 'down') {
      nextVisibleSuggestion = visibleSuggestions[visibleSuggestions.length - 1];
    } else if (scrollDirection === 'up') {
      nextVisibleSuggestion = visibleSuggestions[0];
    } else {
      nextVisibleSuggestion = visibleSuggestions.find((item) => item.id === activeMinervaSuggestion.value) || visibleSuggestions[0];
    }
  } else if (scrollDirection === 'down') {
    nextVisibleSuggestion = visibleSuggestions[visibleSuggestions.length - 1];
  }

  if (nextVisibleSuggestion.id !== activeMinervaSuggestion.value) {
    openMinervaSuggestionSheet(nextVisibleSuggestion.id);
  }
}

function updateEditToolbarScrolled() {
  if (typeof window === 'undefined') return;
  isEditToolbarScrolled.value = window.scrollY > 0;
}

function handleReadModeScroll() {
  const y = window.scrollY;
  hasScrolledForToast.value = y > 150;
  isHeaderFixed.value = y > 150;
  // Track current read section
  if (!isEditMode.value) {
    const sections = ['early-life', 'career', 'poetry', 'prose', 'film', 'theory'];
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = document.querySelector(`[data-read-section="${sections[i]}"]`);
      if (el && el.getBoundingClientRect().top <= 120) {
        currentReadSection.value = sections[i];
        break;
      }
      if (i === 0) currentReadSection.value = null;
    }
  }
}

function handleReadModeToastClick() {
  isReadModeToastDismissed.value = true;
  // Navigate to section in edit mode
  const section = currentReadSection.value;
  if (section) {
    openEditAtSection(section);
  } else {
    startPrototype();
  }
}

function handleReadClick() {
  closePrototypeDialog();
  if (isEditMode.value) {
    exitEditMode();
  }
}

// Function to handle "Yes" click on suggestion 1
function handleYesSuggestion1() {
  showCitationPopup1.value = true;
}

// Function to handle "Yes" click on suggestion 2
function handleYesSuggestion2() {
  showCitationPopup2.value = true;
}

// Function to handle "Yes" click on suggestion 3
function handleYesSuggestion3() {
  showCitationPopup3.value = true;
}

// Function to handle "No" click on suggestion 1 (decline/skip)
function handleNoSuggestion1() {
  isSuggestionDeclined1.value = true;
  isCardExpanded.value = false;
  if (isMinervaSkin.value && (activePrototype.value === 'option-1' || isArrowOnceMode.value)) {
    triggerMinervaDismiss(1);
    setTimeout(() => {
      handleMinervaSuggestionResolutionAfterAction(1);
    }, 260);
  } else {
    closeMinervaSuggestion();
  }
  scheduleBannerReappear();
}

// Function to handle "No" click on suggestion 2 (decline/skip)
function handleNoSuggestion2() {
  isSuggestionDeclined2.value = true;
  isCardExpanded2.value = false;
  if (isMinervaSkin.value && (activePrototype.value === 'option-1' || isArrowOnceMode.value)) {
    triggerMinervaDismiss(2);
    setTimeout(() => {
      handleMinervaSuggestionResolutionAfterAction(2);
    }, 260);
  } else {
    closeMinervaSuggestion();
  }
  scheduleBannerReappear();
}

// Function to handle "No" click on suggestion 3 (decline/skip)
function handleNoSuggestion3() {
  isSuggestionDeclined3.value = true;
  isCardExpanded3.value = false;
  if (isMinervaSkin.value && (activePrototype.value === 'option-1' || isArrowOnceMode.value)) {
    triggerMinervaDismiss(3);
    setTimeout(() => {
      handleMinervaSuggestionResolutionAfterAction(3);
    }, 260);
  } else {
    closeMinervaSuggestion();
  }
  scheduleBannerReappear();
}

function handleYesSuggestion4() {
  isSuggestionResolved4.value = true;
  activateSuccessHighlight(4);
  isCardExpanded4.value = false;
  if (isMinervaSkin.value) {
    handleMinervaSuggestionResolutionAfterAction(4, true);
  } else {
    closeMinervaSuggestion();
  }
  triggerSuggestionSuccessToast();
  nextTick(() => {
    alignSidebarWithText4();
    updateSuggestionVisibility();
    scheduleBannerReappear();
  });
}

function handleNoSuggestion4() {
  isSuggestionDeclined4.value = true;
  isCardExpanded4.value = false;
  if (isMinervaSkin.value && (activePrototype.value === 'option-1' || isArrowOnceMode.value)) {
    triggerMinervaDismiss(4);
    setTimeout(() => {
      handleMinervaSuggestionResolutionAfterAction(4);
    }, 260);
  } else {
    closeMinervaSuggestion();
  }
  scheduleBannerReappear();
}

function handleResolveGenericSuggestion(suggestionId) {
  activateSuccessHighlight(suggestionId);
  if (suggestionId === 5) {
    isSuggestionResolved5.value = true;
    isCardExpanded5.value = false;
  } else if (suggestionId === 6) {
    isSuggestionResolved6.value = true;
    isCardExpanded6.value = false;
  } else if (suggestionId === 7) {
    isSuggestionResolved7.value = true;
    isCardExpanded7.value = false;
  } else if (suggestionId === 8) {
    isSuggestionResolved8.value = true;
    isCardExpanded8.value = false;
  }
  if (isMinervaSkin.value) {
    handleMinervaSuggestionResolutionAfterAction(suggestionId, true);
  } else {
    closeMinervaSuggestion();
  }
  triggerSuggestionSuccessToast();
  nextTick(() => {
    alignBothSuggestions();
    updateSuggestionVisibility();
    scheduleBannerReappear();
  });
}

function handleDeclineGenericSuggestion(suggestionId) {
  if (suggestionId === 5) {
    isSuggestionDeclined5.value = true;
    isCardExpanded5.value = false;
  } else if (suggestionId === 6) {
    isSuggestionDeclined6.value = true;
    isCardExpanded6.value = false;
  } else if (suggestionId === 7) {
    isSuggestionDeclined7.value = true;
    isCardExpanded7.value = false;
  } else if (suggestionId === 8) {
    isSuggestionDeclined8.value = true;
    isCardExpanded8.value = false;
  }
  if (isMinervaSkin.value && (activePrototype.value === 'option-1' || isArrowOnceMode.value)) {
    triggerMinervaDismiss(suggestionId);
    setTimeout(() => {
      handleMinervaSuggestionResolutionAfterAction(suggestionId);
    }, 260);
  } else {
    closeMinervaSuggestion();
  }
  nextTick(() => {
    alignBothSuggestions();
    updateSuggestionVisibility();
    scheduleBannerReappear();
  });
}

// Function to create citation for suggestion 1
function createCitation1() {
  if (citationUrl1.value.trim()) {
    citationCounter.value++;
    citationNumber1.value = citationCounter.value;
    activateSuccessHighlight(1);
    showCitationPopup1.value = false;
    if (isMinervaSkin.value) {
      handleMinervaSuggestionResolutionAfterAction(1, true);
    } else {
      closeMinervaSuggestion();
    }
    triggerSuggestionSuccessToast();
    nextTick(() => {
      updateSuggestionVisibility();
      scheduleBannerReappear();
    });
  }
}

// Function to create citation for suggestion 2
function createCitation2() {
  if (citationUrl2.value.trim()) {
    citationCounter.value++;
    citationNumber2.value = citationCounter.value;
    activateSuccessHighlight(2);
    showCitationPopup2.value = false;
    if (isMinervaSkin.value) {
      handleMinervaSuggestionResolutionAfterAction(2, true);
    } else {
      closeMinervaSuggestion();
    }
    triggerSuggestionSuccessToast();
    nextTick(() => {
      updateSuggestionVisibility();
      scheduleBannerReappear();
    });
  }
}

// Function to create citation for suggestion 3
function createCitation3() {
  if (citationUrl3.value.trim()) {
    citationCounter.value++;
    citationNumber3.value = citationCounter.value;
    activateSuccessHighlight(3);
    showCitationPopup3.value = false;
    if (isMinervaSkin.value) {
      handleMinervaSuggestionResolutionAfterAction(3, true);
    } else {
      closeMinervaSuggestion();
    }
    triggerSuggestionSuccessToast();
    nextTick(() => {
      updateSuggestionVisibility();
      scheduleBannerReappear();
    });
  }
}

// Watch to ensure only one suggestion is expanded at a time
watch(isCardExpanded, (newValue) => {
  if (newValue) {
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
    isCardExpanded4.value = false;
    isCardExpanded5.value = false;
    isCardExpanded6.value = false;
    isCardExpanded7.value = false;
    isCardExpanded8.value = false;
  }
});

watch(isCardExpanded2, (newValue) => {
  if (newValue) {
    isCardExpanded.value = false;
    isCardExpanded3.value = false;
    isCardExpanded4.value = false;
    isCardExpanded5.value = false;
    isCardExpanded6.value = false;
    isCardExpanded7.value = false;
    isCardExpanded8.value = false;
  }
});

watch(isCardExpanded3, (newValue) => {
  if (newValue) {
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
    isCardExpanded4.value = false;
    isCardExpanded5.value = false;
    isCardExpanded6.value = false;
    isCardExpanded7.value = false;
    isCardExpanded8.value = false;
  }
});

watch(isCardExpanded4, (newValue) => {
  if (newValue) {
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
    isCardExpanded5.value = false;
    isCardExpanded6.value = false;
    isCardExpanded7.value = false;
    isCardExpanded8.value = false;
  }
});

watch(isCardExpanded5, (newValue) => {
  if (newValue) {
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
    isCardExpanded4.value = false;
    isCardExpanded6.value = false;
    isCardExpanded7.value = false;
    isCardExpanded8.value = false;
  }
});

watch(isCardExpanded6, (newValue) => {
  if (newValue) {
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
    isCardExpanded4.value = false;
    isCardExpanded5.value = false;
    isCardExpanded7.value = false;
    isCardExpanded8.value = false;
  }
});

watch(isCardExpanded7, (newValue) => {
  if (newValue) {
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
    isCardExpanded4.value = false;
    isCardExpanded5.value = false;
    isCardExpanded6.value = false;
    isCardExpanded8.value = false;
  }
});

watch(isCardExpanded8, (newValue) => {
  if (newValue) {
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
    isCardExpanded4.value = false;
    isCardExpanded5.value = false;
    isCardExpanded6.value = false;
    isCardExpanded7.value = false;
  }
});

watch(
  () => [
    isCardExpanded.value,
    isCardExpanded8.value,
    isCardExpanded6.value,
    isCardExpanded2.value,
    isCardExpanded4.value,
    isCardExpanded7.value,
    isCardExpanded3.value
  ],
  (values) => {
    if (
      !isMinervaSkin.value &&
      isPaginationMode.value &&
      values.some(Boolean)
    ) {
      hasOpenedDesktopPagination.value = true;
    }
  }
);

// Function to calculate and align sidebar with highlighted text
function alignSidebarWithText() {
  if (!highlightedTextRef.value) return;
  
  nextTick(() => {
    // Get the main-content-area container
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    
    const textRect = highlightedTextRef.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    
    // Calculate the offset of highlighted text from the top of main-content-area
    const offset = textRect.top - containerRect.top - suggestionsTopOffset.value;
    sidebarTopOffset.value = offset;
  });
}

// Watch for changes in showSuggestions to realign
watch(showSuggestions, (newValue) => {
  if (newValue) {
    nextTick(() => {
      alignBothSuggestions();
    });
  } else {
    sidebarTopOffset.value = 0;
    showMinervaArrowOnly.value = false;
    firstSuggestionAutoExpandedId.value = null;
    firstSuggestionBounceActiveId.value = null;
    firstSuggestionBounceDoneId.value = null;
  }
});

watch(
  () => [citationNumber1.value, isSuggestionDeclined1.value, showSuccessMessage1.value],
  () => {
    if (citationNumber1.value !== null || isSuggestionDeclined1.value || showSuccessMessage1.value) {
      firstSuggestionAutoExpandedId.value = null;
      firstSuggestionBounceDoneId.value = null;
      firstSuggestionBounceActiveId.value = null;
    }
  }
);

watch(
  () => [citationNumber2.value, isSuggestionDeclined2.value, showSuccessMessage2.value],
  () => {
    if (citationNumber2.value !== null || isSuggestionDeclined2.value || showSuccessMessage2.value) {
      if (firstSuggestionAutoExpandedId.value === 2) firstSuggestionAutoExpandedId.value = null;
      if (firstSuggestionBounceDoneId.value === 2) firstSuggestionBounceDoneId.value = null;
      if (firstSuggestionBounceActiveId.value === 2) firstSuggestionBounceActiveId.value = null;
    }
  }
);

watch(
  () => [citationNumber3.value, isSuggestionDeclined3.value, showSuccessMessage3.value],
  () => {
    if (citationNumber3.value !== null || isSuggestionDeclined3.value || showSuccessMessage3.value) {
      if (firstSuggestionAutoExpandedId.value === 3) firstSuggestionAutoExpandedId.value = null;
      if (firstSuggestionBounceDoneId.value === 3) firstSuggestionBounceDoneId.value = null;
      if (firstSuggestionBounceActiveId.value === 3) firstSuggestionBounceActiveId.value = null;
    }
  }
);

watch(
  () => [isSuggestionResolved4.value, isSuggestionDeclined4.value, showSuccessMessage4.value],
  () => {
    if (isSuggestionResolved4.value || isSuggestionDeclined4.value || showSuccessMessage4.value) {
      if (firstSuggestionAutoExpandedId.value === 4) firstSuggestionAutoExpandedId.value = null;
      if (firstSuggestionBounceDoneId.value === 4) firstSuggestionBounceDoneId.value = null;
      if (firstSuggestionBounceActiveId.value === 4) firstSuggestionBounceActiveId.value = null;
    }
  }
);

watch(isCardExpanded, (expanded) => {
  if (expanded && firstSuggestionExpansionMode.value === 'mobile-bounce-desktop-auto') {
    firstSuggestionBounceActiveId.value = null;
    firstSuggestionBounceDoneId.value = 1;
  }
});

watch(isCardExpanded2, (expanded) => {
  if (expanded && firstSuggestionExpansionMode.value === 'mobile-bounce-desktop-auto') {
    firstSuggestionBounceActiveId.value = null;
    firstSuggestionBounceDoneId.value = 2;
  }
  nextTick(() => {
    alignSidebarWithText4();
  });
});

watch(isCardExpanded3, (expanded) => {
  if (expanded && firstSuggestionExpansionMode.value === 'mobile-bounce-desktop-auto') {
    firstSuggestionBounceActiveId.value = null;
    firstSuggestionBounceDoneId.value = 3;
  }
});

watch(isCardExpanded4, () => {
  nextTick(() => {
    alignSidebarWithText4();
  });
});

watch(isCardExpanded5, () => {
  nextTick(() => {
    alignSidebarWithText5();
  });
});

watch(isCardExpanded6, () => {
  nextTick(() => {
    alignSidebarWithText6();
  });
});

watch(isCardExpanded7, () => {
  nextTick(() => {
    alignSidebarWithText7();
  });
});

watch(isCardExpanded8, () => {
  nextTick(() => {
    alignSidebarWithText8();
  });
});

watch(
  () => [isMinervaSheetOpen.value, activeMinervaSuggestion.value],
  ([open, suggestionId]) => {
    if (open && firstSuggestionExpansionMode.value === 'mobile-bounce-desktop-auto') {
      firstSuggestionBounceActiveId.value = null;
      firstSuggestionBounceDoneId.value = suggestionId;
    }
  }
);

// Watch for changes in isEditMode to realign
watch(isEditMode, (newValue) => {
  if (newValue && showSuggestions.value) {
    nextTick(() => {
      alignBothSuggestions();
    });
  }
  if (!newValue) {
    showMinervaArrowOnly.value = false;
  }
  if (newValue && isMinervaSkin.value && activePrototype.value === 'option-3') {
    nextTick(() => {
      updateSuggestionVisibility();
      syncMinervaArrowOnlyVisibility();
    });
  }
});

watch(toastsEnabled, (enabled) => {
  if (enabled) return;
  showMinervaToggleOffToast.value = false;
  showMinervaToggleOnToast.value = false;
  showMinervaMoreSuggestionsToast.value = false;
  showMinervaZeroSuggestionsToast.value = false;
  showPaginationNoSuggestionsToast.value = false;
  showSuggestionSuccessToast.value = false;
  if (minervaToggleOffToastTimer) {
    clearTimeout(minervaToggleOffToastTimer);
    minervaToggleOffToastTimer = null;
  }
  if (minervaToggleOnToastTimer) {
    clearTimeout(minervaToggleOnToastTimer);
    minervaToggleOnToastTimer = null;
  }
  if (minervaMoreSuggestionsToastTimer) {
    clearTimeout(minervaMoreSuggestionsToastTimer);
    minervaMoreSuggestionsToastTimer = null;
  }
  if (minervaZeroSuggestionsToastTimer) {
    clearTimeout(minervaZeroSuggestionsToastTimer);
    minervaZeroSuggestionsToastTimer = null;
  }
  if (paginationNoSuggestionsToastTimer) {
    clearTimeout(paginationNoSuggestionsToastTimer);
    paginationNoSuggestionsToastTimer = null;
  }
  if (suggestionSuccessToastTimer) {
    clearTimeout(suggestionSuccessToastTimer);
    suggestionSuccessToastTimer = null;
  }
});


// Function to calculate and align second sidebar with highlighted text
function alignSidebarWithText2() {
  if (!highlightedTextRef2.value) return;
  
  nextTick(() => {
    // Get the main-content-area container
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    
    const textRect = highlightedTextRef2.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    
    // Calculate the offset of highlighted text from the top of main-content-area
    const offset = textRect.top - containerRect.top - suggestionsTopOffset.value;
    sidebarTopOffset2.value = offset;
  });
}

// Function to calculate and align third sidebar with highlighted text
function alignSidebarWithText3() {
  if (!highlightedTextRef3.value) return;
  
  nextTick(() => {
    // Get the main-content-area container
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    
    const textRect = highlightedTextRef3.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    
    // Calculate the offset of highlighted text from the top of main-content-area
    const offset = textRect.top - containerRect.top - suggestionsTopOffset.value;
    sidebarTopOffset3.value = offset;
  });
}

function alignSidebarWithText4() {
  nextTick(() => {
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    const containerRect = mainContentArea.getBoundingClientRect();
    if (suggestionsSidebarRef2.value) {
      const secondCardRect = suggestionsSidebarRef2.value.getBoundingClientRect();
      sidebarTopOffset4.value = secondCardRect.bottom - containerRect.top - suggestionsTopOffset.value + 8;
      return;
    }
    if (highlightedTextRef4.value) {
      const textRect = highlightedTextRef4.value.getBoundingClientRect();
      sidebarTopOffset4.value = textRect.top - containerRect.top - suggestionsTopOffset.value;
    }
  });
}

function alignSidebarWithText5() {
  if (!highlightedTextRef5.value) return;
  nextTick(() => {
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    const textRect = highlightedTextRef5.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    sidebarTopOffset5.value = textRect.top - containerRect.top - suggestionsTopOffset.value;
  });
}

function alignSidebarWithText6() {
  if (!highlightedTextRef6.value) return;
  nextTick(() => {
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    const textRect = highlightedTextRef6.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    sidebarTopOffset6.value = textRect.top - containerRect.top - suggestionsTopOffset.value;
  });
}

function alignSidebarWithText7() {
  if (!highlightedTextRef7.value) return;
  nextTick(() => {
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    const textRect = highlightedTextRef7.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    sidebarTopOffset7.value = textRect.top - containerRect.top - suggestionsTopOffset.value;
  });
}

function alignSidebarWithText8() {
  if (!highlightedTextRef8.value) return;
  nextTick(() => {
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;
    const textRect = highlightedTextRef8.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    sidebarTopOffset8.value = textRect.top - containerRect.top - suggestionsTopOffset.value;
  });
}

function alignSuggestionsContainer() {
  if (!articleFirstSectionRef.value) return;

  nextTick(() => {
    const mainContentArea = document.querySelector('.main-content-area');
    if (!mainContentArea) return;

    const sectionRect = articleFirstSectionRef.value.getBoundingClientRect();
    const containerRect = mainContentArea.getBoundingClientRect();
    const offset = sectionRect.top - containerRect.top;
    suggestionsTopOffset.value = Math.max(0, offset);
  });
}

// Function to align both suggestions
function alignBothSuggestions() {
  alignSuggestionsContainer();
  alignSidebarWithText();
  alignSidebarWithText2();
  alignSidebarWithText3();
  alignSidebarWithText4();
  alignSidebarWithText5();
  alignSidebarWithText6();
  alignSidebarWithText7();
  alignSidebarWithText8();
  alignToneCheckCard();
  nextTick(() => {
    updateVectorSuggestionsControlsVisibility();
  });
}

// Watch for changes in showSuggestions to realign both
watch(showSuggestions, (newValue) => {
  if (newValue) {
    if (activePrototype.value === 'option-2') {
      isArrowBounceActive.value = true;
    }
    updateBannerArrowDirections();
    updatePrimaryBannerDirection();
    if (!isArrowOnceMode.value &&
      !(isMinervaSkin.value && (activePrototype.value === 'option-1' || isArrowOnceMode.value))) {
      isBannerDismissed.value = false;
    }
    if (showSuggestionToggle.value) {
      isBannerDelayReady.value = false;
      if (bannerDelayTimer) {
        clearTimeout(bannerDelayTimer);
      }
      bannerDelayTimer = setTimeout(() => {
        if (isEditMode.value && showSuggestions.value) {
          isBannerDelayReady.value = true;
        }
      }, 1000);
    }
    nextTick(() => {
      alignBothSuggestions();
      updateSuggestionVisibility();
      updateToneCheckFromContent();
      syncMinervaArrowOnlyVisibility();
    });
  } else {
    updateToneCheckFromContent();
    clearScrollReappear();
    if (isArrowOnceMode.value) {
      isBannerDelayReady.value = true;
      if (!isBannerDismissed.value) {
        isBannerDismissed.value = false;
      }
    }
    sidebarTopOffset.value = 0;
    sidebarTopOffset2.value = 0;
    sidebarTopOffset3.value = 0;
    sidebarTopOffset4.value = 0;
    suggestionsTopOffset.value = 0;
    closeMinervaSuggestion();
    syncMinervaArrowOnlyVisibility();
  }
});

watch(showSuggestions, (newValue, oldValue) => {
  if (!newValue && oldValue && isMinervaSkin.value) {
    if (minervaToggleOffToastTimer) {
      clearTimeout(minervaToggleOffToastTimer);
    }
    minervaToggleOffToastTimer = setTimeout(() => {
      if (!shouldShowToasts.value) return;
      showMinervaToggleOffToast.value = true;
      minervaToggleOffToastTimer = setTimeout(() => {
        showMinervaToggleOffToast.value = false;
        minervaToggleOffToastTimer = null;
      }, 2000);
    }, 500);
  }
  if (newValue && showMinervaToggleOffToast.value) {
    showMinervaToggleOffToast.value = false;
  }
  if (newValue && !oldValue && isMinervaSkin.value) {
    if (minervaToggleOnToastTimer) {
      clearTimeout(minervaToggleOnToastTimer);
    }
    minervaToggleOnToastTimer = setTimeout(() => {
      if (!shouldShowToasts.value) return;
      showMinervaToggleOnToast.value = true;
      minervaToggleOnToastTimer = setTimeout(() => {
        showMinervaToggleOnToast.value = false;
        minervaToggleOnToastTimer = null;
      }, 2000);
    }, 500);
  }
  if (newValue && !oldValue) {
    showSuggestionsDisplay.value = true;
    isSuggestionsFadingOut.value = false;
    isSuggestionMarkersVisible.value = false;
    isSuggestionLightFlash.value = true;
    if (suggestionLightTimer) {
      clearTimeout(suggestionLightTimer);
    }
    suggestionLightTimer = setTimeout(() => {
      isSuggestionLightFlash.value = false;
      suggestionLightTimer = null;
    }, 150);
    if (suggestionMarkersTimer) {
      clearTimeout(suggestionMarkersTimer);
    }
    suggestionMarkersTimer = setTimeout(() => {
      isSuggestionMarkersVisible.value = true;
      suggestionMarkersTimer = null;
    }, 150);
    if (suggestionGlowTimer) {
      clearTimeout(suggestionGlowTimer);
    }
    isSuggestionGlowActive.value = true;
    suggestionGlowTimer = setTimeout(() => {
      isSuggestionGlowActive.value = false;
      suggestionGlowTimer = null;
    }, 200);
    return;
  }

  if (!newValue && oldValue) {
    isSuggestionLightFlash.value = false;
    isSuggestionGlowActive.value = false;
    isSuggestionMarkersVisible.value = false;
    isSuggestionsFadingOut.value = true;
    if (suggestionMarkersTimer) {
      clearTimeout(suggestionMarkersTimer);
      suggestionMarkersTimer = null;
    }
    if (suggestionGlowTimer) {
      clearTimeout(suggestionGlowTimer);
      suggestionGlowTimer = null;
    }
    if (suggestionFadeTimer) {
      clearTimeout(suggestionFadeTimer);
    }
    suggestionFadeTimer = setTimeout(() => {
      showSuggestionsDisplay.value = false;
      isSuggestionsFadingOut.value = false;
      suggestionFadeTimer = null;
    }, 100);
  }
});

watch(minervaToggleLocation, (value) => {
  if (value === 'outside' && !minervaOutsideMenuEnabled.value && !minervaOutsideRailEnabled.value) {
    minervaOutsideMenuEnabled.value = true;
  }
});

watch(selectedPrototype, (value) => {
  if (isMinervaSkin.value && value === 'option-4') {
    minervaToggleLocation.value = 'outside';
  }
});

watch(activePrototype, (value) => {
  isMinervaOverviewSheetOpen.value = false;
  if (!['option-5', 'option-6'].includes(value)) {
    hasOpenedDesktopPagination.value = false;
  }
  if (value === 'option-3' || value === 'option-4' || value === 'option-5' || value === 'option-6') {
    minervaOutsideRailEnabled.value = true;
    return;
  }
  minervaOutsideRailEnabled.value = false;
});

watch(
  [minervaOutsideMenuEnabled, minervaOutsideRailEnabled],
  ([menuEnabled, railEnabled]) => {
    if (minervaToggleLocation.value === 'outside' && !menuEnabled && !railEnabled) {
      minervaOutsideMenuEnabled.value = true;
    }
  }
);

watch([activePrototype, minervaToggleLocation], () => {
  syncMinervaArrowOnlyVisibility();
});

watch(
  [
    selectedPrototype,
    minervaToggleLocation,
    paginationManualNavigableButtonEnabled,
    filteringEnabled,
    newSuggestionColorEnabled,
    nonSelectedHighlightUnderlineEnabled,
    editToolbarImprovementsEnabled,
    successHighlightOnCompleteEnabled,
    noMoreSuggestionsEmptyStateEnabled,
    editFullPageImprovedEnabled,
    minervaFullPageSuggestionNavigationEnabled,
    minervaFullPageSuggestionNavigationMode
  ],
  () => {
    savePrototypeDialogPrefs();
  }
);

watch(
  [
    isEditMode,
    isMinervaSkin,
    editToolbarImprovementsEnabled,
    showMinervaRedoButton,
    minervaToolbarToggleEnabled
  ],
  () => {
    updateMinervaViewportWidth();
  },
  { flush: 'post' }
);

watch(
  () => [showSuggestions.value, showEmptyState.value, isMinervaSkin.value],
  ([suggestionsActive, emptyActive, isMinerva]) => {
    if (!suggestionsActive) {
      isMinervaOverviewSheetOpen.value = false;
      hasOpenedDesktopPagination.value = false;
    }
    if (isMinerva && suggestionsActive && emptyActive) {
      isMinervaSheetOpen.value = true;
    }
  }
);

watch(isEditCheckMode, (isActive) => {
  if (!isActive) {
    syncEditCheckHighlightState();
  }
});

watch(isMinervaSheetOpen, () => {
  updateMinervaSheetHeight();
  nextTick(() => {
    updateMinervaSheetReturnDirection();
  });
});

watch([isMinervaSheetOpen, minervaSheetMode], () => {
  if (!isMinervaSkin.value) return;
  if (isMinervaFullPageSectionsButtonMode.value && hasMinervaExpandedSheet.value) {
    hideMinervaFullPageTocUi();
  }
  syncEditCheckHighlightState();
  nextTick(() => {
    updateMinervaSheetReturnDirection();
  });
});

watch([activeMinervaSuggestion, activeEditCheckType], () => {
  nextTick(() => {
    updateMinervaSheetReturnDirection();
  });
});

watch(
  () => [showSuggestions.value, showSuggestionNotification.value],
  () => {
    nextTick(() => {
      updateSuggestionVisibility();
    });
  }
);

watch(
  () => [showMinervaFullPageSuggestionNavigation.value, isLoading.value],
  ([visible, loading]) => {
    if (!visible || loading) {
      isMinervaFullPageTocReady.value = false;
      hideMinervaFullPageTocUi();
      clearMinervaFullPageManualScrollIntent();
      activeMinervaFullPageTocSectionId.value = 'top';
      return;
    }
    updateMinervaFullPageSectionsButtonPosition();
    scheduleMinervaFullPageTocReady();
  }
);

watch(isMinervaFullPageTocOpen, (isOpen) => {
  if (isOpen) {
    if (minervaFullPageTocHideTimer) {
      clearTimeout(minervaFullPageTocHideTimer);
      minervaFullPageTocHideTimer = null;
    }
    if (isMinervaFullPageSectionsButtonMode.value || !showSuggestions.value) {
      showMinervaFullPageTocOnScroll.value = true;
    }
    if (isMinervaFullPageSectionsButtonMode.value) {
      scheduleMinervaFullPageSectionsPanelInactivityClose();
    }
    return;
  }
  clearMinervaFullPageSectionsPanelInactivityTimer();
  if (isMinervaFullPageSectionsButtonMode.value) {
    cleanupMinervaFullPageSectionsButtonDragState();
    clearMinervaFullPageManualScrollIntent();
    if (minervaFullPageTocHideTimer) {
      clearTimeout(minervaFullPageTocHideTimer);
      minervaFullPageTocHideTimer = null;
    }
    showMinervaFullPageTocOnScroll.value = false;
    return;
  }
  if (!showSuggestions.value && showMinervaFullPageTocOnScroll.value) {
    scheduleMinervaFullPageTocHideDelay();
  }
});

watch(
  () => [
    citationNumber1.value,
    citationNumber2.value,
    citationNumber3.value,
    isSuggestionDeclined1.value,
    isSuggestionDeclined2.value,
    isSuggestionDeclined3.value
  ],
  () => {
    nextTick(() => {
      updateSuggestionVisibility();
    });
  }
);

watch(availableSuggestionCount, (newValue, oldValue) => {
  if (oldValue !== undefined && newValue !== oldValue) {
    if (!isArrowOnceMode.value &&
      !(isMinervaSkin.value && (activePrototype.value === 'option-1' || isArrowOnceMode.value))) {
      isBannerDismissed.value = false;
    }
  }
  if (
    oldValue > 0 &&
    newValue === 0 &&
    maybeShowMinervaNoMoreSuggestionsState()
  ) {
    // The bottom sheet handles the no-more-suggestions state in Minerva.
  } else if (oldValue > 0 && newValue === 0 && maybeShowVectorNoMoreSuggestionsDialog()) {
    // Vector uses a dialog for the no-more-suggestions article state.
  } else if (oldValue > 0 && newValue === 0 && shouldShowNoMoreSuggestionsLeftToast()) {
    showPaginationNoMoreSuggestionsToast();
  } else if (shouldShowToasts.value && oldValue > 0 && newValue === 0 && !noMoreSuggestionsEmptyStateEnabled.value) {
    if (minervaZeroSuggestionsToastTimer) {
      clearTimeout(minervaZeroSuggestionsToastTimer);
    }
    minervaZeroSuggestionsToastTimer = setTimeout(() => {
      if (!shouldShowToasts.value) return;
      showMinervaZeroSuggestionsToast.value = true;
      minervaZeroSuggestionsToastTimer = setTimeout(() => {
        showMinervaZeroSuggestionsToast.value = false;
        minervaZeroSuggestionsToastTimer = null;
      }, 2000);
    }, 500);
  }
  if (isMinervaSkin.value && (activePrototype.value === 'option-1' || isArrowOnceMode.value)) {
    if (newValue === 0) {
      if (zeroSuggestionsBannerTimer) {
        clearTimeout(zeroSuggestionsBannerTimer);
        zeroSuggestionsBannerTimer = null;
      }
      isBannerDismissed.value = false;
      isBannerDelayReady.value = true;
    } else if (zeroSuggestionsBannerTimer) {
      clearTimeout(zeroSuggestionsBannerTimer);
      zeroSuggestionsBannerTimer = null;
    }
  }
  syncMinervaArrowOnlyVisibility();
});

watch(sectionSuggestionCount, (newValue, oldValue) => {
  if (
    isMinervaSkin.value &&
    minervaEditSectionOnly.value &&
    isEditMode.value &&
    showSuggestions.value &&
    oldValue > 0 &&
    newValue === 0
  ) {
    if (maybeShowMinervaNoMoreSuggestionsState()) {
      return;
    }
    showPaginationNoMoreSuggestionsToast();
  }
});

watch(anySuggestionVisible, (visible) => {
  if (visible && isArrowOnceMode.value) {
    isBannerDismissed.value = true;
  }
  if (visible) {
    clearScrollReappear();
  }
  if (visible || !showSuggestions.value || !isEditMode.value || !isMinervaSkin.value || activePrototype.value !== 'option-3') {
    showMinervaArrowOnly.value = false;
  }
  syncMinervaArrowOnlyVisibility();
});

watch(toggleBadgeCount, (newValue, oldValue) => {
  if (!isArrowOnceMode.value) return;
  if (newValue === oldValue) return;
  badgePulse.value = true;
  setTimeout(() => {
    badgePulse.value = false;
  }, 300);
});

watch(isLoading, (newValue) => {
  if (!newValue && isEditMode.value) {
    if (bannerDelayTimer) {
      clearTimeout(bannerDelayTimer);
    }
    if (
      isMinervaSkin.value &&
      minervaEditSectionOnly.value === 'poetry' &&
      forceEntryBannerSection.value === 'poetry'
    ) {
      updateSuggestionVisibility();
      updateBannerArrowDirections();
      updatePrimaryBannerDirection();
      isBannerDelayReady.value = true;
      return;
    }
    bannerDelayTimer = setTimeout(() => {
      if (isEditMode.value && !isLoading.value) {
        updateSuggestionVisibility();
        updateBannerArrowDirections();
        updatePrimaryBannerDirection();
        isBannerDelayReady.value = true;
      }
    }, 1000);
  }
  if (!newValue && isEditMode.value && shouldShowToasts.value && showSuggestions.value && availableSuggestionCount.value === 0) {
    if (minervaZeroSuggestionsToastTimer) {
      clearTimeout(minervaZeroSuggestionsToastTimer);
    }
    minervaZeroSuggestionsToastTimer = setTimeout(() => {
      if (!shouldShowToasts.value) return;
      showMinervaZeroSuggestionsToast.value = true;
      minervaZeroSuggestionsToastTimer = setTimeout(() => {
        showMinervaZeroSuggestionsToast.value = false;
        minervaZeroSuggestionsToastTimer = null;
      }, 2000);
    }, 500);
  }
});


// Auto scroll/expand helper
let autoSuggestionTimer = null;

function clearAutoSuggestionTimer() {
  if (autoSuggestionTimer) {
    clearTimeout(autoSuggestionTimer);
    autoSuggestionTimer = null;
  }
}

function isTargetVisibleInViewport(target) {
  if (!target || typeof window === 'undefined') return false;
  const rect = target.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.bottom > 0 && rect.top < viewportHeight;
}

function scrollToSuggestionIfNeeded(targetRef) {
  nextTick(() => {
    const target = targetRef.value;
    if (target && !isTargetVisibleInViewport(target)) {
      startAutoScrollIndicator();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

function scrollTargetClearOfDesktopPagination(target) {
  if (!target || typeof window === 'undefined') return;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const desiredTop = Math.max(96, Math.min(180, viewportHeight * 0.28));
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: Math.max(0, targetTop - desiredTop),
    behavior: 'smooth'
  });
}

function scrollTargetAboveMinervaSheet(target) {
  if (!target || typeof window === 'undefined') return;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const sheetHeight = minervaSheetRef.value?.offsetHeight || minervaSheetHeight.value || 0;
  const usableHeight = Math.max(160, viewportHeight - sheetHeight);
  const desiredTop = Math.max(72, Math.min(usableHeight * 0.36, usableHeight - 96));
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({
    top: Math.max(0, targetTop - desiredTop),
    behavior: 'smooth'
  });
}

function ensureTargetVisibleAboveMinervaSheet(target) {
  if (!target || typeof window === 'undefined' || !isMinervaSheetOpen.value) return;
  const sheet = minervaSheetRef.value;
  if (!sheet) return;

  const rect = target.getBoundingClientRect();
  const sheetRect = sheet.getBoundingClientRect();
  const visibleTop = 56;
  const visibleBottom = sheetRect.top - 16;
  const isFullyVisible = rect.top >= visibleTop && rect.bottom <= visibleBottom;

  if (!isFullyVisible) {
    scrollTargetAboveMinervaSheet(target);
  }
}

function getSuggestionCardRefById(suggestionId) {
  if (suggestionId === 1) return suggestionsSidebarRef;
  if (suggestionId === 2) return suggestionsSidebarRef2;
  if (suggestionId === 3) return suggestionsSidebarRef3;
  if (suggestionId === 4) return suggestionsSidebarRef4;
  if (suggestionId === 6) return suggestionsSidebarRef6;
  if (suggestionId === 7) return suggestionsSidebarRef7;
  if (suggestionId === 8) return suggestionsSidebarRef8;
  return null;
}

function ensureDesktopSuggestionClearsPagination(suggestionId) {
  if (isMinervaSkin.value || !isPaginationMode.value || typeof window === 'undefined') return;
  const cardRef = getSuggestionCardRefById(suggestionId);
  const card = cardRef?.value;
  const pagination = document.querySelector('.vector-pagination-controls');
  if (!card || !pagination) return;
  const cardRect = card.getBoundingClientRect();
  const paginationRect = pagination.getBoundingClientRect();
  const requiredGap = 16;
  const overlap = cardRect.bottom - (paginationRect.top - requiredGap);
  if (overlap > 0) {
    window.scrollBy({
      top: overlap,
      behavior: 'smooth'
    });
  }
}

function startAutoScrollIndicator() {
  isAutoScrollActive.value = true;
  if (autoScrollTimer) {
    clearTimeout(autoScrollTimer);
  }
  autoScrollTimer = setTimeout(() => {
    isAutoScrollActive.value = false;
    autoScrollTimer = null;
  }, 1200);
}

function openSuggestionAtTarget(id, targetRef, expandAfterScroll = false, options = {}) {
  const {
    openMinervaAfterScroll = false,
    keepDesktopPaginationClear = false,
    keepMinervaSheetClear = false
  } = options;
  const openSuggestionAndAlign = (suggestionId) => {
    openSuggestion(suggestionId);
    if (keepDesktopPaginationClear) {
      nextTick(() => {
        setTimeout(() => {
          ensureDesktopSuggestionClearsPagination(suggestionId);
        }, 80);
      });
    }
  };
  const openSuggestion = (suggestionId) => {
    if (isMinervaSkin.value) {
      openMinervaSuggestion(suggestionId);
      return;
    }
    if (suggestionId === 1) {
      isCardExpanded.value = true;
      isCardExpanded2.value = false;
      isCardExpanded3.value = false;
      isCardExpanded4.value = false;
      isCardExpanded5.value = false;
      isCardExpanded6.value = false;
      isCardExpanded7.value = false;
      isCardExpanded8.value = false;
    } else if (suggestionId === 2) {
      isCardExpanded2.value = true;
      isCardExpanded.value = false;
      isCardExpanded3.value = false;
      isCardExpanded4.value = false;
      isCardExpanded5.value = false;
      isCardExpanded6.value = false;
      isCardExpanded7.value = false;
      isCardExpanded8.value = false;
    } else if (suggestionId === 3) {
      isCardExpanded.value = false;
      isCardExpanded2.value = false;
      isCardExpanded3.value = true;
      isCardExpanded4.value = false;
      isCardExpanded5.value = false;
      isCardExpanded6.value = false;
      isCardExpanded7.value = false;
      isCardExpanded8.value = false;
    } else if (suggestionId === 4) {
      isCardExpanded.value = false;
      isCardExpanded2.value = false;
      isCardExpanded3.value = false;
      isCardExpanded4.value = true;
      isCardExpanded5.value = false;
      isCardExpanded6.value = false;
      isCardExpanded7.value = false;
      isCardExpanded8.value = false;
    } else if (suggestionId === 5) {
      isCardExpanded.value = false;
      isCardExpanded2.value = false;
      isCardExpanded3.value = false;
      isCardExpanded4.value = false;
      isCardExpanded5.value = true;
      isCardExpanded6.value = false;
      isCardExpanded7.value = false;
      isCardExpanded8.value = false;
    } else if (suggestionId === 6) {
      isCardExpanded.value = false;
      isCardExpanded2.value = false;
      isCardExpanded3.value = false;
      isCardExpanded4.value = false;
      isCardExpanded5.value = false;
      isCardExpanded6.value = true;
      isCardExpanded7.value = false;
      isCardExpanded8.value = false;
    } else if (suggestionId === 7) {
      isCardExpanded.value = false;
      isCardExpanded2.value = false;
      isCardExpanded3.value = false;
      isCardExpanded4.value = false;
      isCardExpanded5.value = false;
      isCardExpanded6.value = false;
      isCardExpanded7.value = true;
      isCardExpanded8.value = false;
    } else if (suggestionId === 8) {
      isCardExpanded.value = false;
      isCardExpanded2.value = false;
      isCardExpanded3.value = false;
      isCardExpanded4.value = false;
      isCardExpanded5.value = false;
      isCardExpanded6.value = false;
      isCardExpanded7.value = false;
      isCardExpanded8.value = true;
    }
  };

  if (expandAfterScroll) {
    const target = targetRef.value;
    const shouldScroll = target && (
      keepDesktopPaginationClear ||
      keepMinervaSheetClear ||
      !isTargetVisibleInViewport(target)
    );
    if (shouldScroll) {
      if (isMinervaSkin.value) {
        if (openMinervaAfterScroll) {
          closeMinervaSuggestion();
          startAutoScrollIndicator();
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            openSuggestion(id);
          }, 1000);
          return;
        }
        openSuggestion(id);
      }
      startAutoScrollIndicator();
      if (keepMinervaSheetClear && isMinervaSkin.value) {
        scrollTargetAboveMinervaSheet(target);
      } else if (keepDesktopPaginationClear) {
        scrollTargetClearOfDesktopPagination(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (!isMinervaSkin.value) {
        setTimeout(() => {
          openSuggestionAndAlign(id);
        }, 1000);
      }
      return;
    }
  }
  openSuggestionAndAlign(id);
  scrollToSuggestionIfNeeded(targetRef);
}

function getPendingSuggestionTargets() {
  const targets = [];
  if (citationNumber1.value === null && !isSuggestionDeclined1.value && !showSuccessMessage1.value && highlightedTextRef.value) {
    targets.push({ id: 1, ref: highlightedTextRef });
  }
  if (citationNumber2.value === null && !isSuggestionDeclined2.value && !showSuccessMessage2.value && highlightedTextRef2.value) {
    targets.push({ id: 2, ref: highlightedTextRef2 });
  }
  if (!isSuggestionResolved4.value && !isSuggestionDeclined4.value && !showSuccessMessage4.value && highlightedTextRef4.value) {
    targets.push({ id: 4, ref: highlightedTextRef4 });
  }
  if (citationNumber3.value === null && !isSuggestionDeclined3.value && !showSuccessMessage3.value && highlightedTextRef3.value) {
    targets.push({ id: 3, ref: highlightedTextRef3 });
  }
  if (!isSuggestionResolved5.value && !isSuggestionDeclined5.value && highlightedTextRef5.value) {
    targets.push({ id: 5, ref: highlightedTextRef5 });
  }
  if (!isSuggestionResolved6.value && !isSuggestionDeclined6.value && highlightedTextRef6.value) {
    targets.push({ id: 6, ref: highlightedTextRef6 });
  }
  if (!isSuggestionResolved7.value && !isSuggestionDeclined7.value && highlightedTextRef7.value) {
    targets.push({ id: 7, ref: highlightedTextRef7 });
  }
  if (!isSuggestionResolved8.value && !isSuggestionDeclined8.value && highlightedTextRef8.value) {
    targets.push({ id: 8, ref: highlightedTextRef8 });
  }
  return targets;
}

function getCurrentSectionId(currentY) {
  const sections = [
    { id: 'early-life', ref: editSectionEarlyLife },
    { id: 'career', ref: editSectionCareer },
    { id: 'poetry', ref: editSectionPoetry },
    { id: 'prose', ref: editSectionProse },
    { id: 'film', ref: editSectionFilm },
    { id: 'theory', ref: editSectionTheory }
  ].filter((section) => section.ref.value);

  if (!sections.length) {
    return null;
  }

  const positions = sections.map((section) => ({
    id: section.id,
    top: section.ref.value.getBoundingClientRect().top + window.scrollY
  }));

  positions.sort((a, b) => a.top - b.top);

  let currentSection = positions[0].id;
  for (let i = 0; i < positions.length; i++) {
    if (currentY >= positions[i].top) {
      currentSection = positions[i].id;
    } else {
      break;
    }
  }
  return currentSection;
}

function scrollToNearestSuggestionFromBanner() {
  if (!isEditMode.value || !showSuggestions.value) return;

  const pendingTargets = getPendingSuggestionTargets();
  if (!pendingTargets.length) return;

  const currentY = window.scrollY + window.innerHeight / 2;
  const sectionToSuggestion = {
    career: 1,
    poetry: 2,
    prose: 3
  };
  const currentSectionId = getCurrentSectionId(currentY);
  const sectionSuggestionId = sectionToSuggestion[currentSectionId];
  if (sectionSuggestionId) {
    const sameSectionTarget = pendingTargets.find((target) => target.id === sectionSuggestionId);
    if (sameSectionTarget) {
      openSuggestionAtTarget(sameSectionTarget.id, sameSectionTarget.ref, true);
      return;
    }
  }

  const positionedTargets = pendingTargets
    .map((target) => ({
      ...target,
      top: target.ref.value.getBoundingClientRect().top + window.scrollY
    }))
    .sort((a, b) => a.top - b.top);

  const below = positionedTargets.filter((target) => target.top >= currentY);
  if (below.length) {
    openSuggestionAtTarget(below[0].id, below[0].ref, true);
    return;
  }

  const lastAbove = positionedTargets[positionedTargets.length - 1];
  openSuggestionAtTarget(lastAbove.id, lastAbove.ref, true);
}

function scrollToSuggestionByDirection(direction, suggestionIdToSkip = null, options = {}) {
  if (!isEditMode.value || !showSuggestions.value) return;
  const pendingTargets = getPendingSuggestionTargets();
  if (!pendingTargets.length) return;
  const currentY = window.scrollY + window.innerHeight / 2;
  const pendingOrder = getPendingSuggestionIdsForContext();
  const orderIndexById = new Map(pendingOrder.map((id, index) => [id, index]));
  const activeSuggestionIdToSkip = suggestionIdToSkip ?? (
    isMinervaSkin.value && isMinervaSheetOpen.value
      ? activeMinervaSuggestion.value
      : null
  );
  const orderedTargets = pendingTargets
    .map((target) => ({
      ...target,
      top: target.ref.value.getBoundingClientRect().top + window.scrollY,
      orderIndex: orderIndexById.get(target.id) ?? Number.MAX_SAFE_INTEGER
    }))
    .sort((a, b) => {
      if (a.top === b.top) {
        return a.orderIndex - b.orderIndex;
      }
      return a.top - b.top;
    });
  if (activeSuggestionIdToSkip !== null) {
    const activeIndex = orderedTargets.findIndex((target) => target.id === activeSuggestionIdToSkip);
    if (activeIndex !== -1) {
      const nextTarget = direction === 'down'
        ? orderedTargets[activeIndex + 1]
        : orderedTargets[activeIndex - 1];
      if (nextTarget) {
        openSuggestionAtTarget(nextTarget.id, nextTarget.ref, true, options);
        return;
      }
    }
  }
  const positionedTargets = orderedTargets
    .filter((target) => target.id !== activeSuggestionIdToSkip);
  if (!positionedTargets.length) return;
  if (direction === 'down') {
    const below = positionedTargets.filter((target) => target.top > currentY);
    if (below.length) {
      openSuggestionAtTarget(below[0].id, below[0].ref, true, options);
      return;
    }
    return;
  }
  if (direction === 'up') {
    const above = positionedTargets.filter((target) => target.top < currentY);
    if (above.length) {
      openSuggestionAtTarget(above[above.length - 1].id, above[above.length - 1].ref, true, options);
    }
  }
}

function openFirstPendingSuggestion(expandAfterScroll = false, options = {}) {
  if (!isEditMode.value || !showSuggestions.value) return;

  const suggestion1Pending = citationNumber1.value === null && !isSuggestionDeclined1.value && !showSuccessMessage1.value;
  const suggestion2Pending = citationNumber2.value === null && !isSuggestionDeclined2.value && !showSuccessMessage2.value;
  const suggestion3Pending = citationNumber3.value === null && !isSuggestionDeclined3.value && !showSuccessMessage3.value;
  const suggestion4Pending = !isSuggestionResolved4.value && !isSuggestionDeclined4.value && !showSuccessMessage4.value;
  const suggestion5Pending = !isSuggestionResolved5.value && !isSuggestionDeclined5.value;
  const suggestion6Pending = !isSuggestionResolved6.value && !isSuggestionDeclined6.value;
  const suggestion7Pending = !isSuggestionResolved7.value && !isSuggestionDeclined7.value;
  const suggestion8Pending = !isSuggestionResolved8.value && !isSuggestionDeclined8.value;

  if (suggestion1Pending) {
    openSuggestionAtTarget(1, highlightedTextRef, expandAfterScroll, options);
  } else if (suggestion8Pending) {
    openSuggestionAtTarget(8, highlightedTextRef8, expandAfterScroll, options);
  } else if (suggestion6Pending) {
    openSuggestionAtTarget(6, highlightedTextRef6, expandAfterScroll, options);
  } else if (suggestion2Pending) {
    openSuggestionAtTarget(2, highlightedTextRef2, expandAfterScroll, options);
  } else if (suggestion4Pending) {
    openSuggestionAtTarget(4, highlightedTextRef4, expandAfterScroll, options);
  } else if (suggestion7Pending) {
    openSuggestionAtTarget(7, highlightedTextRef7, expandAfterScroll, options);
  } else if (suggestion3Pending) {
    openSuggestionAtTarget(3, highlightedTextRef3, expandAfterScroll, options);
  } else if (suggestion5Pending) {
    openSuggestionAtTarget(5, highlightedTextRef5, expandAfterScroll, options);
  }
}

// Auto expand and scroll when edit mode + suggestions activate
watch(
  () => [isEditMode.value, showSuggestions.value],
  ([editActive, suggestionsActive]) => {
    clearAutoSuggestionTimer();
    if (editActive && suggestionsActive && enableAutoScroll.value) {
      autoSuggestionTimer = setTimeout(() => {
        openFirstPendingSuggestion();
      }, 1200);
    }
  }
);

watch(
  () => [showSuggestions.value, showSuggestionToggle.value, showSuggestionNotification.value],
  ([suggestionsActive, hasToggle, hasBanner], [prevSuggestionsActive]) => {
    if (!hasToggle || !hasBanner) return;
    if (!prevSuggestionsActive && suggestionsActive && availableSuggestionCount.value > 0) {
      if (bannerOpenTimer) {
        clearTimeout(bannerOpenTimer);
      }
      isBannerOpening.value = true;
      bannerOpenTimer = setTimeout(() => {
        isBannerOpening.value = false;
        bannerOpenTimer = null;
      }, 220);
    }
  }
);

watch(
  () => isLoading.value,
  (loading) => {
    if (!loading && pendingScrollSection.value) {
      const target = pendingScrollSection.value;
      pendingScrollSection.value = null;
      nextTick(() => {
        scrollToEditSection(target);
      });
    }
  }
);

// Align on mount and add event listeners
onMounted(() => {
  loadPrototypeDialogPrefs();
  if (typeof window !== 'undefined') {
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    selectedSkin.value = isMobile ? 'minerva' : 'vector22';
  }

  if (isEditMode.value && showSuggestions.value) {
    setTimeout(() => {
      alignBothSuggestions();
      updateSuggestionVisibility();
    }, 100);
  }
  
  if (typeof window !== 'undefined') {
    // Add event listeners to keep alignment updated for both suggestions
    updateMinervaViewportWidth();
    updateMinervaFullPageSectionsButtonPosition();
    window.addEventListener('resize', alignBothSuggestions);
    window.addEventListener('scroll', alignBothSuggestions, true); // true for capture phase
    window.addEventListener('resize', updateMinervaSheetHeight);
    window.addEventListener('resize', updateMinervaViewportWidth);
    window.addEventListener('scroll', updateSuggestionVisibility, true);
    window.addEventListener('resize', updateSuggestionVisibility);
    window.addEventListener('scroll', updateEditToolbarScrolled, true);
    window.addEventListener('scroll', handleScrollReappear, true);
    window.addEventListener('wheel', markMinervaFullPageManualScrollIntent, { passive: true });
    window.addEventListener('touchmove', markMinervaFullPageManualScrollIntent, { passive: true });
    window.addEventListener('scroll', handleMinervaFullPageTocScrollVisibility, true);
    window.addEventListener('scroll', updateMinervaFullPageTocActiveSection, true);
    window.addEventListener('resize', updateMinervaFullPageTocActiveSection);
    window.addEventListener('resize', updateMinervaFullPageSectionsButtonPosition);
    window.addEventListener('scroll', handleReadModeScroll, { passive: true });
    updateEditToolbarScrolled();
    updateMinervaFullPageTocActiveSection();
    if (showMinervaFullPageSuggestionNavigation.value && !isLoading.value) {
      scheduleMinervaFullPageTocReady();
    }
  }
  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('selectionchange', handleSelectionChange);
  updateToneCheckFromContent();
});

// Clean up event listeners
onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', alignBothSuggestions);
    window.removeEventListener('scroll', alignBothSuggestions, true);
    window.removeEventListener('resize', updateMinervaSheetHeight);
    window.removeEventListener('resize', updateMinervaViewportWidth);
    window.removeEventListener('scroll', updateSuggestionVisibility, true);
    window.removeEventListener('resize', updateSuggestionVisibility);
    window.removeEventListener('scroll', updateEditToolbarScrolled, true);
    window.removeEventListener('scroll', handleScrollReappear, true);
    window.removeEventListener('wheel', markMinervaFullPageManualScrollIntent);
    window.removeEventListener('touchmove', markMinervaFullPageManualScrollIntent);
    window.removeEventListener('scroll', handleMinervaFullPageTocScrollVisibility, true);
    window.removeEventListener('scroll', updateMinervaFullPageTocActiveSection, true);
    window.removeEventListener('resize', updateMinervaFullPageTocActiveSection);
    window.removeEventListener('resize', updateMinervaFullPageSectionsButtonPosition);
    window.removeEventListener('scroll', handleReadModeScroll);
  }
  document.removeEventListener('click', handleDocumentClick);
  document.removeEventListener('selectionchange', handleSelectionChange);
  clearAutoSuggestionTimer();
  if (bannerCloseTimer) {
    clearTimeout(bannerCloseTimer);
    bannerCloseTimer = null;
  }
  if (bannerOpenTimer) {
    clearTimeout(bannerOpenTimer);
    bannerOpenTimer = null;
  }
  if (suggestionLightTimer) {
    clearTimeout(suggestionLightTimer);
    suggestionLightTimer = null;
  }
  if (suggestionGlowTimer) {
    clearTimeout(suggestionGlowTimer);
    suggestionGlowTimer = null;
  }
  if (suggestionMarkersTimer) {
    clearTimeout(suggestionMarkersTimer);
    suggestionMarkersTimer = null;
  }
  if (suggestionFadeTimer) {
    clearTimeout(suggestionFadeTimer);
    suggestionFadeTimer = null;
  }
  if (zeroSuggestionsBannerTimer) {
    clearTimeout(zeroSuggestionsBannerTimer);
    zeroSuggestionsBannerTimer = null;
  }
  if (minervaToggleOffToastTimer) {
    clearTimeout(minervaToggleOffToastTimer);
    minervaToggleOffToastTimer = null;
  }
  if (minervaToggleOnToastTimer) {
    clearTimeout(minervaToggleOnToastTimer);
    minervaToggleOnToastTimer = null;
  }
  if (minervaMoreSuggestionsToastTimer) {
    clearTimeout(minervaMoreSuggestionsToastTimer);
    minervaMoreSuggestionsToastTimer = null;
  }
  if (minervaZeroSuggestionsToastTimer) {
    clearTimeout(minervaZeroSuggestionsToastTimer);
    minervaZeroSuggestionsToastTimer = null;
  }
  if (paginationNoSuggestionsToastTimer) {
    clearTimeout(paginationNoSuggestionsToastTimer);
    paginationNoSuggestionsToastTimer = null;
  }
  if (suggestionSuccessToastTimer) {
    clearTimeout(suggestionSuccessToastTimer);
    suggestionSuccessToastTimer = null;
  }
  if (minervaSuggestionSuccessTimer) {
    clearTimeout(minervaSuggestionSuccessTimer);
    minervaSuggestionSuccessTimer = null;
  }
  if (minervaSuggestionSuccessExitTimer) {
    clearTimeout(minervaSuggestionSuccessExitTimer);
    minervaSuggestionSuccessExitTimer = null;
  }
  if (minervaNoMoreSuggestionsOpenTimer) {
    clearTimeout(minervaNoMoreSuggestionsOpenTimer);
    minervaNoMoreSuggestionsOpenTimer = null;
  }
  if (suppressMinervaSheetReturnDirectionTimer) {
    clearTimeout(suppressMinervaSheetReturnDirectionTimer);
    suppressMinervaSheetReturnDirectionTimer = null;
  }
  if (scrollReappearTimer) {
    clearTimeout(scrollReappearTimer);
    scrollReappearTimer = null;
  }
  if (minervaFullPageTocShowTimer) {
    clearTimeout(minervaFullPageTocShowTimer);
    minervaFullPageTocShowTimer = null;
  }
  if (minervaFullPageTocHideTimer) {
    clearTimeout(minervaFullPageTocHideTimer);
    minervaFullPageTocHideTimer = null;
  }
  if (minervaFullPageTocScrollingTimer) {
    clearTimeout(minervaFullPageTocScrollingTimer);
    minervaFullPageTocScrollingTimer = null;
  }
  if (suppressMinervaFullPageTocScrollVisibilityTimer) {
    clearTimeout(suppressMinervaFullPageTocScrollVisibilityTimer);
    suppressMinervaFullPageTocScrollVisibilityTimer = null;
  }
  if (minervaFullPageSectionsPanelInactivityTimer) {
    clearTimeout(minervaFullPageSectionsPanelInactivityTimer);
    minervaFullPageSectionsPanelInactivityTimer = null;
  }
  window.removeEventListener('pointermove', handleMinervaFullPageSectionsButtonPointerMove);
  window.removeEventListener('pointerup', handleMinervaFullPageSectionsButtonPointerUp);
  window.removeEventListener('pointercancel', handleMinervaFullPageSectionsButtonPointerUp);
  if (autoScrollTimer) {
    clearTimeout(autoScrollTimer);
    autoScrollTimer = null;
  }
});

// Handle search input
function onSearchInput(value) {
  console.log('Search input:', value);
  
  // Track current search term
  currentSearchTerm.value = value;
  
  // Reset if empty
  if (!value || value === '') {
    searchResults.value = [];
    searchFooterUrl.value = '';
    return;
  }
  
  // Format API response for TypeaheadSearch
  function adaptApiResponse(pages) {
    return pages.map(({ id, key, title, description, thumbnail }) => ({
      label: title,
      value: id,
      description: description,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(key)}`,
      thumbnail: thumbnail ? {
        url: thumbnail.url,
        width: thumbnail.width,
        height: thumbnail.height
      } : undefined
    }));
  }
  
  // Fetch search results from Wikipedia API
  fetch(
    `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(value)}&limit=10`
  )
    .then((resp) => resp.json())
    .then((data) => {
      // Verify data is still relevant
      if (currentSearchTerm.value === value) {
        searchResults.value = data.pages && data.pages.length > 0 
          ? adaptApiResponse(data.pages) 
          : [];
        
        searchFooterUrl.value = `https://en.wikipedia.org/w/index.php?title=Special%3ASearch&fulltext=1&search=${encodeURIComponent(value)}`;
      }
    })
    .catch(() => {
      searchResults.value = [];
      searchFooterUrl.value = '';
    });
}

function onLinkSearchInput(value) {
  linkSearchTerm.value = value;
  linkDialogQuery.value = value;
  if (!value || value === '') {
    linkSearchResults.value = [];
    linkSearchFooterUrl.value = '';
    return;
  }
  function adaptApiResponse(pages) {
    return pages.map(({ id, key, title, description, thumbnail }) => ({
      label: title,
      value: id,
      description: description,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(key)}`,
      thumbnail: thumbnail ? {
        url: thumbnail.url,
        width: thumbnail.width,
        height: thumbnail.height
      } : undefined
    }));
  }
  fetch(
    `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(value)}&limit=10`
  )
    .then((resp) => resp.json())
    .then((data) => {
      if (linkSearchTerm.value === value) {
        linkSearchResults.value = data.pages && data.pages.length > 0
          ? adaptApiResponse(data.pages)
          : [];
        linkSearchFooterUrl.value = `https://en.wikipedia.org/w/index.php?title=Special%3ASearch&fulltext=1&search=${encodeURIComponent(value)}`;
      }
    })
    .catch(() => {
      linkSearchResults.value = [];
      linkSearchFooterUrl.value = '';
    });
}

// Handle search result click
function onSearchResultClick(value) {
  console.log('Search result clicked:', value);
}

// Handle search submit
function onSearchSubmit(value) {
  console.log('Search submitted:', value);
}

// Toggle edit mode with loading state
function enterEditMode() {
  // Activating edit mode: switch to edit mode immediately and show loading overlay
  isEditMode.value = true;
  isSkinMenuOpen.value = false;
  isHeaderFixed.value = false;
  isLoading.value = true;
  hasUnsavedChanges.value = false;
  nextTick(() => {
    captureEditSnapshot();
  });
  isBannerDelayReady.value = false;
  isBannerClosing.value = false;
  isBannerOpening.value = false;
  
  // Hide loading overlay after 2 seconds
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
}

function exitEditMode() {
  // Returning to read mode: no loading
  const targetSectionId = readModeReturnSectionId.value;
  restoreEditSnapshot();
  hasUnsavedChanges.value = false;
  clearEditModeUiState();
  readModeReturnSectionId.value = null;
  restoreReadModeSection(targetSectionId);
}

function toggleEditMode() {
  if (!isEditMode.value) {
    minervaEditSectionOnly.value = null;
    readModeReturnSectionId.value = null;
    startPrototype();
    return;
  }
  exitEditMode();
}

function toggleSkinMenu() {
  if (isEditMode.value) {
    return;
  }
  isSkinMenuOpen.value = !isSkinMenuOpen.value;
}

function toggleMinervaSection(sectionId) {
  minervaOpenSections.value[sectionId] = !minervaOpenSections.value[sectionId];
}

function isMinervaSectionOpen(sectionId) {
  return Boolean(minervaOpenSections.value[sectionId]);
}

function openMinervaSuggestion(suggestionId, options = {}) {
  const { keepSuccessExit = false } = options;
  if (isMinervaSheetOpen.value && activeMinervaSuggestion.value === suggestionId) {
    closeMinervaSuggestion();
    return;
  }
  clearMinervaNoMoreSuggestionsState();
  clearMinervaSuggestionSuccessState({ keepExit: keepSuccessExit });
  clearMinervaSheetClosingState();
  minervaSheetMode.value = 'suggestion';
  activeMinervaSuggestion.value = suggestionId;
  isMinervaSheetOpen.value = true;
  minervaLastScrollY.value = window.scrollY;
  if (suggestionId === 1) {
    isCardExpanded.value = true;
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
    isCardExpanded4.value = false;
    isCardExpanded5.value = false;
    isCardExpanded6.value = false;
    isCardExpanded7.value = false;
    isCardExpanded8.value = false;
  } else if (suggestionId === 2) {
    isCardExpanded2.value = true;
    isCardExpanded.value = false;
    isCardExpanded3.value = false;
    isCardExpanded4.value = false;
    isCardExpanded5.value = false;
    isCardExpanded6.value = false;
    isCardExpanded7.value = false;
    isCardExpanded8.value = false;
  } else if (suggestionId === 3) {
    isCardExpanded3.value = true;
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
    isCardExpanded4.value = false;
    isCardExpanded5.value = false;
    isCardExpanded6.value = false;
    isCardExpanded7.value = false;
    isCardExpanded8.value = false;
  } else if (suggestionId === 4) {
    isCardExpanded4.value = true;
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
    isCardExpanded5.value = false;
    isCardExpanded6.value = false;
    isCardExpanded7.value = false;
    isCardExpanded8.value = false;
  } else if (suggestionId === 5) {
    isCardExpanded5.value = true;
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
    isCardExpanded4.value = false;
    isCardExpanded6.value = false;
    isCardExpanded7.value = false;
    isCardExpanded8.value = false;
  } else if (suggestionId === 6) {
    isCardExpanded6.value = true;
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
    isCardExpanded4.value = false;
    isCardExpanded5.value = false;
    isCardExpanded7.value = false;
    isCardExpanded8.value = false;
  } else if (suggestionId === 7) {
    isCardExpanded7.value = true;
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
    isCardExpanded4.value = false;
    isCardExpanded5.value = false;
    isCardExpanded6.value = false;
    isCardExpanded8.value = false;
  } else if (suggestionId === 8) {
    isCardExpanded8.value = true;
    isCardExpanded.value = false;
    isCardExpanded2.value = false;
    isCardExpanded3.value = false;
    isCardExpanded4.value = false;
    isCardExpanded5.value = false;
    isCardExpanded6.value = false;
    isCardExpanded7.value = false;
  }
  updateMinervaSheetHeight();
  nextTick(() => {
    window.requestAnimationFrame(() => {
      const target = getSuggestionRefById(suggestionId)?.value;
      ensureTargetVisibleAboveMinervaSheet(target);
      if (keepSuccessExit) {
        window.requestAnimationFrame(() => {
          isMinervaSuggestionSuccessExiting.value = false;
        });
      }
      nextTick(() => {
        updateMinervaSheetReturnDirection();
      });
    });
  });
}

function openMinervaSuggestionSheet(suggestionId) {
  clearMinervaSuggestionSuccessState();
  clearMinervaSheetClosingState();
  minervaSheetMode.value = 'suggestion';
  activeMinervaSuggestion.value = suggestionId;
  isMinervaSheetOpen.value = true;
  minervaLastScrollY.value = window.scrollY;
  updateMinervaSheetHeight();
}

function getCurrentMinervaSheetTarget() {
  if (!isMinervaSkin.value || !isMinervaSheetOpen.value) {
    return null;
  }
  if (minervaSheetMode.value === 'edit-check') {
    if (activeEditCheckType.value === 'tone') {
      return toneCheckHighlightRef.value;
    }
    if (activeEditCheckType.value === 'paste') {
      return pasteCheckHighlightRef.value;
    }
    return null;
  }
  return getSuggestionRefById(activeMinervaSuggestion.value)?.value || null;
}

function updateMinervaSheetReturnDirection() {
  if (!isMinervaSkin.value || !isMinervaSheetOpen.value) {
    minervaSheetReturnDirection.value = null;
    return;
  }
  if (suppressMinervaSheetReturnDirection.value) {
    minervaSheetReturnDirection.value = null;
    return;
  }
  const target = getCurrentMinervaSheetTarget();
  const sheet = minervaSheetRef.value;
  if (!target || !sheet) {
    minervaSheetReturnDirection.value = null;
    return;
  }
  const rect = target.getBoundingClientRect();
  const sheetRect = sheet.getBoundingClientRect();
  const availableTop = 0;
  const availableBottom = sheetRect.top;
  const isVisibleAboveSheet = rect.bottom > availableTop && rect.top < availableBottom;
  if (isVisibleAboveSheet) {
    minervaSheetReturnDirection.value = null;
    return;
  }
  if (rect.bottom <= availableTop) {
    minervaSheetReturnDirection.value = 'up';
    return;
  }
  if (rect.top >= availableBottom) {
    minervaSheetReturnDirection.value = 'down';
    return;
  }
  minervaSheetReturnDirection.value = null;
}

function scrollToMinervaSheetTarget() {
  const target = getCurrentMinervaSheetTarget();
  if (!target) return;
  startAutoScrollIndicator();
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  nextTick(() => {
    updateMinervaSheetReturnDirection();
  });
}

function handleFilterSuggestionsClick() {
  // Placeholder for future filtering interactions.
}

function closeMinervaSuggestion() {
  clearMinervaNoMoreSuggestionsState();
  clearMinervaSuggestionSuccessState();
  clearMinervaSheetClosingState();
  isMinervaSheetOpen.value = false;
  minervaSheetReturnDirection.value = null;
  isCardExpanded.value = false;
  isCardExpanded2.value = false;
  isCardExpanded3.value = false;
  isCardExpanded4.value = false;
  isCardExpanded5.value = false;
  isCardExpanded6.value = false;
  isCardExpanded7.value = false;
  isCardExpanded8.value = false;
  minervaSheetHeight.value = 0;
}

function updateMinervaSheetHeight() {
  if (!isMinervaSheetOpen.value) {
    minervaSheetHeight.value = 0;
    return;
  }
  nextTick(() => {
    const sheet = minervaSheetRef.value;
    if (sheet) {
      minervaSheetHeight.value = sheet.offsetHeight;
    }
  });
}

function updateMinervaViewportWidth() {
  if (typeof window === 'undefined') return;
  minervaViewportWidth.value = window.innerWidth || document.documentElement.clientWidth || 375;
  nextTick(() => {
    const toolbarScrollArea = minervaToolbarScrollAreaRef.value;
    minervaToolbarAvailableWidth.value = toolbarScrollArea?.clientWidth || 0;
  });
}

function cloneEditSnapshot(snapshot) {
  return snapshot.map(({ node, html }) => ({ node, html }));
}

function getCurrentEditSnapshot() {
  if (!pageRoot.value) return [];
  const nodes = pageRoot.value.querySelectorAll('.article-text-editable');
  return Array.from(nodes).map((node) => ({
    node,
    html: node.innerHTML
  }));
}

function areSnapshotsEqual(leftSnapshot, rightSnapshot) {
  if (leftSnapshot.length !== rightSnapshot.length) return false;
  return leftSnapshot.every((entry, index) => (
    entry.node === rightSnapshot[index]?.node &&
    entry.html === rightSnapshot[index]?.html
  ));
}

function applyEditSnapshot(snapshot) {
  snapshot.forEach(({ node, html }) => {
    if (node) {
      node.innerHTML = html;
    }
  });
  nextTick(() => {
    updateToneCheckFromContent();
  });
}

function syncMinervaRedoButtonVisibility() {
  showMinervaRedoButton.value = editRedoStack.value.length > 0;
}

function captureEditSnapshot() {
  editSnapshot.value = getCurrentEditSnapshot();
  editUndoStack.value = [cloneEditSnapshot(editSnapshot.value)];
  editRedoStack.value = [];
  syncMinervaRedoButtonVisibility();
  return editSnapshot.value;
}

function restoreEditSnapshot() {
  if (!editSnapshot.value.length) {
    return;
  }
  applyEditSnapshot(editSnapshot.value);
  editUndoStack.value = [cloneEditSnapshot(editSnapshot.value)];
  editRedoStack.value = [];
  syncMinervaRedoButtonVisibility();
}

function undoEdits() {
  if (editUndoStack.value.length <= 1) {
    return;
  }
  const currentSnapshot = editUndoStack.value.pop();
  if (currentSnapshot) {
    editRedoStack.value.push(cloneEditSnapshot(currentSnapshot));
  }
  const previousSnapshot = editUndoStack.value[editUndoStack.value.length - 1];
  if (previousSnapshot) {
    applyEditSnapshot(previousSnapshot);
  }
  hasUnsavedChanges.value = editUndoStack.value.length > 1;
  syncMinervaRedoButtonVisibility();
}

function handleMinervaRedo() {
  if (!editRedoStack.value.length) {
    syncMinervaRedoButtonVisibility();
    return;
  }
  const nextSnapshot = editRedoStack.value.pop();
  if (!nextSnapshot) {
    syncMinervaRedoButtonVisibility();
    return;
  }
  editUndoStack.value.push(cloneEditSnapshot(nextSnapshot));
  applyEditSnapshot(nextSnapshot);
  hasUnsavedChanges.value = editUndoStack.value.length > 1;
  syncMinervaRedoButtonVisibility();
}

// Mark article as edited
function markArticleEdited() {
  const currentSnapshot = getCurrentEditSnapshot();
  const lastUndoSnapshot = editUndoStack.value[editUndoStack.value.length - 1] || [];
  if (!areSnapshotsEqual(currentSnapshot, lastUndoSnapshot)) {
    editUndoStack.value.push(cloneEditSnapshot(currentSnapshot));
    editRedoStack.value = [];
  }
  hasUnsavedChanges.value = editUndoStack.value.length > 1;
  syncMinervaRedoButtonVisibility();
  updateToneCheckFromContent();
}
</script>

<style scoped>
/* Root container */
.read-mode {
  background-color: white;
  width: 100%;
  min-height: 100vh;
  position: relative;
}

.page-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 12px 0;
  width: 100%;
  max-width: 1596px;
  margin: 0 auto;
}

.minerva-skin .page-container {
  max-width: 994px;
  padding-top: 0;
}

/* ===== HEADER ===== */
.header-section {
  padding: 0 32px;
  width: 100%;
}

.header {
  background-color: rgba(255, 255, 255, 0);
  height: 50px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.menu-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 5px 13px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #202122;
}

.menu-button:hover {
  background-color: #f8f9fa;
}

.header-section--minerva {
  padding: 0 16px;
  background-color: #eaecf0;
  border-bottom: 1px solid #c8ccd1;
}

.minerva-skin.edit-mode .header-section {
  display: none;
}

.header--minerva {
  background-color: transparent;
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.minerva-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header--minerva .menu-button {
  position: static;
  transform: none;
}

.menu-button--minerva {
  padding: 4px 8px;
}

.minerva-brand {
  display: flex;
  align-items: center;
}

.minerva-wordmark-img {
  display: block;
  height: 21px;
  width: auto;
  opacity: 0.67;
}

.minerva-brand-text {
  width: 120px;
  font-size: 20px;
  letter-spacing: 0.6px;
  font-variant: small-caps;
}

.minerva-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.header--minerva .icon-btn {
  color: var(--color-subtle, #54595d);
}

.menu-popup {
  position: absolute;
  left: 0;
  top: calc(50% + 22px);
  background-color: #ffffff;
  border: 1px solid #a2a9b1;
  border-radius: 4px;
  padding: 16px;
  display: grid;
  gap: 8px;
  min-width: 220px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.menu-popup--minerva {
  top: calc(100% + 6px);
}

.menu-radio {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #202122;
  cursor: pointer;
}

.menu-radio input {
  cursor: pointer;
}

/* Wikipedia Logo */
.wikipedia-logo {
  position: absolute;
  left: 58px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2px;
  padding-block: 3px;
  padding-inline-start: 12px;
  margin-inline-start: 8px;
  width: 152px;
  min-height: 44px;
}

.wikipedia-wordmark-img,
.wikipedia-tagline-img {
  display: block;
  width: auto;
  max-width: 100%;
}

.wikipedia-wordmark-img {
  margin-inline-start: -3px;
}

/* Search */
.search-container {
  position: absolute;
  left: 294px;
  right: 538px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}

/* TypeaheadSearch overrides for header integration */
.search-container :deep(.cdx-typeahead-search) {
  width: 100%;
}

.search-container :deep(.cdx-search-input) {
  width: 100%;
}

.search-container :deep(.cdx-text-input__input) {
  font-size: 14px;
  font-family: 'Inter', sans-serif;
}

.search-container :deep(.cdx-search-input__end-button) {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
}

/* User Tools */
.user-tools {
  position: absolute;
  right: 1.31px;
  top: calc(50% - 0.39px);
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-link {
  padding: 0 6px;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: #36c;
  text-decoration: none;
  border-radius: 2px;
}

.user-link:hover {
  text-decoration: underline;
}

.icon-btn {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 5px 7px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #202122;
}

.icon-btn:hover {
  background-color: #f8f9fa;
}

.user-menu-btn {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 6px 8px 6px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  color: #202122;
}

.user-menu-btn:hover {
  background-color: #f8f9fa;
}

/* ===== MAIN CONTENT AREA ===== */
.main-content-area {
  display: flex;
  gap: 24px;
  padding: 0 32px;
  align-items: flex-start;
  width: 100%;
}

.minerva-skin .main-content-area {
  padding: 0 16px;
  gap: 0;
  transition: padding 180ms ease, transform 180ms ease;
}

.minerva-expandable-rail-mode .main-content-area,
.minerva-expandable-rail-open .main-content-area {
  transform: none;
}

.minerva-suggestions-on .main-content-area {
  padding-right: 0;
}

.minerva-suggestions-on--rail .main-content-area {
  padding-right: 0;
}

.minerva-skin .toc-sidebar,
.minerva-skin .tools-sidebar {
  display: none;
}

.minerva-skin .article {
  max-width: 100%;
}

/* ===== TABLE OF CONTENTS (LEFT SIDEBAR) ===== */
.toc-sidebar {
  width: 209px;
  flex-shrink: 0;
  padding-top: 56px;
  border-radius: 2px;
}

@media (max-width: 1119px) {
  .toc-sidebar {
    display: none;
  }
}

.toc-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toc-header {
  padding: 0 0 6px 20px;
  border-bottom: 1px solid #dadde3;
  display: flex;
  align-items: center;
  gap: 12px;
}

.toc-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
  margin: 0;
}

.toc-toggle {
  background-color: #eaecf0;
  border: none;
  border-radius: 2px;
  padding: 1px 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 20px;
  color: #202122;
  cursor: pointer;
}

.toc-toggle:hover {
  background-color: #dadde3;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toc-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
}

.toc-item-no-chevron {
  padding-left: 26px;
}

.toc-expand {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.toc-expand :deep(.cdx-icon) {
  transition: transform 0.2s ease;
}

.toc-expand-open :deep(.cdx-icon) {
  transform: rotate(90deg);
}

.toc-link {
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #36c;
  text-decoration: none;
  border-radius: 2px;
  white-space: pre-wrap;
}

.toc-link:hover {
  text-decoration: underline;
}

.toc-link-bold {
  font-weight: bold;
  color: #202122;
}

.toc-sub-item {
  padding-left: 28px;
  width: 100%;
}

.toc-sub-item .toc-link {
  display: block;
}

/* ===== ARTICLE (CENTER COLUMN) ===== */
.article {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0; /* No gap between article-chrome and edit-mode-content */
  width: 100%;
  max-width: 1067px;
}

/* Article Chrome (Title + Toolbar) */
.article-chrome {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-toolbar {
  display: flex;
  flex-direction: column;
}

.minerva-title-toolbar {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 2px 0 6px;
}

.minerva-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #c8ccd1;
}

.minerva-article-title {
  color: var(--color-emphasized, #202122);
  font-family: 'Source Serif Pro', serif;
  font-size: var(--font-size-xxx-large, 28px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-height-xxx-large, 38px);
  margin: 0;
}

.minerva-language-button {
  display: none;
}

.minerva-tabs {
  display: flex;
  align-items: center;
  gap: 18px;
  border-bottom: 1px solid #c8ccd1;
  padding-bottom: 0;
}

.minerva-tab {
  border: none;
  background: transparent;
  color: var(--color-subtle, #54595d);
  padding: 0 0 5px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.minerva-tab--active {
  border-bottom-color: #202122;
}

.minerva-actions {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  align-items: center;
  border-bottom: 1px solid #c8ccd1;
  justify-items: center;
  margin-top: 0;
}

.minerva-action-btn {
  border: none;
  background: none;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 4px;
  cursor: pointer;
  color: var(--color-subtle, #54595d);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.minerva-actions .minerva-action-btn:first-child {
  justify-self: start;
}

.minerva-actions .minerva-action-btn:last-child {
  justify-self: end;
}

.minerva-action-btn:hover {
  background-color: #eaecf0;
}

.minerva-ellipsis-icon :deep(svg) {
  transform: rotate(90deg);
}

.article-title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title-and-language {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.toc-toggle-btn {
  display: none;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #202122;
  border-radius: 2px;
}

.toc-toggle-btn:hover {
  background-color: #f8f9fa;
}

@media (max-width: 1119px) {
  .toc-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.article-title {
  flex: 1;
  font-family: 'Source Serif Pro', serif;
  font-weight: 400;
  font-size: 28px;
  line-height: 35px;
  color: #101418;
  margin: 0;
  white-space: pre-wrap;
}

@media (max-width: 1119px) {
  .title-and-language {
    gap: 8px;
  }
  
  .language-button {
    margin-left: auto;
  }
}

.language-button {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 5px 9px 5px 7px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.language-button:hover {
  background-color: #f8f9fa;
}

.language-button :deep(.cdx-icon) {
  color: #36c;
}

.language-text {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #36c;
}

.title-divider {
  height: 1px;
  background-color: #a2a9b1;
  width: 100%;
}

/* Toolbar */
.toolbar {
  display: flex;
  flex-direction: column;
}

.tabs {
  height: 43px;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.tabs-start,
.tabs-end {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.tabs-end {
  margin-right: -6px;
}

.tools-toggle-btn {
  display: none;
  background: none;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  color: #202122;
  border-radius: 2px;
  gap: 4px;
  align-items: center;
}

.tools-toggle-btn:hover {
  background-color: #f8f9fa;
}

.tools-toggle-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
}

@media (max-width: 1119px) {
  .tools-toggle-btn {
    display: flex;
  }
}

.tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 16px 0 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.tab-text {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
  text-align: center;
  white-space: nowrap;
}

.tab-link {
  color: #36c;
  cursor: pointer;
}

.tab-link:hover {
  text-decoration: underline;
}

.tab-selected .tab-text {
  color: #202122;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #202122;
}

.tab-icon-btn {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid rgba(255, 255, 255, 0);
  border-radius: 2px;
  padding: 5px 13px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #202122;
  margin-bottom: 4px;
}

.tab-icon-btn:hover {
  background-color: #f8f9fa;
}

.toolbar-divider {
  height: 1px;
  background-color: #c8ccd1;
  width: 100%;
}

.article-tagline {
  font-family: 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-size: 12.4px;
  line-height: 17.3px;
  color: #101418;
  margin: 0;
}

.article-tagline--minerva {
  font-family: 'Helvetica Neue', sans-serif;
  font-size: 12.4px;
  line-height: 17.3px;
  color: #101418;
  margin: 6px 0 2px;
}

/* Article Content */
.article-content-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.minerva-article-content {
  gap: 12px;
}

.minerva-first-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.minerva-intro {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #202122;
}

.minerva-intro p {
  margin: 0;
}

.minerva-article-content .body-text {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #202122;
}

.minerva-article-content .body-text a {
  color: #3366cc;
}

.minerva-skin a {
  color: var(--color-progressive, #36c);
  text-decoration: none;
}

.minerva-skin a:hover,
.minerva-skin a:active {
  text-decoration: underline;
}

.minerva-accordion {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.minerva-accordion-item {
  border-bottom: 1px solid #c8ccd1;
}

.minerva-accordion-item:first-child {
  border-top: 1px solid #c8ccd1;
}

.minerva-accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 58px;
}

.minerva-accordion-toggle {
  background: none;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-subtle, #54595d);
  cursor: pointer;
  padding: 0;
}

.minerva-accordion-toggle span {
  color: var(--color-emphasized, #202122);
  font-family: 'Source Serif Pro', serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px;
}

.minerva-accordion-panel {
  padding: 0 0 12px;
}

.minerva-accordion-icon--open {
  transform: rotate(180deg);
}

.minerva-accordion-toggle :deep(svg) {
  transition: transform 0.2s ease;
}

.minerva-accordion-edit {
  border: none;
  background: none;
  color: var(--color-subtle, #54595d);
  padding: 4px;
  cursor: pointer;
  position: relative;
}

.minerva-accordion-edit :deep(svg) {
  width: 20px;
  height: 20px;
}

.minerva-last-edited {
  margin-top: 8px;
  background-color: #3366cc;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 0;
  font-size: 12px;
}

.minerva-skin .minerva-last-edited :deep(.cdx-icon) {
  color: var(--color-inverted, #ffffff);
}

.minerva-last-edited-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.minerva-last-edited-title {
  font-weight: 600;
}

.minerva-last-edited-subtitle {
  opacity: 0.9;
}

.minerva-last-edited-arrow {
  margin-left: auto;
}

.minerva-related {
  margin-top: 16px;
}

.minerva-related-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #54595d;
  margin-bottom: 8px;
}

.minerva-related-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.minerva-related-card {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px;
  border: 1px solid #c8ccd1;
  border-radius: 6px;
  background: #ffffff;
}

.minerva-related-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.minerva-related-name {
  font-size: 13px;
  font-weight: 600;
  color: #202122;
}

.minerva-related-meta {
  font-size: 11px;
  color: #54595d;
}

.minerva-footer {
  margin-top: 24px;
  padding: 16px 0 24px;
  border-top: 1px solid #c8ccd1;
  color: #54595d;
}

.minerva-footer-brand {
  font-family: 'Linux Libertine', 'Georgia', 'Times', serif;
  font-size: 16px;
  margin-bottom: 6px;
}

.minerva-footer-meta {
  font-size: 11px;
  line-height: 16px;
}

.minerva-footer-meta a {
  color: #3366cc;
  text-decoration: none;
}

.minerva-footer-meta a:hover {
  text-decoration: underline;
}

.article-ve-contents {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article-content-grid {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

/* Article Text */
.article-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.intro-text,
.body-text {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: #202122;
}

.intro-text p,
.body-text p {
  margin: 0;
  line-height: 22px;
}

.intro-text strong,
.body-text strong {
  font-weight: bold;
}

.intro-text a,
.body-text a {
  color: #36c;
  text-decoration: none;
}

.intro-text a:hover,
.body-text a:hover {
  text-decoration: underline;
}

/* Section Heading */
.section-heading {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-heading-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.heading-text {
  font-family: 'Source Serif Pro', serif;
  font-weight: 400;
  font-size: 22px;
  line-height: 32px;
  color: #202122;
  margin: 0;
  white-space: pre-wrap;
}

.section-edit {
  font-size: 12px;
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.section-edit-bracket {
  color: var(--color-subtle, #54595d);
}

.section-edit-link {
  color: var(--color-progressive, #36c);
  text-decoration: none;
}

.section-edit-link:hover {
  text-decoration: underline;
}

.subsection-title {
  display: block;
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0 0;
}

.minerva-skin .subsection-title {
  font-size: 20px;
}

.theory-subheading {
  display: block;
  margin: 16px 0 0;
  font-weight: 600;
  font-size: 18px;
  line-height: 28px;
}

.theory-subheading--level4 {
  font-size: 16px;
  line-height: 26px;
}

.minerva-skin .theory-subheading {
  font-size: 20px;
  line-height: 30px;
}

.minerva-skin .theory-subheading--level4 {
  font-size: 18px;
  line-height: 28px;
}

.heading-divider {
  height: 1px;
  background-color: #a2a9b1;
  width: 100%;
}

.edit-full-page-btn-wrapper {
  position: relative;
  display: block;
  width: fit-content;
  margin: 12px auto;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .edit-full-page-btn-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0;
  padding: 24px 0;
  background-color: var(--background-color-neutral-subtle, #f8f9fa);
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .minerva-edit-section > .edit-full-page-btn-wrapper {
  display: none;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .minerva-edit-section:first-of-type > .edit-full-page-btn-wrapper:first-child,
.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .minerva-edit-section:last-of-type > .edit-full-page-btn-wrapper:last-child {
  display: flex;
}

.edit-full-page-btn {
  display: block;
  margin: 0;
}

.edit-full-page-btn:not(.edit-full-page-btn--improved) :deep(.cdx-button) {
  background-color: var(--background-color-interactive-subtle);
  border-color: var(--border-color-interactive);
}

.edit-full-page-btn-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.edit-full-page-start-icon {
  color: var(--color-subtle, #54595d);
}

.edit-full-page-btn--improved,
.edit-full-page-btn--improved .edit-full-page-btn-content,
.edit-full-page-btn--improved :deep(.cdx-button__label),
.edit-full-page-btn--improved :deep(.cdx-button__button),
.edit-full-page-btn--improved :deep(.cdx-icon),
.edit-full-page-btn--improved :deep(svg) {
  color: var(--color-subtle, #54595d);
}

.edit-full-page-separator {
  color: var(--color-subtle, #54595d);
  font-weight: 400;
}

.edit-full-page-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  position: relative;
}

.edit-full-page-icon {
  color: var(--color-base, #202122);
  width: 16px;
  height: 16px;
}

.minerva-skin .edit-full-page-btn .edit-full-page-icon {
  color: var(--color-base, #202122);
}

.edit-full-page-badge-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--color-progressive, #36c);
}

.edit-full-page-badge {
  top: 0;
  right: 0;
  bottom: auto;
  transform: translate(50%, -50%);
}


.subsection-heading {
  font-family: 'Source Serif Pro', serif;
  font-weight: 600;
  font-size: 17px;
  line-height: 24px;
  color: #202122;
  margin-top: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid #a2a9b1;
  padding-bottom: 2px;
}

.body-text ul {
  margin: 0.5em 0 0.5em 1.6em;
  padding: 0;
  list-style-type: disc;
}

.body-text ul li {
  margin-bottom: 0.3em;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 22.4px;
  color: #202122;
}

.body-text ul li a {
  color: #36c;
  text-decoration: none;
}

.body-text ul li a:hover {
  text-decoration: underline;
}

/* Infobox */
.infobox {
  width: 272px;
  flex-shrink: 0;
  background-color: #eaecf0;
  border: 1px solid #c8ccd1;
  border-radius: 2px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.minerva-skin .infobox {
  width: 318px;
  background-color: #f8f9fa;
  border-color: #c8ccd1;
  padding: 6px;
}

@media (max-width: 639px) {
  .minerva-skin .infobox {
    width: 100%;
  }
}

.minerva-skin .infobox-image {
  max-width: 318px;
  margin: 0 auto;
  height: auto;
}

.minerva-skin .infobox-image img {
  height: auto;
  object-fit: contain;
}

.minerva-skin :deep(.cdx-icon) {
  color: var(--color-subtle, #54595d);
}

.minerva-skin.edit-mode .editor-toolbar--minerva :deep(.cdx-icon) {
  color: var(--color-base, #202122);
}

.minerva-skin.edit-mode .editor-toolbar--minerva .toolbar-btn:disabled :deep(.cdx-icon),
.minerva-skin.edit-mode .editor-toolbar--minerva .toolbar-btn-primary:disabled :deep(.cdx-icon) {
  color: var(--color-disabled, #a2a9b1);
}

.minerva-skin.edit-mode .editor-toolbar--minerva .toolbar-btn-primary:not(:disabled) :deep(.cdx-icon) {
  color: var(--color-inverted, #ffffff);
}

.minerva-skin :deep(.cdx-icon svg) {
  width: 20px;
  height: 20px;
}

.minerva-skin .infobox-title {
  font-size: 14px;
  line-height: 20px;
}

.minerva-skin .infobox-caption {
  font-size: 11px;
  line-height: 16px;
}

.minerva-skin .infobox-row {
  font-size: 14px;
  gap: 6px;
}

.minerva-skin .infobox-label {
  min-width: 80px;
}

.infobox-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 16px;
  line-height: 26px;
  color: #202122;
  text-align: center;
}

.infobox-image-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.infobox-image {
  width: 100%;
  height: 330px;
  overflow: hidden;
}

.infobox-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
}

.infobox-caption {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  color: #202122;
  text-align: center;
  padding: 4px;
  white-space: pre-wrap;
}

.infobox-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
}

.infobox-row-faded {
  opacity: 0.8;
}

.infobox-label {
  width: 64px;
  flex-shrink: 0;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  line-height: 20px;
  color: #202122;
  white-space: pre-wrap;
}

.infobox-value {
  flex: 1;
  min-width: 0;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  line-height: 20px;
  color: #202122;
  white-space: nowrap;
}

.infobox-value-link {
  line-height: 20px;
  white-space: pre-wrap;
}

.infobox-value a {
  color: #36c;
  text-decoration: none;
}

.infobox-value a:hover {
  text-decoration: underline;
}

/* Additional Paragraphs */
.additional-paragraphs {
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 22px;
  color: #202122;
  white-space: pre-wrap;
}

.additional-paragraphs p {
  margin: 0 0 16px 0;
  line-height: 22px;
}

.additional-paragraphs p:last-child {
  margin-bottom: 0;
}

.additional-paragraphs a {
  color: #36c;
  text-decoration: none;
}

.additional-paragraphs a:hover {
  text-decoration: underline;
}

/* ===== TOOLS SIDEBAR (RIGHT) ===== */
.tools-sidebar {
  width: 208px;
  flex-shrink: 0;
  padding-top: 56px;
  border-radius: 2px;
}

@media (max-width: 1119px) {
  .tools-sidebar {
    display: none;
  }
}

.tools-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tools-header {
  padding-bottom: 6px;
  border-bottom: 1px solid #dadde3;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tools-title {
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
  margin: 0;
}

.tools-toggle {
  background-color: #eaecf0;
  border: none;
  border-radius: 2px;
  padding: 1px 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 20px;
  color: #202122;
  cursor: pointer;
}

.tools-toggle:hover {
  background-color: #dadde3;
}

.tools-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 6px;
  border-bottom: 1px solid #dadde3;
}

.tools-section:last-child {
  border-bottom: none;
}

.tools-section-title {
  padding: 6px 0;
  border-bottom: 1px solid #dadde3;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #54595d;
  width: 194px;
  white-space: pre-wrap;
}

.tools-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tools-link {
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #36c;
  text-decoration: none;
  border-radius: 2px;
  white-space: pre-wrap;
  display: block;
}

.tools-link:hover {
  text-decoration: underline;
}

/* ===== EDIT MODE STYLES ===== */
.edit-mode {
  background-color: #ffffff;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved,
.minerva-skin.edit-mode.minerva-edit-full-page-improved .page-container,
.minerva-skin.edit-mode.minerva-edit-full-page-improved .main-content-area,
.minerva-skin.edit-mode.minerva-edit-full-page-improved .article,
.minerva-skin.edit-mode.minerva-edit-full-page-improved .edit-mode-content,
.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit,
.minerva-skin.edit-mode.minerva-edit-full-page-improved.minerva-suggestions-on,
.minerva-skin.edit-mode.minerva-edit-full-page-improved.minerva-suggestions-on--rail,
.minerva-skin.edit-mode.minerva-edit-full-page-improved.minerva-suggestions-on .article-content-edit,
.minerva-skin.edit-mode.minerva-edit-full-page-improved.minerva-suggestions-on--rail .article-content-edit {
  background-color: var(--background-color-neutral-subtle, #f8f9fa);
}

.vector-skin.edit-mode .article {
  width: 100%;
  max-width: 949px;
  margin: 0 auto;
}

.tab {
  cursor: pointer;
}

.edit-mode-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  position: relative;
}

/* Editor Toolbar */
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 42px; /* Changed from height to min-height to allow wrapping */
  flex-wrap: wrap; /* Allow items to wrap to next line */
  border-bottom: 1px solid #c8ccd1;
  box-shadow: none;
  padding: 0;
  background: #ffffff;
  position: sticky; /* Stick to top when scrolling */
  top: 0; /* Position at top of viewport */
  z-index: 10; /* Ensure toolbar is above content */
}

.editor-toolbar--scrolled {
  box-shadow: 0 4px 4px 0 rgba( 0, 0, 0, 0.06 ), 0 0 8px 0 rgba( 0, 0, 0, 0.06 );
}

.editor-toolbar--minerva {
  justify-content: space-between;
  gap: 0;
}

.editor-toolbar--minerva-spaced {
  justify-content: space-between;
}

.editor-toolbar--minerva .toolbar-btn-primary {
  margin-left: 0;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 0;
}

.editor-toolbar--minerva .toolbar-btn-icon-only:first-child {
  border-right: 1px solid var(--border-color-muted, #c8ccd1);
}

.editor-toolbar--minerva-improved {
  flex-wrap: nowrap;
  min-height: 48px;
}

.editor-toolbar--minerva-improved .toolbar-btn-primary {
  height: 48px;
}

.editor-toolbar--minerva-improved > .minerva-toolbar-fixed {
  flex: 0 0 44px;
  width: 44px;
  min-width: 44px;
  max-width: 44px;
  height: 48px;
}

.editor-toolbar--minerva-improved > .minerva-toolbar-scroll-area {
  flex: 1 1 auto;
  min-width: 0;
  height: 48px;
  position: relative;
  display: flex;
  align-items: stretch;
  overflow-x: hidden;
  overflow-y: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.editor-toolbar--minerva-improved > .minerva-toolbar-scroll-area::-webkit-scrollbar {
  display: none;
}

.editor-toolbar--minerva-improved > .minerva-toolbar-scroll-area--overflowing {
  overflow-x: auto;
}

.editor-toolbar--minerva-improved > .minerva-toolbar-scroll-area--overflowing::after {
  content: '';
  position: sticky;
  right: 0;
  display: block;
  flex: 0 0 16px;
  width: 16px;
  height: 48px;
  margin-left: -16px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), #fff 85%);
  pointer-events: none;
}

.editor-toolbar--minerva-improved > .minerva-toolbar-scroll-area > .minerva-toolbar-fill {
  flex: 1 1 0;
  width: 0;
  min-width: 44px;
  max-width: none;
  height: 48px;
  padding: 0;
  border-left: 0;
  border-right: 0;
}

.editor-toolbar--minerva-improved > .minerva-toolbar-scroll-area--overflowing > .minerva-toolbar-fill {
  flex: 0 0 44px;
  width: 44px;
  max-width: 44px;
}

.editor-toolbar--minerva-improved > .minerva-toolbar-scroll-area > .text-style-menu {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-toolbar--minerva-improved .minerva-add-menu-trigger,
.editor-toolbar--minerva-improved .minerva-edit-menu-trigger,
.editor-toolbar--minerva-improved .text-style-menu-trigger,
.editor-toolbar--minerva-improved .minerva-toolbar-toggle,
.editor-toolbar--minerva-improved .minerva-toolbar-toggle :deep(button) {
  width: 44px;
  height: 48px;
}

.minerva-skin.edit-mode.minerva-edit-toolbar-improved .edit-mode-content {
  padding-top: 48px;
}

.text-style-menu-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
}

.text-style-menu-trigger--active {
  background: var(--background-color-interactive-subtle, #eaecf0);
  border-color: var(--border-color-base, #a2a9b1);
}

.text-style-menu-panel {
  position: fixed;
  top: 48px;
  right: 0;
  left: auto;
  width: min(224px, calc(100vw - 16px));
  background: #fff;
  border: 1px solid var(--border-color-base, #a2a9b1);
  border-radius: 2px;
  box-shadow: var(--box-shadow-medium, 0 4px 8px 0 rgba(0, 0, 0, 0.12));
  padding: 0;
  z-index: 90;
}

.text-style-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.text-style-menu-item {
  display: flex;
}

.text-style-menu-divider {
  height: 1px;
  margin: 4px 0;
  background: var(--border-color-subtle, #c8ccd1);
}

.text-style-menu-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border: 0;
  border-radius: 2px;
  background: transparent;
  color: var(--color-base, #202122);
  font-size: 16px;
  text-align: left;
  cursor: pointer;
}

.text-style-menu-button:hover {
  background: #f8f9fa;
}

.text-style-menu-button--selected {
  background: var(--background-color-progressive-subtle, #e8eeff);
  color: var(--color-progressive, #36c);
}

.text-style-menu-button :deep(.cdx-icon),
.text-style-menu-button :deep(svg) {
  width: 20px;
  height: 20px;
}

.minerva-skin.edit-mode .edit-mode-content {
  padding-top: 42px;
}

.minerva-skin.edit-mode .editor-toolbar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 60;
  width: 100%;
  max-width: 994px;
}

.editor-toolbar-left,
.editor-toolbar-right {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap; /* Allow buttons to wrap within each section */
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 42px;
  padding: 5px 13px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 2px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
}

.toolbar-btn:hover {
  background-color: #f8f9fa;
}

.toolbar-btn-icon-only {
  width: 40px;
  padding: 5px;
}

.minerva-add-menu {
  position: relative;
  padding: 0;
}

.minerva-add-menu-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 42px;
  padding: 0;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
}

.minerva-add-menu-trigger--active {
  background: var(--background-color-interactive-subtle, #eaecf0);
  border-color: var(--border-color-base, #a2a9b1);
}

.minerva-add-menu-panel {
  position: fixed;
  top: 42px;
  right: 0;
  left: auto;
  width: min(256px, 100vw);
  max-width: 256px;
  background: #ffffff;
  border: 1px solid var(--border-color-base, #a2a9b1);
  border-radius: 2px;
  box-shadow: var(--box-shadow-medium, 0 4px 8px 0 rgba(0, 0, 0, 0.12));
  padding: 0;
  z-index: 90;
}

.minerva-add-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.minerva-add-menu-item {
  display: flex;
}

.minerva-add-menu-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border: 0;
  border-radius: 2px;
  background: transparent;
  color: var(--color-base, #202122);
  font-size: 16px;
  text-align: left;
  cursor: pointer;
}

.minerva-add-menu-button:hover {
  background: #f8f9fa;
}

.minerva-add-menu-button :deep(.cdx-icon) {
  color: var(--color-subtle, #54595d);
}

.minerva-add-menu-button :deep(svg) {
  width: 20px;
  height: 20px;
}

.minerva-edit-menu {
  position: relative;
  padding: 0;
}

.minerva-edit-menu-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 42px;
  padding: 0;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
}

.minerva-edit-menu-trigger--active {
  background: var(--background-color-interactive-subtle, #eaecf0);
  border-color: var(--border-color-base, #a2a9b1);
}

.minerva-edit-menu-ellipsis-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: rotate(90deg);
  transform-origin: center;
}

.minerva-edit-menu-ellipsis-icon {
  display: inline-flex;
}

.minerva-edit-menu-ellipsis-icon :deep(svg) {
  display: block;
}

.minerva-edit-menu-trigger-badge-dot {
  position: absolute;
  top: -1px;
  right: -1px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--background-color-progressive, #36c);
}

.minerva-rail-to-menu-badge {
  position: fixed;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--background-color-progressive, #36c);
  pointer-events: none;
  z-index: 95;
  transition: left 320ms ease, top 320ms ease, opacity 320ms ease;
}

.minerva-edit-menu-panel {
  position: fixed;
  top: 42px;
  right: 0;
  left: auto;
  width: min(256px, 100vw);
  max-width: 256px;
  background: #ffffff;
  border: 1px solid var(--border-color-base, #a2a9b1);
  border-radius: 2px;
  box-shadow: var(--box-shadow-medium, 0 4px 8px 0 rgba(0, 0, 0, 0.12));
  padding: 0;
  z-index: 90;
}

.minerva-full-page-toc {
  position: fixed;
  right: 10px;
  z-index: 104;
}

.minerva-full-page-toc-trigger {
  width: 32px;
  height: 32px;
  min-width: 32px;
}

.minerva-full-page-toc-trigger :deep(.cdx-button__button) {
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
  border-color: var(--border-color-subtle, #c8ccd1);
  box-shadow: var(--box-shadow-medium, 0 4px 8px 0 rgba(0, 0, 0, 0.12));
}

.minerva-full-page-toc-overlay {
  position: fixed;
  inset: 0;
  background: var(--background-color-backdrop-light, rgba(255, 255, 255, 0.65));
  z-index: 103;
}

.minerva-full-page-toc-panel {
  position: fixed;
  right: 0;
  width: min(220px, 100vw);
  max-width: 220px;
  bottom: 0;
  overflow-y: auto;
  background: var(--background-color-base, #fff);
  border-left: 1px solid var(--border-color-muted, #c8ccd1);
  border-right: 1px solid var(--border-color-muted, #c8ccd1);
  border-radius: 0;
  box-shadow: var(--box-shadow-medium, 0 4px 8px 0 rgba(0, 0, 0, 0.12));
  padding: 0;
  z-index: 104;
  scrollbar-width: none;
}

.minerva-full-page-toc-panel::-webkit-scrollbar {
  display: none;
}

.minerva-full-page-toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding: 0 12px;
  border-bottom: 1px solid var(--border-color-muted, #c8ccd1);
  background: var(--background-color-base, #fff);
  position: sticky;
  top: 0;
  z-index: 1;
}

.minerva-full-page-toc-title {
  color: var(--color-subtle, #54595d);
  font-size: 16px;
  line-height: 24px;
}

.minerva-full-page-toc-close {
  flex: 0 0 auto;
}

.minerva-full-page-toc-close :deep(.cdx-button__button) {
  min-width: 32px;
  width: 32px;
  height: 32px;
  padding: 0;
}

.minerva-full-page-toc-close :deep(.cdx-icon),
.minerva-full-page-toc-close :deep(svg) {
  color: var(--color-base, #202122);
  fill: var(--color-base, #202122);
}

.minerva-full-page-toc-list {
  display: flex;
  flex-direction: column;
}

.minerva-full-page-toc-node {
  display: flex;
  flex-direction: column;
}

.minerva-full-page-toc-item {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 44px;
  padding: 0 12px;
}

.minerva-full-page-toc-item--active {
  color: var(--color-base, #202122);
}

.minerva-full-page-toc-item--child {
  height: 44px;
  padding-left: 44px;
}

.minerva-full-page-toc-children {
  display: flex;
  flex-direction: column;
}

.minerva-full-page-toc-chevron,
.minerva-full-page-toc-link {
  border: 0;
  background: transparent;
  padding: 0;
}

.minerva-full-page-toc-chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--color-base, #54595d);
  flex: 0 0 24px;
  cursor: pointer;
}

.minerva-full-page-toc-chevron-icon {
  transition: transform 160ms ease;
}

.minerva-full-page-toc-chevron-icon--open {
  transform: rotate(90deg);
}

.minerva-full-page-toc-chevron-spacer {
  flex: 0 0 24px;
  width: 24px;
}

.minerva-full-page-toc-chevron-spacer--child {
  flex-basis: 0;
  width: 0;
}

.minerva-full-page-toc-link {
  flex: 1 1 auto;
  min-width: 0;
  color: var(--color-base, #202122);
  text-align: left;
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.minerva-full-page-toc-link--top {
  color: var(--color-base, #202122);
}

.minerva-full-page-toc-item--active .minerva-full-page-toc-link {
  color: var(--color-base, #202122);
  font-weight: 700;
}

.minerva-full-page-toc-item-warning {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--color-icon-warning, #ab7f2a);
  flex: 0 0 16px;
}

.minerva-full-page-toc-item-warning :deep(.cdx-icon),
.minerva-full-page-toc-item-warning :deep(svg) {
  width: 16px;
  height: 16px;
  color: var(--color-icon-warning, #ab7f2a);
  fill: var(--color-icon-warning, #ab7f2a);
}

.prototype-suboptions {
  margin: 8px 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prototype-suboptions--indexed-radios {
  margin-top: 0;
  margin-bottom: 8px;
  gap: 0;
}

.minerva-full-page-sections-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 103;
  display: block;
  width: 44px;
  pointer-events: none;
}

.minerva-full-page-sections-overlay {
  position: fixed;
  inset: 0;
  z-index: 102;
  background: var(--background-color-backdrop-light, rgba(255, 255, 255, 0.65));
}

.minerva-full-page-sections-trigger {
  position: absolute;
  right: 0;
  min-width: 44px;
  height: 44px;
  margin-right: 0;
  pointer-events: auto;
  touch-action: none;
}

.minerva-full-page-sections-trigger :deep(.cdx-button__button) {
  width: 44px;
  height: 44px;
  min-width: 44px;
  padding: 0;
  border-radius: 0;
  border-color: transparent;
  background: var(--background-color-neutral-subtle, #f8f9fa) !important;
  background-color: var(--background-color-neutral-subtle, #f8f9fa) !important;
  touch-action: none;
}

.minerva-full-page-sections-trigger :deep(.cdx-button__button:hover) {
  background: var(--background-color-neutral-subtle, #f8f9fa) !important;
  background-color: var(--background-color-neutral-subtle, #f8f9fa) !important;
}

.minerva-full-page-sections-trigger :deep(.cdx-button__button:active) {
  background: var(--background-color-interactive-subtle--active, #dadde3) !important;
  background-color: var(--background-color-interactive-subtle--active, #dadde3) !important;
}

.minerva-full-page-sections-trigger-icon {
  width: 18px;
  height: 18px;
  display: block;
}

.minerva-full-page-sections-panel {
  position: absolute;
  right: 44px;
  bottom: 0;
  width: fit-content;
  min-width: 180px;
  max-width: 256px;
  overflow-y: auto;
  background: var(--background-color-base, #fff);
  border-left: 1px solid var(--border-color-muted, #a2a9b1);
  border-right: 1px solid var(--border-color-muted, #a2a9b1);
  padding: 12px 0;
  pointer-events: auto;
  box-sizing: border-box;
  scrollbar-width: none;
}

.minerva-full-page-sections-panel::-webkit-scrollbar {
  display: none;
}

.minerva-full-page-sections-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 12px;
  width: 100%;
  box-sizing: border-box;
}

.minerva-full-page-sections-item--child {
  padding-left: 24px;
}

.minerva-full-page-sections-item--active .minerva-full-page-sections-link {
  color: var(--color-base, #202122);
  font-weight: 700;
}

.minerva-full-page-sections-link {
  flex: 1 1 auto;
  min-width: 0;
  border: 0;
  background: transparent;
  padding: 0;
  color: var(--color-progressive, #36c);
  text-align: left;
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: auto;
}

.minerva-full-page-sections-badge {
  min-width: 16px;
  height: 16px;
  padding: 0 2px;
  border-radius: 2px;
  background: var(--background-color-progressive, #36c);
  color: #fff;
  font-size: 12px;
  line-height: 16px;
  font-weight: 700;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  box-sizing: border-box;
  pointer-events: auto;
}

.minerva-full-page-sections-warning {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--color-icon-warning, #ab7f2a);
  flex: 0 0 16px;
  pointer-events: auto;
}

.minerva-full-page-sections-warning :deep(.cdx-icon),
.minerva-full-page-sections-warning :deep(svg) {
  width: 16px;
  height: 16px;
  color: var(--color-icon-warning, #ab7f2a);
  fill: var(--color-icon-warning, #ab7f2a);
}

.minerva-expandable-rail-panel {
  position: fixed;
  top: 42px;
  right: 0;
  bottom: 0;
  width: 318px;
  background: var(--background-color-neutral-subtle, #f8f9fa);
  border-left: 1px solid var(--border-color-muted, #DADDE3);
  z-index: 82;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
}

.minerva-expandable-rail-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 12px;
  border-bottom: 1px solid var(--border-color-muted, #DADDE3);
  flex: 0 0 auto;
}

.minerva-expandable-rail-close {
  flex: 0 0 auto;
}

.minerva-expandable-rail-close :deep(.cdx-button__button) {
  min-width: 32px;
  width: 32px;
  height: 32px;
  padding: 0;
}

.minerva-expandable-rail-close :deep(.cdx-icon),
.minerva-expandable-rail-close :deep(svg) {
  color: var(--color-base, #202122);
  fill: var(--color-base, #202122);
}

.minerva-expandable-rail-title {
  color: var(--color-subtle, #54595d);
  font-size: 16px;
  line-height: 24px;
}

.minerva-expandable-rail-list {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scrollbar-width: none;
  padding: 12px 0;
}

.minerva-expandable-rail-list::-webkit-scrollbar {
  display: none;
}

.minerva-expandable-rail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 16px 8px;
}

.minerva-expandable-rail-link {
  min-height: 44px;
  border: 0;
  background: transparent;
  padding: 0;
  color: var(--color-base, #202122);
  text-align: left;
  font-family: "Linux Libertine", Georgia, "Times New Roman", serif;
  font-size: 18px;
  line-height: 28px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.minerva-expandable-rail-item--active .minerva-expandable-rail-link {
  font-weight: 700;
}

.minerva-expandable-rail-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 16px;
}

.minerva-expandable-rail-meta-row {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 20px;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-base, #202122);
}

.minerva-expandable-rail-meta-row--suggestions :deep(.cdx-icon),
.minerva-expandable-rail-meta-row--suggestions :deep(svg) {
  width: 12px;
  height: 12px;
  color: var(--color-progressive, #36c);
  fill: var(--color-progressive, #36c);
}

.minerva-expandable-rail-meta-row--checks :deep(.cdx-icon),
.minerva-expandable-rail-meta-row--checks :deep(svg) {
  width: 12px;
  height: 12px;
  color: var(--color-icon-warning, #ab7f2a);
  fill: var(--color-icon-warning, #ab7f2a);
}

.minerva-edit-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.minerva-edit-menu-item {
  display: flex;
}

.minerva-edit-menu-divider {
  height: 1px;
  margin: 4px 0;
  background: var(--border-color-subtle, #c8ccd1);
}

.minerva-edit-menu-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border: 0;
  border-radius: 2px;
  background: transparent;
  color: var(--color-base, #202122);
  font-size: 16px;
  text-align: left;
  cursor: pointer;
}

.minerva-edit-menu-button--switch-row {
  justify-content: flex-start;
}

.minerva-edit-menu-button:hover {
  background: #f8f9fa;
}

.minerva-edit-menu-button--active {
  background: var(--suggestion-color-subtle, var(--background-color-progressive-subtle, #e8eeff));
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-edit-menu-button--active :deep(.cdx-icon) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-edit-menu-button--active :deep(svg) {
  fill: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-edit-menu-button--active:not([aria-pressed="true"]) {
  background: var(--background-color-progressive-subtle, #e8eeff);
  color: var(--color-progressive, #36c);
}

.minerva-edit-menu-button--active:not([aria-pressed="true"]) :deep(.cdx-icon) {
  color: var(--color-progressive, #36c);
}

.minerva-edit-menu-button--active:not([aria-pressed="true"]) :deep(svg) {
  fill: var(--color-progressive, #36c);
}

.minerva-edit-menu-button :deep(.cdx-icon) {
  color: var(--color-subtle, #54595d);
}

.minerva-edit-menu-button :deep(svg) {
  width: 20px;
  height: 20px;
}

.minerva-edit-menu-badge {
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 2px;
  background: transparent;
  border: 1px solid var(--suggestion-color, var(--border-color-progressive, #36c));
  color: var(--suggestion-color, var(--color-progressive, #36c));
  font-weight: 700;
  line-height: 20px;
  text-align: center;
}

.minerva-edit-menu-switch {
  margin-left: auto;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  min-width: 32px;
  height: 22px;
  min-height: 22px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.minerva-edit-menu-lightbulb {
  flex: 0 0 auto;
}

.minerva-edit-menu-switch__track {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 32px;
  min-width: 32px;
  height: 22px;
  min-height: 22px;
  border: 1px solid var(--border-color-interactive, #72777d);
  border-radius: 999px;
  background: var(--background-color-base, #fff);
  box-sizing: border-box;
}

.minerva-edit-menu-switch--checked .minerva-edit-menu-switch__track {
  background: var(--background-color-progressive, #36c);
  border-color: transparent;
}

.minerva-edit-menu-switch__grip {
  position: absolute;
  top: 50%;
  left: 4px;
  width: 14px;
  height: 14px;
  border: 1px solid var(--border-color-interactive, #72777d);
  border-radius: 50%;
  background: var(--background-color-base, #fff);
  box-sizing: border-box;
  transform: translateY(-50%);
  transition: transform 0.1s, border-color 0.1s;
}

.minerva-edit-menu-switch--checked .minerva-edit-menu-switch__grip {
  border-color: transparent;
  transform: translate(10px, -50%);
}

.minerva-toolbar-toggle {
  width: 44px;
  height: 42px;
  padding: 0;
}

.minerva-toolbar-toggle :deep(button) {
  width: 44px;
  height: 42px;
  padding: 0;
  background: var(--background-color-base, #ffffff);
}

.minerva-toolbar-toggle :deep(.cdx-icon) {
  color: var(--color-base, #202122);
}

.minerva-toolbar-toggle :deep(svg) {
  fill: var(--color-base, #202122);
}

.minerva-toolbar-toggle--active :deep(button) {
  background: #F7E5FF !important;
  background-color: #F7E5FF !important;
}

.minerva-toolbar-toggle--active :deep(button[aria-pressed="true"]) {
  background: #F7E5FF !important;
  background-color: #F7E5FF !important;
}

.minerva-toolbar-toggle--active :deep(.cdx-icon) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-toolbar-toggle--active :deep(svg) {
  fill: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-suggestions-toggle :deep(button) {
  background: var(--background-color-base, #ffffff);
}

.minerva-suggestions-toggle :deep(.cdx-icon) {
  color: var(--color-base, #202122);
}

.minerva-suggestions-toggle :deep(svg) {
  fill: var(--color-base, #202122);
}

.minerva-suggestions-toggle--active :deep(button) {
  background: #F7E5FF !important;
  background-color: #F7E5FF !important;
}

.minerva-suggestions-toggle--active :deep(button[aria-pressed="true"]) {
  background: #F7E5FF !important;
  background-color: #F7E5FF !important;
}

.minerva-suggestions-toggle--active :deep(.cdx-icon) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-suggestions-toggle--active :deep(svg) {
  fill: var(--suggestion-color, var(--color-progressive, #36c));
}

.toolbar-btn-disabled {
  color: #a2a9b1;
  cursor: not-allowed;
}

.toolbar-btn-disabled:hover {
  background-color: transparent;
}

.toolbar-btn-disabled .cdx-icon {
  color: #a2a9b1;
}

.toolbar-btn-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
}

.toolbar-btn-dropdown {
  padding-left: 7px;
  padding-right: 9px;
}

.toolbar-btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 5px 13px;
  background: #36c;
  border: 1px solid #6485d1;
  border-radius: 2px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #ffffff;
}

.toolbar-btn-primary:hover {
  background: #447ff5;
}

.toolbar-btn-primary--disabled {
  background: #eaecf0;
  border-color: #c8ccd1;
  color: #a2a9b1;
  cursor: not-allowed;
}

.toolbar-btn-primary--disabled:hover {
  background: #eaecf0;
}

.dropdown-icon {
  margin-left: 2px;
}

/* Loading Overlay - covers entire page */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--background-color-backdrop-light, rgba(255, 255, 255, 0.65));
  z-index: 100; /* Higher z-index to cover suggestion card */
}

/* ProgressBar - centered on page */
.loading-progress {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 101; /* Above overlay */
  width: 512px;
  max-width: calc(100% - 64px); /* Responsive with 32px padding on each side */
}

/* Edit Header */
.edit-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0 16px;
  background-color: var(--background-color-base, #ffffff);
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .edit-header {
  background-color: var(--background-color-neutral-subtle, #f8f9fa);
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .main-content-area {
  padding-left: 0;
  padding-right: 0;
}

.tagline-edit {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: #72777d;
  margin: 0;
}

.short-description-section {
  display: flex;
  align-items: center;
}

.short-description-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 4px;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 2px;
  cursor: pointer;
}

.short-description-icon {
  color: #a2a9b1;
}

.short-description-text {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #a2a9b1;
}

/* Edit Mode Grid Layout - applies to the entire article + suggestions in edit mode */
.vector-skin.edit-mode .main-content-area {
  display: grid;
  width: 100%;
  align-items: start;
  /* Default (no suggestions): 32px margin + centered column + 32px margin */
  grid-template-columns: 32px 1fr minmax(0, 949px) 1fr 32px;
  transition: grid-template-columns 250ms ease;
  padding: 0;
  gap: 0;
}

/* With suggestions: 32px margin + article + sidebar + 32px margin (no gap) */
.vector-skin.edit-mode .main-content-area.has-suggestions {
  grid-template-columns: 32px minmax(0, 949px) 24px 325px 32px;
}

/* Article takes center column when no suggestions */
.vector-skin.edit-mode .main-content-area .article {
  grid-column: 3; /* Center column (after left margin + left spacer) */
  width: 100%;
  max-width: 949px;
}

/* Article takes second column when suggestions are active */
.vector-skin.edit-mode .main-content-area.has-suggestions .article {
  grid-column: 2; /* Second column (after left margin) */
  width: 100%;
  max-width: 949px;
}

/* Suggestions sidebar - third column (no gap) */
.suggestions-sidebar {
  grid-column: 4; /* Fourth column (after left margin + article + gap) */
  width: 100%;
  max-width: 325px;
  position: relative;
  align-self: start;
  min-height: 100%; /* Allow sidebar to contain absolutely positioned cards */
  padding-top: 0;
}

.vector-skin .suggestions-sidebar--arrow-mode {
  padding-top: 0;
}

.vector-suggestions-controls {
  position: sticky;
  top: 42px;
  left: 0;
  z-index: 20;
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition: opacity 160ms ease;
}

.vector-suggestions-controls--hidden {
  opacity: 0;
  pointer-events: none;
}

.vector-pagination-controls {
  position: fixed;
  right: 32px;
  bottom: 32px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 0 12px;
  min-height: 32px;
  background: var(--background-color-backdrop-light, rgba(255, 255, 255, 0.65));
  z-index: 20;
}

.vector-pagination-count {
  font-size: 14px;
  line-height: 20px;
  color: var(--color-subtle, #54595d);
}

.vector-pagination-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.vector-pagination-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-base, #202122);
  padding: 0;
}

.vector-pagination-btn:disabled {
  color: var(--color-disabled, #a2a9b1);
  cursor: not-allowed;
}

.vector-pagination-btn:disabled :deep(.cdx-icon),
.vector-pagination-btn:disabled :deep(svg) {
  color: var(--color-disabled, #a2a9b1);
  fill: var(--color-disabled, #a2a9b1);
}

.vector-pagination-btn :deep(svg) {
  fill: currentColor;
}

.vector-pagination-btn--filter {
  margin-left: 4px;
}

.vector-pagination-icon--prev {
  transform: rotate(180deg);
}

.vector-suggestions-arrow-controls {
  width: fit-content;
  position: relative;
  z-index: 20;
}

.suggestions-banner-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 32px;
  pointer-events: none;
}

.suggestions-banner-container--contextual-up {
  justify-content: flex-start;
  padding-top: 40px;
  padding-bottom: 0;
}

.suggestions-banner-container .suggestions-banner {
  pointer-events: auto;
}


/* Positioned suggestion cards within sidebar */
.suggestion-card-positioned {
  position: absolute;
  left: 0;
  width: 100%;
  transition: top 250ms ease; /* Smooth transition for alignment */
}

/* Article content wrapper in edit mode */
.article-content-edit {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.minerva-skin .article-content-edit--section-only {
  padding-top: 48px;
}

.article-main-edit {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 949px;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-main-edit {
  gap: 0;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) {
  background-color: var(--background-color-neutral-subtle, #f8f9fa);
}

.article-first-section {
  display: flex;
  gap: 16px;
  width: 100%;
}

.article-text-block {
  flex: 1;
  min-width: 0;
}

.article-text-editable {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #202122;
  outline: none;
}

.minerva-skin .article-text-editable {
  font-size: 16px;
  line-height: 24px;
}

.article-text-editable p {
  margin: 0;
}

.article-text-editable a {
  color: #36c;
  text-decoration: none;
}

.article-text-editable a:hover {
  text-decoration: underline;
}

.section-heading-edit {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 20px;
  width: 100%;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-first-section .article-text-block {
  background-color: var(--background-color-base, #ffffff);
  border: 1px solid var(--border-color-muted, #DADDE3);
  padding: 16px;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-first-section .article-text-block .article-text-editable {
  background: transparent;
  border: 0;
  padding: 0;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .minerva-edit-section {
  background-color: var(--background-color-neutral-subtle, #f8f9fa);
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .minerva-edit-section .section-heading-edit {
  padding: 24px 16px 0;
  background-color: var(--background-color-base, #ffffff);
  border: 1px solid var(--border-color-muted, #DADDE3);
  border-bottom: 0;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .minerva-edit-section .article-text-editable {
  padding: 16px;
  background-color: var(--background-color-base, #ffffff);
  border: 1px solid var(--border-color-muted, #DADDE3);
  border-top: 0;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .infobox {
  background-color: var(--background-color-base, #ffffff);
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .article-first-section .article-text-block,
.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .edit-header,
.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .minerva-edit-section .section-heading-edit,
.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .minerva-edit-section .article-text-editable {
  background: transparent;
  border: 0;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .edit-header {
  background-color: var(--background-color-base, #ffffff);
  border: 1px solid var(--border-color-subtle, #C8CCD1);
  border-bottom: 0;
  padding: 8px 16px 16px;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .article-main-edit {
  background-color: var(--background-color-base, #ffffff);
  border: 1px solid var(--border-color-subtle, #C8CCD1);
  border-top: 0;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .article-first-section .article-text-block {
  padding: 16px;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .minerva-edit-section {
  background: transparent;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .minerva-edit-section .section-heading-edit {
  padding: 24px 16px 0;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .article-content-edit:not(.article-content-edit--section-only) .minerva-edit-section .article-text-editable {
  padding: 16px;
}

.heading-text-edit {
  font-family: 'Source Serif Pro', serif;
  font-size: 22px;
  font-weight: 400;
  line-height: 32px;
  color: #202122;
  margin: 0;
}

.minerva-skin .heading-text-edit {
  font-size: 24px;
  line-height: 34px;
}

/* Infobox (shared between Read and Edit modes) */
.infobox-title {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  color: #202122;
  text-align: center;
}

.infobox-image-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.infobox-image img {
  width: 100%;
  height: auto;
  display: block;
}

.infobox-caption {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
  text-align: center;
  padding: 4px;
}

.infobox-row {
  display: flex;
  gap: 8px;
  font-size: 12px;
  line-height: 20px;
}

.infobox-row-faded {
  opacity: 0.8;
}

.infobox-label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: #202122;
  width: 64px;
  flex-shrink: 0;
}

.infobox-value {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  color: #202122;
  flex: 1;
}

.infobox-value a {
  color: #36c;
  text-decoration: none;
}

.infobox-value a:hover {
  text-decoration: underline;
}

@media (max-width: 1119px) {
  .article-first-section {
    flex-direction: column;
  }
  
  .article-first-section .infobox {
    width: 100%;
  }
}

/* ===== SUGGESTION MODE STYLES ===== */
/* Toggle Button for Suggestions - using Codex ToggleButton quiet */
.suggestions-toggle-btn {
  width: 40px;
  height: 42px;
  min-width: 40px;
  min-height: 42px;
  padding: 5px;
}

/* Override Codex default padding for icon-only button */
.suggestions-toggle-btn :deep(button) {
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* Lightbulb icon wrapper */
.lightbulb-icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

/* Rays container */
.bulb-rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* Individual ray styling - 5 rays in semicircle */
.ray {
  position: absolute;
  width: 2px;
  height: 3px;
  background-color: var(--suggestion-color, var(--color-progressive, #36c));
  border-radius: 0.5px;
  opacity: 0;
  animation: rayFadeIn 0.3s ease-out forwards;
  top: 50%;
  left: 50%;
  transform-origin: center center;
}

/* Ray 1: Far left (~-60deg from top) - 3px gap from bulb (adjusted for angle) */
.ray-1 {
  transform: translate(-50%, -50%) rotate(-60deg) translateY(-13px);
  animation-delay: 0s;
}

/* Ray 2: Mid-left (~-30deg from top) - 3px gap from bulb (adjusted for angle) */
.ray-2 {
  transform: translate(-50%, -50%) rotate(-30deg) translateY(-12.5px);
  animation-delay: 0.05s;
}

/* Ray 3: Top center (0deg) - 3px gap from bulb */
.ray-3 {
  transform: translate(-50%, -50%) rotate(0deg) translateY(-12px);
  animation-delay: 0.1s;
}

/* Ray 4: Mid-right (~30deg from top) - 3px gap from bulb (adjusted for angle) */
.ray-4 {
  transform: translate(-50%, -50%) rotate(30deg) translateY(-12.5px);
  animation-delay: 0.15s;
}

/* Ray 5: Far right (~60deg from top) - 3px gap from bulb (adjusted for angle) */
.ray-5 {
  transform: translate(-50%, -50%) rotate(60deg) translateY(-13px);
  animation-delay: 0.2s;
}

/* Ray fade-in animation */
@keyframes rayFadeIn {
  0% {
    opacity: 0;
    height: 2px;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 1;
    height: 3px;
  }
}

/* Icon color when active */
.suggestions-toggle-btn--active :deep(.cdx-icon) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
  animation: iconGlow 0.4s ease-out;
}

.suggestions-toggle-btn--active :deep(button) {
  background: #F7E5FF !important;
  background-color: #F7E5FF !important;
}

.suggestions-toggle-btn--active :deep(button[aria-pressed="true"]) {
  background: #F7E5FF !important;
  background-color: #F7E5FF !important;
}

.suggestions-toggle-btn--active :deep(svg) {
  fill: var(--suggestion-color, var(--color-progressive, #36c));
}

/* Icon glow animation */
@keyframes iconGlow {
  0% {
    filter: brightness(1);
    transform: scale(1);
  }
  40% {
    filter: brightness(1.2);
    transform: scale(1.08);
  }
  100% {
    filter: brightness(1.1);
    transform: scale(1);
  }
}

/* Suggestion Container - wraps highlighted text and card */
.suggestion-container {
  position: relative;
  width: 100%;
}

/* ===== HIGHLIGHTED TEXT STATES ===== */
.suggestion-target {
  position: relative;
  margin: 0;
  cursor: pointer;
}

.suggestion-target--inline {
  display: inline;
  cursor: pointer;
}

.suggestion-target--inline.highlighted-text-wrapper {
  display: inline-flex;
  vertical-align: baseline;
}

.suggestion-target--inline .highlighted-text-content {
  display: inline;
  width: auto;
  flex: 0 0 auto;
}

.minerva-skin .suggestion-target--inline .highlighted-text-content,
.minerva-skin .suggestion-target--inline .highlighted-text-annotation,
.minerva-skin .suggestion-target--inline .highlighted-text-content a {
  font-size: 16px;
  line-height: 24px;
}

/* Wrapper with rail (vertical line) - p element with flex */
.highlighted-text-wrapper {
  display: flex;
  gap: 8px; /* 8px space between rail and text */
  align-items: flex-start;
  margin: 0;
}

/* Dynamic highlights inserted via JS (Edit Checks) */
:deep(.highlighted-text-wrapper) {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: 0;
}

/* Rail - vertical blue line that covers full height */
.highlighted-text-rail {
  display: inline-block;
  width: 2px;
  background-color: var(--suggestion-color, #36c);
  flex-shrink: 0;
  align-self: stretch; /* Stretches to match content height */
}

:deep(.highlighted-text-rail) {
  display: inline-block;
  width: 2px;
  background-color: var(--suggestion-color, #36c);
  flex-shrink: 0;
  align-self: stretch;
}

/* Text content with per-line backgrounds */
.highlighted-text-content {
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #202122;
  position: relative;
  z-index: 2;
}

.minerva-skin .highlighted-text-content,
.minerva-skin .highlighted-text-content a {
  font-size: 16px;
  line-height: 24px;
}

.highlighted-text-annotation {
  display: inline;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

/* Default state - subtle gray per line */
.highlighted-text-wrapper .highlighted-text-annotation {
  background-color: rgba(234, 236, 240, 0.65);
  border-radius: 2px;
  padding: 0 2px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.highlighted-text-wrapper--success {
  cursor: default;
}

.highlighted-text-wrapper--success .highlighted-text-annotation {
  background-color: var(--background-color-success-subtle, #dff2eb) !important;
  text-decoration: none;
}

.minerva-skin .highlighted-text-wrapper--success .highlighted-text-annotation {
  background-color: var(--background-color-success-subtle, #dff2eb) !important;
  text-decoration: none;
}

.feedback-underlined-unselected .highlighted-text-annotation {
  text-decoration: underline;
  text-decoration-color: var(--border-color-subtle, #C8CCD1);
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
}

.minerva-skin .feedback-underlined-unselected .highlighted-text-annotation {
  background-color: transparent !important;
}

.minerva-skin .feedback-underlined-unselected.highlighted-text-wrapper--selected .highlighted-text-annotation,
.minerva-skin .feedback-underlined-unselected.highlighted-text-wrapper--hover .highlighted-text-annotation {
  background-color: var(--suggestion-color-subtle, var(--background-color-progressive-subtle, #e8eeff)) !important;
}

.feedback-underlined-unselected.highlighted-text-wrapper--selected .highlighted-text-annotation,
.feedback-underlined-unselected.highlighted-text-wrapper--hover .highlighted-text-annotation {
  text-decoration: none;
}

:deep(.feedback-highlight--warning.feedback-underlined-unselected.edit-check-highlight--collapsed .highlighted-text-annotation) {
  background-color: transparent !important;
  text-decoration: underline;
  text-decoration-color: var(--border-color-subtle, #C8CCD1);
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
}

:deep(.feedback-highlight--warning.feedback-underlined-unselected.edit-check-highlight--collapsed.highlighted-text-wrapper--hover .highlighted-text-annotation) {
  text-decoration: none;
}

.minerva-skin :deep(.feedback-highlight--warning.feedback-underlined-unselected.edit-check-highlight--collapsed .highlighted-text-annotation) {
  background-color: transparent !important;
}

/* Hover state - blue background per line */
.highlighted-text-wrapper--hover .highlighted-text-annotation {
  background-color: var(--suggestion-color-subtle, #e8eeff);
}

/* Selected state - blue background per line */
.highlighted-text-wrapper--selected .highlighted-text-annotation {
  background-color: var(--suggestion-color-subtle, #e8eeff);
}

.minerva-skin .highlighted-text-wrapper .highlighted-text-annotation {
  background-color: rgba(234, 236, 240, 0.65);
  border-radius: 0;
  padding: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

.minerva-skin .highlighted-text-wrapper--hover .highlighted-text-annotation,
.minerva-skin .highlighted-text-wrapper--selected .highlighted-text-annotation {
  background-color: var(--suggestion-color-subtle, var(--background-color-progressive-subtle, #e8eeff));
}

/* Links inside highlighted text */
.highlighted-text-content a {
  color: var(--color-progressive, #36c);
  text-decoration: none;
}

.highlighted-text-content a:hover {
  text-decoration: underline;
}

.minerva-suggestion-target {
  padding-right: 0;
  position: relative;
  z-index: 3;
}

.minerva-skin :deep(.minerva-suggestion-target) {
  padding-right: 0;
  position: relative;
  z-index: 3;
}

.minerva-skin :deep(.edit-check-minerva-target) {
  padding-right: 0;
  position: relative;
  z-index: 3;
}

.minerva-suggestions-on--rail .minerva-suggestion-target {
  z-index: 20;
}

.minerva-suggestions-on--rail :deep(.minerva-suggestion-target) {
  z-index: 20;
}

.minerva-suggestions-on--rail :deep(.edit-check-minerva-target) {
  z-index: 20;
}

.minerva-suggestion-target .highlighted-text-rail {
  display: none;
}

.minerva-skin :deep(.feedback-highlight--warning .highlighted-text-rail) {
  display: none;
}

.minerva-highlight-rail {
  position: absolute;
  right: calc(var(--minerva-suggestion-gutter, 44px) - 61px);
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--suggestion-color, #36c);
  border-radius: 2px;
  z-index: 4;
}

:deep(.minerva-suggestion-target .highlighted-text-rail) {
  display: none;
}

:deep(.minerva-highlight-rail) {
  position: absolute;
  right: calc(var(--minerva-suggestion-gutter, 44px) - 61px);
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--suggestion-color, #36c);
  border-radius: 2px;
  z-index: 4;
}

:deep(.feedback-highlight--warning .minerva-highlight-rail) {
  background-color: var(--color-icon-warning, #AB7F2A);
}

.minerva-skin :deep(.edit-check-minerva-target .minerva-highlight-rail) {
  background-color: var(--color-icon-warning, #AB7F2A);
}

.minerva-highlight-rail--success,
:deep(.minerva-highlight-rail--success) {
  background-color: var(--color-success, #14866d);
  z-index: 22;
}

.minerva-suggestions-on--rail .minerva-highlight-rail {
  z-index: 21;
}

.minerva-suggestions-on--rail :deep(.minerva-highlight-rail) {
  z-index: 21;
}

.minerva-suggestion-trigger {
  position: absolute;
  right: calc(-1 * (var(--minerva-suggestion-gutter, 44px) + 16px) + 12px);
  top: 0;
  transform: none;
  width: 20px;
  height: 20px;
  border-radius: 0;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--suggestion-color, var(--color-progressive, #36c));
  cursor: pointer;
  box-shadow: none;
  z-index: 5;
}

.minerva-suggestion-trigger-badge {
  position: absolute;
  right: -4px;
  bottom: -6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 14px;
  height: 14px;
  padding: 0 3px;
  border-radius: 2px;
  background: var(--suggestion-color, var(--background-color-progressive, #36c));
  border: 1px solid var(--border-color-inverted, #ffffff);
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.minerva-skin :deep(.minerva-suggestion-trigger) {
  position: absolute;
  right: calc(-1 * (var(--minerva-suggestion-gutter, 44px) + 16px) + 12px);
  top: 0;
  transform: none;
  width: 20px;
  height: 20px;
  border-radius: 0;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: none;
  z-index: 5;
}

.minerva-suggestion-trigger :deep(.cdx-icon),
.minerva-suggestion-trigger :deep(svg) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
  fill: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-skin :deep(.minerva-suggestion-trigger svg) {
  color: currentColor;
  fill: currentColor;
}

.minerva-skin :deep(.feedback-trigger--warning) {
  color: var(--color-icon-warning, #AB7F2A);
}

.minerva-suggestion-trigger:active {
  background-color: transparent;
}

.minerva-suggestion-trigger--success {
  color: var(--color-success, #14866d);
  cursor: default;
  z-index: 22;
}

.minerva-suggestion-trigger--success :deep(.cdx-icon),
.minerva-suggestion-trigger--success :deep(svg) {
  color: var(--color-success, #14866d);
  fill: var(--color-success, #14866d);
}

.minerva-suggestions-on .article-content-edit {
  --minerva-suggestion-gutter: 44px;
  padding-right: calc(var(--minerva-suggestion-gutter) + 16px);
  position: relative;
  background: var(--background-color-base, #ffffff);
}

.minerva-suggestions-on--rail .article-content-edit {
  --minerva-suggestion-gutter: 44px;
  padding-right: calc(var(--minerva-suggestion-gutter) + 16px);
  position: relative;
  background: var(--background-color-base, #ffffff);
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved.minerva-suggestions-on .article-content-edit,
.minerva-skin.edit-mode.minerva-edit-full-page-improved.minerva-suggestions-on--rail .article-content-edit {
  padding-right: var(--minerva-suggestion-gutter);
}

.minerva-expandable-rail-open .article-content-edit {
  padding-right: calc(var(--minerva-suggestion-gutter, 44px) + 16px);
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved.minerva-expandable-rail-open .article-content-edit {
  padding-right: var(--minerva-suggestion-gutter, 44px);
}

.minerva-suggestions-on .minerva-suggestion-target,
.minerva-suggestions-on--rail .minerva-suggestion-target {
  padding-right: 0;
}

.minerva-suggestions-on,
.minerva-suggestions-on--rail {
  background-color: var(--background-color-base, #ffffff);
}

.minerva-suggestions-on .article-content-edit::after,
.minerva-suggestions-on--rail .article-content-edit::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: var(--minerva-suggestion-gutter);
  height: 100%;
  background-color: var(--background-color-neutral-subtle, #f8f9fa);
  border-left: 1px solid var(--border-color-muted, #DADDE3);
  pointer-events: none;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved.minerva-suggestions-on .article-content-edit::after,
.minerva-skin.edit-mode.minerva-edit-full-page-improved.minerva-suggestions-on--rail .article-content-edit::after,
.minerva-skin.edit-mode.minerva-edit-full-page-improved .minerva-suggestions-rail {
  border-left: 0;
}



.minerva-suggestions-toggle {
  position: fixed;
  right: 16px;
  bottom: 16px;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 999px;
  border: 1px solid var(--border-color-base, #a2a9b1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 70;
  background: var(--color-base, #ffffff);
}

.minerva-suggestions-rail-toggle {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 0;
  border: 0;
  z-index: 70;
  background: var(--background-color-neutral-subtle, #f8f9fa);
  margin-top: 2px;
}

.minerva-suggestions-rail-toc-button {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 0;
  border-top: 0;
  margin-top: 0;
}

.minerva-suggestions-rail-toc-button :deep(.cdx-button__button) {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.minerva-suggestions-rail-toc-button :deep(.cdx-icon),
.minerva-suggestions-rail-toc-button :deep(svg) {
  color: var(--color-base, #202122);
  fill: var(--color-base, #202122);
}

.minerva-suggestions-rail {
  position: fixed;
  top: 42px;
  right: 0;
  width: 44px;
  height: calc(100% - 42px);
  background: transparent;
  border-left: 1px solid var(--border-color-muted, #DADDE3);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding-top: 1px;
  z-index: 79;
  pointer-events: none;
  transition: width 180ms ease;
  overflow: hidden;
}

.minerva-expandable-rail-mode .minerva-suggestions-rail {
  width: 44px;
}

.minerva-expandable-rail-mode .minerva-suggestions-rail-controls,
.minerva-expandable-rail-mode .minerva-suggestions-rail-toggle,
.minerva-expandable-rail-mode .minerva-suggestions-rail-toggle :deep(button),
.minerva-expandable-rail-mode .minerva-suggestions-rail-toggle :deep(.cdx-button__button),
.minerva-expandable-rail-mode .minerva-suggestions-rail-toc-button,
.minerva-expandable-rail-mode .minerva-suggestions-rail-toc-button :deep(.cdx-button__button) {
  width: 44px;
  min-width: 44px;
}

.minerva-expandable-rail-mode .article-content-edit {
  --minerva-suggestion-gutter: 44px;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .minerva-suggestions-rail {
  background: var(--background-color-neutral-subtle, #f8f9fa);
}

.minerva-suggestions-rail-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 44px;
  background: var(--background-color-neutral-subtle, #f8f9fa);
  position: relative;
  z-index: 81;
  pointer-events: auto;
}

.minerva-expandable-rail-open .minerva-suggestions-rail {
  width: 44px;
  right: 318px;
  background: var(--background-color-neutral-subtle, #f8f9fa);
}

.minerva-expandable-rail-open .minerva-suggestions-rail-controls {
  border-left: 1px solid var(--border-color-muted, #DADDE3);
}

.minerva-suggestions-rail-controls--bottom {
  margin-top: auto;
}

.minerva-suggestions-rail-arrows {
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid var(--border-color-muted, #DADDE3);
}

.suggestions-filter-btn {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
}

.suggestions-filter-btn :deep(button),
.suggestions-filter-btn :deep(.cdx-button__button) {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
}

.suggestions-filter-btn :deep(.cdx-icon),
.suggestions-filter-btn :deep(svg) {
  color: var(--color-subtle, #54595d);
  fill: var(--color-subtle, #54595d);
}

.minerva-suggestions-filter-btn {
  background: transparent;
}

.minerva-suggestions-filter-btn :deep(button),
.minerva-suggestions-filter-btn :deep(.cdx-button__button) {
  border-top: 1px solid var(--border-color-muted, #DADDE3);
}


.minerva-suggestions-rail-arrows .suggestions-banner-arrow-btn {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  background: var(--background-color-neutral-subtle, #f8f9fa);
}

.minerva-suggestions-rail-arrows .suggestions-banner-arrow-btn :deep(button),
.minerva-suggestions-rail-arrows .suggestions-banner-arrow-btn :deep(.cdx-button__button) {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  background: transparent;
  border: 0;
  border-top: 1px solid var(--border-color-muted, #DADDE3);
  box-shadow: none;
}

.minerva-suggestions-rail-arrows .suggestions-banner-arrow-btn :deep(.cdx-icon),
.minerva-suggestions-rail-arrows .suggestions-banner-arrow-btn :deep(svg) {
  color: var(--color-subtle, #54595d);
  fill: var(--color-subtle, #54595d);
}

.minerva-suggestions-rail-toggle :deep(button) {
  width: 100%;
  height: 100%;
  padding: 0;
  position: relative;
  background: transparent;
}

.minerva-suggestions-rail-controls--bottom .minerva-suggestions-rail-toggle,
.minerva-suggestions-rail-controls--bottom .minerva-suggestions-rail-toggle :deep(button),
.minerva-suggestions-rail-controls--bottom .minerva-suggestions-rail-toggle :deep(.cdx-button__button) {
  border-top: 1px solid var(--border-color-muted, #DADDE3);
}

.minerva-suggestions-rail-toggle :deep(.cdx-icon) {
  color: var(--color-base, #202122);
}

.minerva-suggestions-rail-toggle--active {
  background: var(--suggestion-color-subtle, #E8EEFF) !important;
  background-color: var(--suggestion-color-subtle, #E8EEFF) !important;
  border: 0;
}

.minerva-suggestions-rail-toggle--active :deep(button) {
  background: var(--suggestion-color-subtle, #E8EEFF) !important;
  background-color: var(--suggestion-color-subtle, #E8EEFF) !important;
}

.minerva-suggestions-rail-toggle--active :deep(button[aria-pressed="true"]) {
  background: var(--suggestion-color-subtle, #E8EEFF) !important;
  background-color: var(--suggestion-color-subtle, #E8EEFF) !important;
}

.minerva-suggestions-rail-toggle--active :deep(.cdx-icon) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-toast {
  position: fixed;
  top: calc(42px + 12px);
  left: 50%;
  right: auto;
  transform: translateX(-50%);
  width: max-content;
  max-width: calc(100vw - 32px);
  background: #202122;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 2px;
  font-size: 14px;
  line-height: 20px;
  white-space: normal;
  box-sizing: border-box;
  z-index: 220;
  box-shadow: none;
}

.minerva-toast--success {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.minerva-toast--success :deep(.cdx-icon),
.minerva-toast--success :deep(svg) {
  color: var(--color-success, #14866d);
  fill: var(--color-success, #14866d);
  flex: 0 0 auto;
}

.minerva-toast--success span {
  min-width: 0;
}

.minerva-toast--more {
  top: calc(42px + 16px);
}

.minerva-toast--zero {
  top: calc(42px + 16px);
}

.vector-success-toast {
  position: fixed;
  top: 16px;
  left: 32px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid var(--border-color-subtle, #c8ccd1);
  border-radius: 2px;
  background: var(--background-color-base, #fff);
  color: var(--color-base, #202122);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  font-size: 14px;
  line-height: 20px;
  z-index: 220;
}

.vector-success-toast span {
  min-width: 0;
}

.vector-success-toast :deep(.cdx-icon),
.vector-success-toast :deep(svg) {
  color: var(--color-success, #14866d);
  fill: var(--color-success, #14866d);
  flex: 0 0 auto;
}


.minerva-suggestions-toggle :deep(.cdx-icon) {
  color: var(--color-base, #202122);
}

.minerva-suggestions-toggle--active {
  background: #F7E5FF !important;
  border-color: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-suggestions-toggle--active :deep(.cdx-icon) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-suggestions-toggle :deep(button) {
  width: 100%;
  height: 100%;
  padding: 0;
  position: relative;
}

.minerva-bottom-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #c8ccd1;
  box-shadow: var(--box-shadow-medium, 0 4px 4px 0 rgba(0, 0, 0, 0.06), 0 0 8px 0 rgba(0, 0, 0, 0.06));
  z-index: 80;
  padding: 0 16px 0;
  transform: translateY(0);
  transition: transform 220ms ease;
}

.minerva-bottom-sheet--suggestion {
  right: 0;
}

.minerva-bottom-sheet--rail-offset {
  right: 44px;
}

.minerva-info-sheet {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #c8ccd1;
  box-shadow: var(--box-shadow-medium, 0 4px 4px 0 rgba(0, 0, 0, 0.06), 0 0 8px 0 rgba(0, 0, 0, 0.06));
  z-index: 90;
  padding: 16px;
}

.minerva-info-sheet-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.minerva-info-sheet .suggestions-info-header :deep(.cdx-icon) {
  width: var(--icon-size-medium, 20px);
  height: var(--icon-size-medium, 20px);
}

.minerva-info-sheet .suggestions-info-title {
  font-size: 16px;
  color: var(--color-base, #202122);
}

.minerva-info-sheet .suggestions-info-list {
  font-size: 16px;
  line-height: 24px;
  color: var(--color-base, #202122);
}

.minerva-info-sheet .suggestions-info-footer {
  font-size: 16px;
  color: var(--color-base, #202122);
}

.minerva-info-sheet-backdrop {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 89;
}

.minerva-sheet-header {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
}

.minerva-sheet-content {
  display: block;
}

.minerva-sheet-header :deep(.cdx-icon) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-sheet-header--success :deep(.cdx-icon),
.minerva-sheet-header--success :deep(svg) {
  color: var(--color-success, #14866d);
  fill: var(--color-success, #14866d);
}

.minerva-sheet-backdrop {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 0;
}

.minerva-sheet-backdrop--suggestion {
  right: 44px;
}

.minerva-sheet-backdrop--overview {
  right: 44px;
}


.suggestion-dismiss-right {
  animation: suggestion-dismiss-right 260ms ease forwards;
}

@keyframes suggestion-dismiss-right {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(40px);
  }
}

.minerva-sheet-title {
  font-size: 16px;
  font-weight: 600;
  color: #202122;
}

.minerva-sheet-title--success {
  color: var(--color-base, #202122);
}

.minerva-sheet-header-indicator {
  margin-left: auto;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-subtle, #54595d);
}

.minerva-sheet-header-actions {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.minerva-sheet-header-indicator + .minerva-sheet-header-actions {
  margin-left: 8px;
}

.minerva-sheet-icon-button {
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  color: var(--color-base, #202122);
}

.minerva-sheet-icon-button :deep(.cdx-icon),
.minerva-sheet-icon-button :deep(svg) {
  color: var(--color-base, #202122);
  fill: var(--color-base, #202122);
  transform: none;
}

.minerva-sheet-description {
  margin-top: 0;
  font-size: 16px;
  line-height: 24px;
  color: #54595d;
}

.minerva-sheet-description--success {
  color: var(--color-subtle, #54595d);
  margin-bottom: 16px;
}

.minerva-sheet-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.minerva-overview-sheet {
  right: 44px;
  padding: 0;
}

.minerva-overview-list {
  display: flex;
  flex-direction: column;
}

.minerva-overview-empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 88px;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-placeholder, #72777d);
}

.minerva-overview-sheet-header {
  border-bottom: 1px solid var(--border-color-subtle, #c8ccd1);
  padding: 0 16px;
}

.minerva-overview-item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  border-bottom: 1px solid var(--border-color-muted, #dadde3);
  cursor: pointer;
  padding: 0 16px;
}

.minerva-overview-item-icon {
  color: var(--suggestion-color, var(--color-progressive, #36c));
  fill: var(--suggestion-color, var(--color-progressive, #36c));
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
}

.minerva-overview-item-label {
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: var(--color-base, #202122);
}

.minerva-suggestions-rail-toggle--overview {
  background: var(--background-color-neutral-subtle, #f8f9fa);
  background-color: var(--background-color-neutral-subtle, #f8f9fa);
}

.minerva-suggestions-rail-toggle--overview :deep(button),
.minerva-suggestions-rail-toggle--overview :deep(.cdx-button__button) {
  background: var(--background-color-neutral-subtle, #f8f9fa);
  background-color: var(--background-color-neutral-subtle, #f8f9fa);
}

.minerva-suggestions-rail-toggle--overview :deep(.cdx-icon),
.minerva-suggestions-rail-toggle--overview :deep(svg) {
  color: var(--color-progressive, #36c);
  fill: var(--color-progressive, #36c);
}

.minerva-suggestions-rail-toggle:disabled :deep(.cdx-icon),
.minerva-suggestions-rail-toggle:disabled :deep(svg),
.minerva-suggestions-rail-toggle--overview:disabled :deep(.cdx-icon),
.minerva-suggestions-rail-toggle--overview:disabled :deep(svg) {
  color: var(--color-disabled, #a2a9b1);
  fill: var(--color-disabled, #a2a9b1);
}

.minerva-suggestions-rail-toggle:disabled .suggestions-badge,
.minerva-suggestions-rail-toggle--overview:disabled .suggestions-badge {
  color: var(--color-disabled, #a2a9b1);
  border-color: var(--color-disabled, #a2a9b1);
}

.minerva-suggestions-rail-toggle--overview.minerva-suggestions-rail-toggle--active,
.minerva-suggestions-rail-toggle--overview.minerva-suggestions-rail-toggle--active :deep(button),
.minerva-suggestions-rail-toggle--overview.minerva-suggestions-rail-toggle--active :deep(.cdx-button__button) {
  background: var(--background-color-progressive-subtle, #e8eeff) !important;
  background-color: var(--background-color-progressive-subtle, #e8eeff) !important;
}

.minerva-sheet-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0;
  min-height: 38px;
  height: 38px;
  margin-left: -16px;
  margin-right: -16px;
  padding-left: 16px;
  padding-right: 16px;
  border-top: 1px solid var(--border-color-muted, #DADDE3);
}

.minerva-pagination-count {
  text-align: left;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-subtle, #54595d);
}

.minerva-pagination-count--loading {
  color: var(--color-disabled, #a2a9b1);
}

.minerva-pagination-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.minerva-pagination-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.minerva-pagination-btn :deep(.cdx-button__button) {
  min-width: 32px;
  min-height: 32px;
  color: var(--color-base, #202122);
}

.minerva-pagination-btn:disabled {
  color: var(--color-disabled, #a2a9b1);
  cursor: not-allowed;
}

.minerva-pagination-btn:disabled :deep(.cdx-button__button) {
  color: var(--color-disabled, #a2a9b1);
}

.minerva-pagination-btn:disabled :deep(.cdx-icon),
.minerva-pagination-btn:disabled :deep(svg) {
  color: var(--color-disabled, #a2a9b1);
  fill: var(--color-disabled, #a2a9b1);
}

.minerva-pagination-btn :deep(svg) {
  fill: currentColor;
}

.minerva-bottom-sheet--success-exit {
  transform: translateY(100%);
}

.minerva-pagination-icon--prev {
  transform: rotate(180deg);
}

.minerva-sheet-more-actions :deep(.cdx-icon),
.minerva-sheet-more-actions :deep(svg) {
  color: var(--color-base, #202122);
  fill: var(--color-base, #202122);
}

.minerva-sheet-btn {
  min-width: 88px;
}

.minerva-sheet-more-actions {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 32px;
  min-width: 32px;
  max-width: 32px;
  height: 32px;
  min-height: 32px;
  flex: 0 0 32px;
}

.minerva-sheet-more-actions :deep(button),
.minerva-sheet-more-actions :deep(.cdx-button__button) {
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
}

.minerva-skin.edit-mode .edit-mode-content {
  padding-bottom: 88px;
}

/* ===== SUGGESTION CARD STATES ===== */
.suggestion-card {
  width: 100%; /* Full width of container (325px) */
  --feedback-border-default: #dadde3;
  --feedback-border-hover: var(--suggestion-border-hover, #3056a9);
  --feedback-border-active: var(--suggestion-border-active, #233566);
  --feedback-border-selected: var(--suggestion-border-selected, #6485d1);
  --feedback-highlight-selected: var(--suggestion-color-subtle, var(--background-color-progressive-subtle, #e8eeff));
  --feedback-highlight-unselected: rgba(234, 236, 240, 0.65);
  --feedback-header-collapsed-default: var(--background-color-base, #ffffff);
  --feedback-header-collapsed-hover: var(--suggestion-color-subtle, var(--background-color-progressive-subtle, #e8eeff));
  --feedback-header-expanded: var(--suggestion-color-subtle, var(--background-color-progressive-subtle, #e8eeff));
  --feedback-icon-color: var(--suggestion-color, var(--color-progressive, #36c));
  background-color: white;
  border-radius: 2px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Collapsed state - default */
.suggestion-card--collapsed {
  border: 1px solid var(--feedback-border-default);
  box-shadow: none;
}

/* Collapsed state - hover */
.suggestion-card--collapsed.suggestion-card--hover {
  border: 1px solid var(--feedback-border-hover);
}

.suggestion-card--collapsed.suggestion-card--hover .suggestion-header {
  background-color: var(--feedback-header-collapsed-hover);
}

/* Collapsed state - active (press) */
.suggestion-card--collapsed:active {
  border: 1px solid var(--feedback-border-active);
}

.suggestion-card--collapsed:active .suggestion-header {
  background-color: var(--feedback-header-collapsed-hover);
}

/* Collapsed state - focus */
.suggestion-card--collapsed:focus-within {
  border: 2px solid var(--suggestion-color, #36c);
  background-color: white;
}

/* Expanded state - default */
.suggestion-card--expanded {
  border: 1px solid var(--feedback-border-selected);
  box-shadow: 
    0px 4px 8px 0px rgba(0, 0, 0, 0.06),
    0px 0px 16px 0px rgba(0, 0, 0, 0.06);
}

/* Expanded state - hover */
.suggestion-card--expanded.suggestion-card--hover .suggestion-header {
  cursor: pointer;
}

.suggestion-card--expanded.suggestion-card--hover {
  border: 1px solid var(--feedback-border-hover);
}

/* Expanded state - active */
.suggestion-card--expanded .suggestion-header:active {
  border: 1px solid var(--feedback-border-active);
}

:deep(.feedback-highlight.highlighted-text-wrapper) {
  display: inline-flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0;
}

:deep(.feedback-highlight--warning .highlighted-text-rail) {
  background: var(--color-icon-warning, #AB7F2A);
}

:deep(.feedback-highlight--warning .highlighted-text-annotation) {
  background-color: var(--background-color-warning-subtle, #FDF2D5);
}

:deep(.feedback-highlight--warning.edit-check-highlight--collapsed .highlighted-text-annotation) {
  background-color: rgba(234, 236, 240, 0.65);
}

:deep(.feedback-highlight--warning.edit-check-highlight--collapsed.highlighted-text-wrapper--hover .highlighted-text-annotation) {
  background-color: var(--background-color-warning-subtle, #FDF2D5);
}

.minerva-skin :deep(.feedback-highlight--warning .highlighted-text-annotation) {
  background-color: var(--background-color-warning-subtle, #FDF2D5);
}

.minerva-skin :deep(.feedback-highlight--warning.edit-check-highlight--collapsed .highlighted-text-annotation) {
  background-color: rgba(234, 236, 240, 0.65);
}

.minerva-skin :deep(.feedback-highlight--warning.edit-check-highlight--collapsed.highlighted-text-wrapper--hover .highlighted-text-annotation) {
  background-color: var(--background-color-warning-subtle, #FDF2D5);
}

.feedback-card--warning {
  --feedback-border-default: var(--border-color-base, #a2a9b1);
  --feedback-border-hover: var(--color-warning-hover, #735421);
  --feedback-border-active: var(--color-warning-active, #453217);
  --feedback-border-selected: var(--color-icon-warning, #AB7F2A);
  --feedback-header-collapsed-default: var(--background-color-base, #ffffff);
  --feedback-header-collapsed-hover: var(--background-color-warning-subtle, #FDF2D5);
  --feedback-header-expanded: var(--background-color-warning-subtle, #FDF2D5);
  --feedback-icon-color: var(--color-icon-warning, #AB7F2A);
}

.feedback-card--warning.suggestion-card--expanded {
  box-shadow:
    0 4px 8px 0 var(--Decision-Tokens-shadow-large, rgba(0, 0, 0, 0.06)),
    0 0 16px 0 var(--Decision-Tokens-shadow-large, rgba(0, 0, 0, 0.06));
}

.feedback-card--warning.suggestion-card--collapsed {
  background-color: var(--background-color-base, #ffffff);
  border-color: var(--border-color-base, #a2a9b1);
}

.feedback-card--warning.suggestion-card--collapsed .suggestion-header {
  background-color: var(--background-color-base, #ffffff);
}

.feedback-card--warning .suggestion-header {
  background: var(--feedback-header-expanded);
}

.feedback-card--warning .suggestion-header--expanded {
  background: var(--feedback-header-expanded);
}

.feedback-card--warning .suggestion-title {
  font-weight: 700;
}

.feedback-card--warning .suggestion-icon :deep(.cdx-icon) {
  color: var(--feedback-icon-color);
}

.minerva-bottom-sheet--edit-check .minerva-sheet-header :deep(.cdx-icon) {
  color: var(--color-icon-warning, #AB7F2A);
}

:deep(.feedback-trigger--warning) {
  color: var(--color-icon-warning, #AB7F2A);
}

/* ===== SUGGESTION HEADER ===== */
.suggestion-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  min-height: 40px;
  border: none;
  width: 100%;
  text-align: left;
  transition: background-color 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.suggestion-header--collapsed {
  cursor: pointer;
  background-color: transparent;
}

.suggestion-header--expanded {
  cursor: pointer;
  background-color: var(--suggestion-color-subtle, #e8eeff);
}

.suggestion-header:focus {
  outline: none;
}

.suggestion-icon {
  width: 18px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suggestion-icon .cdx-icon {
  color: var(--suggestion-color, #36c);
}

.suggestion-title {
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* ===== SUGGESTION CONTENT (expanded only) ===== */
.suggestion-content {
  background-color: white;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.suggestion-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #54595d;
  margin: 0;
  white-space: pre-wrap;
  cursor: default;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.suggestion-description a,
.minerva-sheet-description a {
  color: var(--color-progressive, #36c);
  text-decoration: none;
}

.suggestion-description a:hover,
.suggestion-description a:active,
.minerva-sheet-description a:hover,
.minerva-sheet-description a:active {
  text-decoration: underline;
}

.suggestion-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-description--question {
  margin: 0 0 6px 0;
  font-weight: 600;
  flex-basis: 100%;
}

.paste-check-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggestion-more-actions {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.suggestion-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  min-width: 32px;
  max-width: 448px;
  padding: 4px 12px;
  background-color: #f8f9fa;
  border: 1px solid #72777d;
  border-radius: 2px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #202122;
  text-align: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.suggestion-btn:hover {
  background-color: #ffffff;
  border-color: #202122;
}

.suggestion-btn:active {
  background-color: #eaecf0;
  border-color: #72777d;
}

.suggestion-btn:disabled {
  background-color: #dadde3;
  border-color: transparent;
  color: #a2a9b1;
  cursor: not-allowed;
}

/* Suggestion card maintains fixed 325px width across all breakpoints */

/* ===== CITATION MARKER ===== */
.citation-marker {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 1;
  color: #36c;
  cursor: pointer;
  margin-left: 1px;
}

.citation-marker:hover {
  text-decoration: underline;
}

/* ===== CITATION POPUP ===== */
.citation-popup {
  position: absolute;
  width: 448px;
  max-width: calc(100vw - 32px);
  background: white;
  border: 1px solid #a2a9b1;
  border-radius: 2px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.06), 0px 0px 8px 0px rgba(0, 0, 0, 0.06);
  z-index: 50;
  margin-top: 12px;
}

.minerva-skin .citation-popup {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100%;
  border-radius: 0;
  margin-top: 0;
  z-index: 90;
  display: flex;
  flex-direction: column;
}

.minerva-skin .citation-popup-pointer {
  display: none;
}

.minerva-skin .citation-popup-content {
  flex: 1;
  overflow-y: auto;
}

/* Pointer arrow pointing up */
.citation-popup-pointer {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%) rotate(225deg);
  width: 16px;
  height: 16px;
  background: white;
  border: 1px solid #a2a9b1;
  border-left: none;
  border-top: none;
}

.citation-popup-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 8px;
}

.citation-popup-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 5px;
  background: transparent;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  color: #202122;
  flex-shrink: 0;
}

.citation-popup-close:hover {
  background-color: #f8f9fa;
}

.citation-popup-title {
  flex: 1;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  color: #202122;
  margin: 0;
  text-align: center;
}

.citation-popup-tabs {
  display: flex;
  gap: 4px;
  background-color: #eaecf0;
  padding: 8px 8px 0 8px;
}

.citation-tab {
  padding: 4px 12px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #202122;
  background: transparent;
  border: none;
  border-radius: 2px 2px 0 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.citation-tab:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

.citation-tab--active {
  background-color: white;
  color: #202122;
}

.citation-popup-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: white;
}

.citation-popup-description {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: #202122;
  margin: 0;
}

/* Input group: input + button together */
.citation-input-group {
  display: flex;
  align-items: center;
  gap: 0;
}

.citation-input {
  flex: 1;
  height: 32px;
  padding: 4px 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 20px;
  color: #202122;
  border: 1px solid #72777d;
  border-right: none;
  border-radius: 2px 0 0 2px;
  outline: none;
  transition: border-color 0.2s ease;
}

.citation-input:hover {
  border-color: #202122;
}

.citation-input:focus {
  border-color: #36c;
  box-shadow: inset 0 0 0 1px #36c;
}

.citation-create-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  min-width: 32px;
  padding: 4px 12px;
  background-color: #f8f9fa;
  border: 1px solid #72777d;
  border-radius: 0 2px 2px 0;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  color: #202122;
  text-align: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  flex-shrink: 0;
}

.citation-create-btn:hover {
  background-color: #ffffff;
  border-color: #202122;
}

.citation-create-btn:active {
  background-color: #eaecf0;
  border-color: #72777d;
}

.citation-create-btn:disabled {
  background-color: #dadde3;
  border-color: #dadde3;
  color: #a2a9b1;
  cursor: not-allowed;
}

/* ===== SUCCESS MESSAGE ===== */
.success-message {
  position: absolute;
  width: 100%;
  display: flex;
  align-items: start;
  gap: 8px;
  padding: 10px 12px;
  background-color: #ffffff;
  border: 1px solid #a2a9b1;
  border-radius: 2px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.06), 0px 0px 16px 0px rgba(0, 0, 0, 0.06);
}

.minerva-skin .success-message--minerva {
  position: fixed;
  top: 58px;
  left: 16px;
  right: 16px;
  z-index: 70;
  width: auto;
  margin: 0;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 20px;
  flex-shrink: 0;
}

.success-icon :deep(svg) {
  fill: #099979;
}

.success-content {
  flex: 1;
  min-width: 0;
}

.success-text {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #202122;
}

/* ===== EMPTY STATE ===== */
.empty-state {
  width: 100%;
  display: flex;
  align-items: start;
  gap: 8px;
  padding: 10px 12px;
  background-color: #ffffff;
  border: 1px solid #dadde3;
  border-radius: 2px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.empty-state-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 20px;
  flex-shrink: 0;
}

.empty-state-icon :deep(svg) {
  fill: var(--color-placeholder, #72777d);
}

.empty-state-content {
  flex: 1;
  min-width: 0;
}

.empty-state-text {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--color-placeholder, #72777d);
}

.suggestions-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 8px;
  margin: 0 0 8px;
  height: 44px;
  padding: 0 12px;
  border: 1px solid var(--border-color-muted, #c8ccd1);
  background: var(--suggestion-color-subtle, var(--background-color-progressive-subtle, #eaf3ff));
  border-radius: 2px;
  font-family: 'Inter', sans-serif;
  color: var(--suggestion-color, var(--color-progressive, #36c));
  font-size: 14px;
  box-shadow: var(--box-shadow-medium, 0 4px 4px 0 rgba(0, 0, 0, 0.06), 0 0 8px 0 rgba(0, 0, 0, 0.06));
  position: sticky;
  top: 42px;
  z-index: 11;
  text-align: center;
  transform-origin: bottom;
  will-change: transform, opacity;
}

.suggestions-banner--scrolled {
  box-shadow: 0 4px 4px 0 rgba( 0, 0, 0, 0.06 ), 0 0 8px 0 rgba( 0, 0, 0, 0.06 );
}

.banner-reveal-enter-active,
.banner-reveal-leave-active {
  transition: transform 220ms ease, opacity 220ms ease;
}

.banner-reveal-enter-from,
.banner-reveal-leave-to {
  transform: scaleY(0.1);
  opacity: 0;
}

.banner-reveal-enter-to,
.banner-reveal-leave-from {
  transform: scaleY(1);
  opacity: 1;
}

.suggestions-banner--clickable:not(.suggestions-banner--empty):hover {
  background: var(--suggestion-color-subtle-hover, var(--background-color-progressive-subtle--hover, #dbe8ff));
}

.suggestions-banner--clickable:not(.suggestions-banner--empty):active {
  background: var(--suggestion-color-subtle-active, var(--background-color-progressive-subtle--active, #c5d7ff));
}

.suggestions-banner--closing {
  animation: banner-to-badge 220ms ease forwards;
  transform-origin: right center;
  pointer-events: none;
}

.suggestions-banner--opening {
  animation: badge-to-banner 220ms ease forwards;
  transform-origin: right center;
  pointer-events: none;
}

@keyframes banner-to-badge {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.2);
  }
}

@keyframes badge-to-banner {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.suggestions-banner--empty {
  background: var(--background-color-neutral-subtle, #f8f9fa);
  color: var(--color-subtle, #54595d);
}

.minerva-suggestions-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 70;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
}

.minerva-suggestions-banner {
  position: static;
  flex: 1;
  margin: 0;
}

.minerva-suggestions-banner:not(.suggestions-banner--option-2):not(.suggestions-banner--count-button) {
  width: 100%;
  border-radius: 0;
  border: 0;
  border-top: 1px solid #dadde3;
  font-size: 16px;
  line-height: 24px;
}

.minerva-suggestions-banner.suggestions-banner--option-2,
.minerva-suggestions-banner.suggestions-banner--count-button {
  flex: 0 0 auto;
  width: auto;
  margin: 0 auto;
  padding: 0 16px;
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 24px;
}

.help-button {
  position: fixed;
  z-index: 70;
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  border: 1px solid var(--border-color-base, #a2a9b1);
  background: var(--background-color-interactive-subtle, #f8f9fa);
  box-shadow: var(--box-shadow-medium, 0 4px 4px 0 rgba(0, 0, 0, 0.06), 0 0 8px 0 rgba(0, 0, 0, 0.06));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
}

.help-button:hover {
  background: var(--background-color-interactive-subtle--hover, #eaecf0);
  border-color: var(--border-color-base--hover, #72777d);
}

.help-button:active {
  background: var(--background-color-interactive-subtle--active, #dadde3);
  border-color: var(--border-color-base--active, #54595d);
}

.help-button :deep(.cdx-icon) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.vector-help-button {
  right: 32px;
  bottom: 32px;
}

.minerva-help-button {
  position: static;
}

.suggestions-banner--hidden {
  background: var(--background-color-base, #ffffff);
}

.suggestions-banner-text {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
}

.suggestions-banner-text :deep(.cdx-icon) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.suggestions-banner-text .suggestions-banner-icon--up :deep(svg) {
  transform: rotate(180deg);
}

.suggestions-banner-arrow-buttons {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.suggestions-banner-text .suggestions-banner-arrow-buttons {
  margin-right: 2px;
}

.suggestions-banner-arrow-btn {
  padding: 0;
  min-height: auto;
  min-width: auto;
  background: transparent;
  border: 0;
  box-shadow: none;
}

.suggestions-banner-arrow-btn--display {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.suggestions-banner-arrow-btn :deep(.cdx-icon),
.suggestions-banner-arrow-btn :deep(svg) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.suggestions-banner-arrow-buttons--bounce :deep(.cdx-icon),
.suggestions-banner-arrow-buttons--bounce :deep(svg) {
  animation: arrow-bounce 8s ease-in-out 0s infinite;
}

.suggestions-banner-icon-only--bounce :deep(.cdx-icon),
.suggestions-banner-icon-only--bounce :deep(svg) {
  animation: arrow-bounce 8s ease-in-out 0s infinite;
}

@keyframes arrow-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  12.5% {
    transform: translateY(6px);
  }
  15% {
    transform: translateY(0);
  }
  17.5% {
    transform: translateY(6px);
  }
  20% {
    transform: translateY(0);
  }
}

@keyframes arrow-bounce-4 {
  0%,
  100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(6px);
  }
  30% {
    transform: translateY(0);
  }
  35% {
    transform: translateY(6px);
  }
  40% {
    transform: translateY(0);
  }
}

.minerva-suggestions-bar--arrow-only {
  justify-content: flex-end;
}

.minerva-skin .minerva-suggestions-bar--arrow-only .suggestions-banner-arrow-buttons {
  gap: 0;
  border-top: 1px solid var(--border-color-muted, #DADDE3);
}

.vector-suggestions-arrow-controls .suggestions-banner-arrow-buttons {
  gap: 0;
  border: 1px solid var(--border-color-subtle, #C8CCD1);
  border-radius: 2px;
  overflow: hidden;
  background: var(--background-color-base, #ffffff);
}

.vector-suggestions-arrow-controls .suggestions-banner-arrow-buttons--with-filter {
  display: flex;
  flex-direction: column;
}

.vector-suggestions-arrow-controls .vector-suggestions-filter-btn {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  background: var(--background-color-base, #ffffff);
  border-bottom: 1px solid var(--border-color-muted, #DADDE3);
}

.vector-suggestions-arrow-controls .vector-suggestions-filter-btn :deep(button),
.vector-suggestions-arrow-controls .vector-suggestions-filter-btn :deep(.cdx-button__button) {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
}

.vector-suggestions-arrow-controls .vector-suggestions-filter-btn :deep(.cdx-icon),
.vector-suggestions-arrow-controls .vector-suggestions-filter-btn :deep(svg) {
  color: var(--color-subtle, #54595d);
  fill: var(--color-subtle, #54595d);
}

.vector-suggestions-arrow-controls .suggestions-banner-arrow-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  background: var(--background-color-base, #ffffff);
}

.vector-suggestions-arrow-controls .suggestions-banner-arrow-btn + .suggestions-banner-arrow-btn {
  border-top: 0;
}

.vector-suggestions-arrow-controls .suggestions-banner-arrow-btn :deep(button),
.vector-suggestions-arrow-controls .suggestions-banner-arrow-btn :deep(.cdx-button__button) {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
}

.vector-suggestions-arrow-controls .suggestions-banner-arrow-btn + .suggestions-banner-arrow-btn :deep(button),
.vector-suggestions-arrow-controls .suggestions-banner-arrow-btn + .suggestions-banner-arrow-btn :deep(.cdx-button__button) {
  border-top: 0;
}

.vector-suggestions-arrow-controls .suggestions-banner-arrow-btn :deep(.cdx-icon),
.vector-suggestions-arrow-controls .suggestions-banner-arrow-btn :deep(svg) {
  color: var(--color-subtle, #54595d);
  fill: var(--color-subtle, #54595d);
}

.vector-suggestions-arrow-controls .suggestions-banner-arrow-btn:disabled :deep(.cdx-icon),
.vector-suggestions-arrow-controls .suggestions-banner-arrow-btn:disabled :deep(svg) {
  color: var(--color-disabled, #a2a9b1);
  fill: var(--color-disabled, #a2a9b1);
}

.minerva-skin .minerva-suggestions-bar--arrow-only .suggestions-banner-arrow-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  background: var(--background-color-base, #ffffff);
}

.minerva-skin .minerva-suggestions-bar--arrow-only .suggestions-banner-arrow-btn :deep(button) {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  background: transparent;
  border: 0;
  border-top: 1px solid var(--border-color-muted, #DADDE3);
  box-shadow: none;
}

.minerva-skin .minerva-suggestions-bar--arrow-only .suggestions-banner-arrow-btn :deep(.cdx-button__button) {
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  padding: 0;
  background: transparent;
  border: 0;
  border-top: 1px solid var(--border-color-muted, #DADDE3);
  box-shadow: none;
}

.minerva-skin .minerva-suggestions-bar--arrow-only .suggestions-banner-arrow-btn :deep(.cdx-icon),
.minerva-skin .minerva-suggestions-bar--arrow-only .suggestions-banner-arrow-btn :deep(svg) {
  color: var(--color-subtle, #54595d);
  fill: var(--color-subtle, #54595d);
}

.minerva-skin .minerva-suggestions-bar--arrow-only .suggestions-banner-arrow-btn:disabled :deep(.cdx-icon),
.minerva-skin .minerva-suggestions-bar--arrow-only .suggestions-banner-arrow-btn:disabled :deep(svg),
.minerva-suggestions-rail-arrows .suggestions-banner-arrow-btn:disabled :deep(.cdx-icon),
.minerva-suggestions-rail-arrows .suggestions-banner-arrow-btn:disabled :deep(svg) {
  color: var(--color-disabled, #a2a9b1);
  fill: var(--color-disabled, #a2a9b1);
}

.minerva-skin .minerva-suggestions-bar--arrow-only .suggestions-banner-arrow-buttons--bounce :deep(.cdx-icon),
.minerva-skin .minerva-suggestions-bar--arrow-only .suggestions-banner-arrow-buttons--bounce :deep(svg),
.minerva-skin .minerva-suggestions-bar--arrow-only .suggestions-banner-icon-only--bounce :deep(.cdx-icon),
.minerva-skin .minerva-suggestions-bar--arrow-only .suggestions-banner-icon-only--bounce :deep(svg) {
  animation: none;
}

.suggestions-banner--option-2 {
  border-radius: 9999px;
  background: var(--suggestion-color-subtle, var(--background-color-progressive--subtle, #e8eeff));
  box-shadow: var(--box-shadow-medium, 0 4px 4px 0 rgba(0, 0, 0, 0.06), 0 0 8px 0 rgba(0, 0, 0, 0.06));
  border-color: var(--border-color-muted, #dadde3);
}

.suggestions-banner--option-2 .suggestions-banner-text {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.suggestions-banner--option-2 .suggestions-banner-text :deep(.cdx-icon),
.suggestions-banner--count-button .suggestions-banner-text,
.suggestions-banner--count-button .suggestions-banner-text :deep(.cdx-icon) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.suggestions-banner--single-use,
.suggestions-banner--count-button {
  border-color: var(--suggestion-color, var(--border-color-progressive, #36c));
  border-radius: 9999px;
  padding-left: 12px;
  padding-right: 12px;
}

.suggestions-banner--single-use,
.suggestions-banner--count-button {
  animation: none;
}

.suggestions-banner--single-use .suggestions-banner-center,
.suggestions-banner--count-button .suggestions-banner-center {
  flex: 0 1 auto;
}

.suggestions-banner--single-use .suggestions-banner-text,
.suggestions-banner--count-button .suggestions-banner-text {
  gap: 12px;
}

.suggestions-banner--single-use .suggestions-banner-arrow-btn :deep(button),
.suggestions-banner--single-use .suggestions-banner-arrow-btn :deep(.cdx-button__button),
.suggestions-banner--single-use .suggestions-banner-arrow-btn :deep(.cdx-button),
.suggestions-banner--count-button .suggestions-banner-arrow-btn :deep(button),
.suggestions-banner--count-button .suggestions-banner-arrow-btn :deep(.cdx-button__button),
.suggestions-banner--count-button .suggestions-banner-arrow-btn :deep(.cdx-button),
.suggestions-banner--count-button .suggestions-banner-arrow-btn--display {
  width: 20px;
  min-width: 20px;
  height: 20px;
  min-height: 20px;
  padding: 0 !important;
}

.suggestions-banner--single-use .suggestions-banner-actions,
.suggestions-banner--count-button .suggestions-banner-actions {
  margin-left: 4px;
}

.vector-skin .suggestions-banner--single-use.suggestions-banner--closing,
.vector-skin .suggestions-banner--single-use.suggestions-banner--opening,
.vector-skin .suggestions-banner--count-button.suggestions-banner--closing,
.vector-skin .suggestions-banner--count-button.suggestions-banner--opening {
  transform-origin: center center;
}

.vector-skin .suggestions-banner.suggestions-banner--single-use,
.vector-skin .suggestions-banner.suggestions-banner--count-button {
  width: fit-content;
  max-width: calc(100% - 24px);
  margin-left: auto;
  margin-right: auto;
}

.minerva-skin .suggestions-banner--option-2 .suggestions-banner-text,
.minerva-skin .suggestions-banner--count-button .suggestions-banner-text {
  font-size: 16px;
  line-height: 24px;
}

.banner-text {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.banner-text-bold {
  font-weight: 700;
}

.banner-text-regular {
  font-weight: 400;
}

.minerva-skin .suggestions-banner:not(.suggestions-banner--empty):not(.suggestions-banner--option-2):not(.suggestions-banner--count-button) .suggestions-banner-text,
.vector-skin .suggestions-banner:not(.suggestions-banner--empty):not(.suggestions-banner--option-2):not(.suggestions-banner--count-button) .suggestions-banner-text {
  color: var(--color-base, #202122);
}

.minerva-skin .suggestions-banner:not(.suggestions-banner--empty):not(.suggestions-banner--option-2):not(.suggestions-banner--count-button) .suggestions-banner-text :deep(.cdx-icon),
.vector-skin .suggestions-banner:not(.suggestions-banner--empty):not(.suggestions-banner--option-2):not(.suggestions-banner--count-button) .suggestions-banner-text :deep(.cdx-icon) {
  color: var(--color-base, #202122);
}

.suggestions-banner-center {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.suggestions-banner-actions {
  position: static;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.suggestions-info-btn {
  display: inline-flex;
}

.suggestions-info-btn :deep(button) {
  min-width: 24px;
  height: 24px;
  padding: 0 4px;
}

.suggestions-info-icon {
  color: var(--suggestion-color, var(--color-progressive, #36c));
  width: var(--icon-size-medium, 20px);
  height: var(--icon-size-medium, 20px);
}

.suggestions-info-btn--inline {
  margin-left: 8px;
}

.suggestions-banner-bulb {
  color: var(--suggestion-color, var(--color-progressive, #36c));
  cursor: pointer;
}

.suggestions-info-popover {
  padding: 12px;
  max-width: 260px;
  color: var(--color-base, #202122);
}

.suggestions-info-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggestions-info-header :deep(.cdx-icon) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-info-sheet .suggestions-info-header :deep(.cdx-icon) {
  color: var(--color-base, #202122);
}

.minerva-skin .suggestions-banner .suggestions-info-icon {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.suggestions-info-title {
  font-size: 14px;
  font-weight: 600;
}

.suggestions-info-list {
  margin: 8px 0 12px;
  padding-left: 16px;
  color: var(--color-subtle, #54595d);
  font-size: 14px;
  line-height: 20px;
}

.suggestions-info-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.suggestions-banner-action {
  height: 24px;
}

.suggestions-banner-action :deep(button) {
  height: 24px;
  max-height: 24px;
  min-height: 24px;
  padding: 0 8px;
  line-height: 24px;
}

.suggestions-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border-radius: 2px;
  background: var(--suggestion-color, var(--background-color-progressive, #36c));
  color: #ffffff;
  border: 1px solid var(--border-color-inverted, #ffffff);
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  z-index: 2;
  pointer-events: none;
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(50%, 50%);
}

.suggestions-badge--empty {
  background: var(--background-color-neutral, #eaecf0);
  color: #202122;
}

.suggestions-badge--zero {
  background: #72777d;
  border-color: #72777d;
  color: #ffffff;
}

.suggestions-badge--pulse {
  animation: badge-pulse 240ms ease;
}

.suggestions-toggle-btn:not(.suggestions-toggle-btn--active) .suggestions-badge,
.minerva-toolbar-toggle:not(.minerva-toolbar-toggle--active) .suggestions-badge,
.minerva-suggestions-toggle:not(.minerva-suggestions-toggle--active) .suggestions-badge {
  background: var(--background-color-progressive, #36c);
  border-color: var(--border-color-inverted, #ffffff);
  color: #ffffff;
}

@keyframes badge-pulse {
  0% {
    transform: translate(50%, 50%) scale(1);
  }
  50% {
    transform: translate(50%, 50%) scale(1.18);
  }
  100% {
    transform: translate(50%, 50%) scale(1);
  }
}

.suggestions-toggle-btn--active .suggestions-badge,
.minerva-toolbar-toggle--active .suggestions-badge,
.minerva-suggestions-rail-toggle--active .suggestions-badge,
.minerva-suggestions-toggle--active .suggestions-badge,
.suggestions-badge--rail-active {
  background: var(--suggestion-color-subtle, var(--background-color-progressive-subtle, #e8eeff));
  color: var(--suggestion-color, var(--color-progressive, #36c));
  border-color: var(--suggestion-color, var(--border-color-progressive, #36c));
}

.suggestions-toggle-btn--active .suggestions-badge--zero,
.minerva-toolbar-toggle--active .suggestions-badge--zero,
.minerva-suggestions-rail-toggle--active .suggestions-badge--zero,
.minerva-suggestions-toggle--active .suggestions-badge--zero,
.suggestions-badge--rail-active.suggestions-badge--zero {
  background: var(--suggestion-color-subtle, var(--background-color-progressive-subtle, #e8eeff));
  color: var(--suggestion-color, var(--color-progressive, #36c));
  border-color: var(--suggestion-color, var(--border-color-progressive, #36c));
}


.minerva-skin .suggestions-badge {
  font-size: 14px;
  line-height: 16px;
}

.suggestions-banner-close-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  border-radius: 9999px;
}

.suggestions-banner-close-icon-container {
  width: 16px;
  height: 16px;
  min-width: 16px;
  min-height: 16px;
  position: relative;
  display: inline-block;
  overflow: visible;
  cursor: pointer;
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.suggestions-banner-close-btn :deep(button) {
  border-radius: 9999px;
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  min-height: 24px !important;
}

.suggestions-banner-close-btn.cdx-button--action-progressive.cdx-button--weight-quiet.cdx-button--size-small.cdx-button--icon-only :deep(button) {
  border-radius: 9999px;
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  min-height: 24px !important;
}

.suggestions-banner-close-btn :deep(.cdx-button__button) {
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  min-height: 24px !important;
  padding: 0 !important;
  border-radius: 9999px !important;
}

.suggestions-banner-close-btn :deep(.cdx-button) {
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  min-height: 24px !important;
  border-radius: 9999px !important;
}

.minerva-skin .suggestions-banner-close-btn :deep(button) {
  border-radius: 9999px;
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
}

.suggestions-banner-close-icon {
  display: block;
}

.minerva-skin .suggestions-banner-close-icon {
  margin: 0 auto;
  width: 16px;
  height: 16px;
}

.minerva-skin .suggestions-banner-close-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.suggestions-banner-close-icon :deep(svg) {
  display: block;
  fill: currentColor;
}

.minerva-skin .suggestions-banner-close-icon-container {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-skin .suggestions-banner-close-btn :deep(button) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-skin .suggestions-banner-close-btn :deep(svg) {
  fill: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-skin .suggestions-banner--minerva-bottom {
  position: fixed;
  bottom: 0;
  top: auto;
  margin: 0;
  z-index: 69;
  left: 0;
  right: 0;
}

.minerva-skin .suggestions-banner--minerva {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.minerva-skin .suggestions-banner--minerva-top {
  position: fixed;
  top: 42px;
  bottom: auto;
  margin: 0;
  z-index: 70;
  left: 0;
  right: 0;
}

.minerva-skin .suggestions-viewport-notification--minerva,
.minerva-skin .empty-state--minerva {
  position: fixed;
  bottom: 0;
  top: auto;
  left: 0;
  right: 0;
  margin: 0;
  z-index: 69;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.vector-skin .suggestions-banner {
  font-size: 14px;
  line-height: 20px;
  position: sticky;
  top: auto;
  bottom: 32px;
}

.vector-skin .suggestions-banner.suggestions-banner--contextual-up {
  top: 40px;
  bottom: auto;
}

.minerva-skin .suggestions-banner {
  font-size: 14px;
  line-height: 20px;
}

.minerva-skin .suggestions-banner-actions {
  right: 6px;
}

.edit-mode.suggestion-light-flash::after {
  content: '';
  position: fixed;
  inset: 0;
  background: radial-gradient(60% 50% at 50% 0%, rgba(207, 227, 255, 0.12) 0%, rgba(207, 227, 255, 0.08) 45%, rgba(207, 227, 255, 0) 70%);
  opacity: 0;
  pointer-events: none;
  z-index: 5;
  animation: suggestion-light-glow 150ms ease;
}

@keyframes suggestion-light-glow {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.edit-mode .suggestion-target,
.edit-mode .suggestion-card,
.edit-mode .minerva-suggestion-trigger {
  opacity: 0;
  transition: opacity 150ms ease, filter 200ms ease;
}

.edit-mode.suggestion-markers-visible .suggestion-target,
.edit-mode.suggestion-markers-visible .suggestion-card,
.edit-mode.suggestion-markers-visible .minerva-suggestion-trigger {
  opacity: 1;
}

.edit-mode.suggestion-markers-hiding .suggestion-target,
.edit-mode.suggestion-markers-hiding .suggestion-card,
.edit-mode.suggestion-markers-hiding .minerva-suggestion-trigger {
  transition-duration: 100ms;
}

.suggestion-card--bounce {
  animation: suggestion-card-bounce 3.2s ease-in-out 0s infinite;
}

.minerva-suggestion-trigger--bounce {
  animation: suggestion-icon-bounce 3.2s ease-in-out 0s infinite;
}

@keyframes suggestion-card-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  12% {
    transform: translateY(-6px);
  }
  24% {
    transform: translateY(0);
  }
  36% {
    transform: translateY(-3px);
  }
  48% {
    transform: translateY(0);
  }
}

@keyframes suggestion-icon-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  12% {
    transform: translateY(-6px);
  }
  24% {
    transform: translateY(0);
  }
  36% {
    transform: translateY(-3px);
  }
  48% {
    transform: translateY(0);
  }
}

.edit-mode.suggestion-glow-active .suggestion-card {
  filter: drop-shadow(0 0 10px rgba(51, 102, 204, 0.25));
}

.edit-mode.suggestion-glow-active .minerva-suggestion-trigger {
  filter: drop-shadow(0 0 8px rgba(51, 102, 204, 0.35));
}


.prototype-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prototype-dialog-content :deep(.cdx-message) {
  padding: 12px;
  margin-bottom: 16px;
  hyphens: none;
  word-break: normal;
  overflow-wrap: normal;
}

.prototype-dialog-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prototype-suboption-radio :deep(.cdx-radio--status-default) {
  padding-bottom: 0;
}

.prototype-suboption-radio {
  margin: 0;
}

.prototype-suboption-radio + .prototype-suboption-radio {
  margin-top: 4px;
}

.prototype-suboption-radio--last :deep(.cdx-radio--status-default) {
  padding-bottom: 12px;
}

.prototype-dialog-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  margin-left: 24px;
}

.prototype-dialog-checkboxes :deep(.cdx-checkbox) {
  padding-bottom: 0;
  margin-bottom: 0;
}

.vector-no-more-dialog-text {
  margin: 0;
  font-size: 16px;
  line-height: 24px;
}

.vector-no-more-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.vector-skin :deep(.cdx-dialog__body) {
  font-size: 14px;
}

.minerva-skin :deep(.cdx-dialog__body) {
  font-size: 16px;
}

.minerva-skin :deep(.cdx-dialog__body) {
  padding-left: 16px !important;
  padding-right: 16px !important;
}

.link-dialog-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  z-index: 210;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0;
}

.link-dialog {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  color: #202122;
  border: 1px solid var(--border-color-base, #a2a9b1);
  border-radius: 0;
  box-shadow: none;
}

.link-dialog-header {
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
  border-bottom: 1px solid var(--border-color-base, #a2a9b1);
}

.link-dialog-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.link-dialog-close,
.link-dialog-confirm {
  width: 56px;
  height: 56px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.link-dialog-confirm {
  background: #36c;
  color: #ffffff;
}

.link-dialog-confirm :deep(.cdx-icon),
.link-dialog-confirm :deep(svg) {
  color: #ffffff;
}

.link-dialog-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--border-color-base, #a2a9b1);
}

.link-dialog-tab {
  padding: 14px 12px;
  border: none;
  background: transparent;
  font-weight: 700;
  font-size: 16px;
  color: #202122;
  border-bottom: 3px solid transparent;
  cursor: pointer;
}

.link-dialog-tab--active {
  color: #36c;
  border-bottom-color: #36c;
}

.link-dialog-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.link-dialog-panel :deep(.cdx-field__label) {
  font-size: 16px;
  font-weight: 700;
  color: #202122;
}

.link-dialog-panel :deep(.cdx-text-input__input),
.link-dialog-panel :deep(.cdx-typeahead-search__input) {
  font-size: 16px;
}

.link-dialog-panel :deep(.cdx-typeahead-search__menu) {
  max-height: 360px;
}

.suggestion-notification {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0 16px;
  padding: 12px 14px;
  border-radius: 6px;
  background: #f8f9fa;
  border: 1px solid #eaecf0;
  color: #202122;
}

.suggestion-notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.suggestion-notification-text {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
}

.suggestion-notification-card {
  position: sticky;
  top: 0;
  cursor: pointer;
  border: 1px solid var(--border-color-muted, #c8ccd1);
  background: var(--background-color-base, #ffffff);
  box-shadow: none;
}

.suggestion-notification-card:focus-visible {
  outline: 2px solid #36c;
  outline-offset: 2px;
}

.suggestion-notification-header {
  align-items: center;
  gap: 8px;
  background-color: var(--background-color-base, #ffffff);
}

.suggestion-notification-header .suggestion-title {
  white-space: nowrap;
}

.suggestion-notification-card--minerva {
  position: static;
  width: 100%;
  margin-top: 12px;
}

.suggestion-notification-action {
  width: auto;
  margin-left: auto;
}

.suggestion-notification-action--icon {
  padding: 0;
  min-width: auto;
}

.vector-skin .suggestion-notification-header .suggestion-title,
.vector-skin .suggestion-notification-action {
  font-size: 14px;
}

.minerva-sheet-header--empty :deep(svg) {
  fill: var(--color-placeholder, #72777d);
}

.minerva-sheet-header--no-more :deep(.cdx-icon),
.minerva-sheet-header--no-more :deep(svg) {
  color: var(--color-disabled, #a2a9b1);
  fill: var(--color-disabled, #a2a9b1);
}

.minerva-sheet-header--no-more .minerva-sheet-icon-button--close :deep(.cdx-icon),
.minerva-sheet-header--no-more .minerva-sheet-icon-button--close :deep(svg) {
  color: var(--color-base, #202122);
  fill: var(--color-base, #202122);
}

.minerva-sheet-header--empty .minerva-sheet-title {
  color: var(--color-placeholder, #72777d);
}

.minerva-empty-sheet-text {
  margin: 8px 0 0;
  font-size: 16px;
  line-height: 22px;
  color: var(--color-placeholder, #72777d);
}

/* ── Entry badge (Minerva edit buttons) ───────────────────────── */

.minerva-action-btn--edit-entry {
  position: relative;
}

.entry-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--background-color-progressive, #36c);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.entry-badge .entry-badge__icon {
  color: var(--color-inverted, #fff);
  width: 8px;
  height: 8px;
}

.entry-badge__icon :deep(svg) {
  width: 8px;
  height: 8px;
}

/* ── Entry lightbulb (Vector22 section [edit]) ────────────────── */

.section-edit-lightbulb {
  color: var(--color-progressive, #36c);
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-left: 12px;
}

.section-edit-lightbulb :deep(svg) {
  width: 16px;
  height: 16px;
}

/* ── Read mode toast ──────────────────────────────────────────── */

.read-mode-toast {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: var(--spacing-75, 12px);
  padding: var(--spacing-75, 12px) var(--spacing-100, 16px);
  background-color: #E8EEFF;
  border-bottom: 1px solid var(--border-color-subtle, #c8ccd1);
  font-size: var(--font-size-small, 14px);
  line-height: var(--line-height-small, 1.375);
  color: var(--color-base, #202122);
  cursor: pointer;
}

.read-mode-toast__icon {
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 2px;
  color: var(--color-progressive, #36c);
  width: 16px;
  height: 16px;
}

.read-mode-toast__icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.read-mode-toast__text {
  flex: 1;
  min-width: 0;
  font-size: var(--font-size-small, 14px);
}

.read-mode-toast__close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  padding: 0;
  color: var(--color-subtle, #54595d);
  cursor: pointer;
}

.read-mode-toast-enter-active,
.read-mode-toast-leave-active {
  transition: transform 200ms ease, opacity 200ms ease;
}

.read-mode-toast-enter-from,
.read-mode-toast-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* ── Fixed header (Vector22, scroll > 150px) ─────────────────── */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 48px;
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0 var(--spacing-100, 16px) 0 var(--spacing-50, 8px);
  background-color: var(--background-color-base, #fff);
  border-bottom: 1px solid var(--border-color-subtle, #c8ccd1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.fixed-header__menu {
  flex-shrink: 0;
  margin-right: var(--spacing-50, 8px);
}

.fixed-header__search-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-base, #202122);
  border-radius: var(--border-radius-base, 2px);
}

.fixed-header__search-btn:hover {
  background-color: var(--background-color-button-quiet--hover, rgba(0,24,73,0.027));
}

.fixed-header__divider {
  width: 1px;
  height: 24px;
  background-color: var(--border-color-subtle, #c8ccd1);
  flex-shrink: 0;
  margin: 0 var(--spacing-75, 12px);
}

.fixed-header__title {
  flex: 1;
  min-width: 0;
  font-family: var(--font-family-serif, 'Linux Libertine', Georgia, serif);
  font-size: 1.125rem;
  font-weight: var(--font-weight-normal, 400);
  color: var(--color-base, #202122);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fixed-header__end {
  flex-shrink: 0;
  margin-left: auto;
}

/* ── Menu popup toggle row ─────────────────────────────────────── */
.menu-popup__toggle-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-75, 12px);
  margin-top: var(--spacing-150, 24px);
}

.menu-popup__toggle-label {
  font-size: var(--font-size-medium, 1rem);
  color: var(--color-base, #202122);
  line-height: var(--line-height-small, 1.375);
}

/* ── Icon img helper ─────────────────────────────────────────── */
.minerva-action-icon-img {
  display: block;
}

/* ── Menu popup fieldset reset ────────────────────────────────── */

.menu-popup :deep(.cdx-field__fieldset) {
  border: none;
  padding: 0;
  margin: 0;
}
</style>
