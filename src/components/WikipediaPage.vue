<template>
  <div
    ref="pageRoot"
    :class="[
      isEditMode ? 'edit-mode' : 'read-mode',
      isMinervaSkin ? 'minerva-skin' : 'vector-skin',
      isMinervaSkin && editFullPageImprovedEnabled ? 'minerva-edit-full-page-improved' : '',
      isMinervaSkin && isEditMode && showSuggestions && bannerSuggestionCount > 0 && !showMinervaRail ? 'minerva-suggestions-on' : '',
      isMinervaSkin && isEditMode && showMinervaRail ? 'minerva-suggestions-on--rail' : '',
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
      v-if="shouldShowToasts && showMinervaMoreSuggestionsToast"
      class="minerva-toast minerva-toast--more"
      role="status"
      aria-live="polite"
    >
      More suggestions are now available
    </div>
    <div
      v-if="shouldShowToasts && showMinervaZeroSuggestionsToast"
      class="minerva-toast minerva-toast--zero"
      role="status"
      aria-live="polite"
    >
      0 suggestions available for now
    </div>
    
    <!-- Page Container -->
    <div class="page-container">
      
      <!-- Header -->
      <header class="header-section" :class="{ 'header-section--minerva': isMinervaSkin }">
        <div v-if="!isMinervaSkin" class="header">
          <!-- Menu Button -->
          <button class="menu-button" aria-label="Menu" @click="toggleSkinMenu">
            <cdx-icon :icon="cdxIconMenu" size="medium" />
          </button>
          <div v-if="isSkinMenuOpen && !isEditMode" class="menu-popup" role="dialog" aria-label="Skin menu">
            <label class="menu-radio">
              <input type="radio" name="skin" value="vector22" v-model="selectedSkin" @change="isSkinMenuOpen = false">
              <span>Vector22</span>
            </label>
            <label class="menu-radio">
              <input type="radio" name="skin" value="minerva" v-model="selectedSkin" @change="isSkinMenuOpen = false">
              <span>Minerva (mobile skin)</span>
            </label>
          </div>

          <!-- Wikipedia Logo -->
          <div class="wikipedia-logo">
            <img :src="wikipediaGlobe" alt="Wikipedia globe" class="wikipedia-globe" />
            <div class="wikipedia-text">
              <div class="wikipedia-title">WIKIPEDIA</div>
              <div class="wikipedia-tagline">The Free Encyclopedia</div>
            </div>
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
            <div v-if="isSkinMenuOpen && !isEditMode" class="menu-popup menu-popup--minerva" role="dialog" aria-label="Skin menu">
              <label class="menu-radio">
                <input type="radio" name="skin" value="vector22" v-model="selectedSkin" @change="isSkinMenuOpen = false">
                <span>Vector22</span>
              </label>
              <label class="menu-radio">
                <input type="radio" name="skin" value="minerva" v-model="selectedSkin" @change="isSkinMenuOpen = false">
                <span>Minerva (mobile skin)</span>
              </label>
            </div>

            <div class="minerva-brand">
              <span class="minerva-brand-text">Wikipedia</span>
            </div>
          </div>

          <div class="minerva-header-actions">
            <button class="icon-btn" aria-label="Search">
              <cdx-icon :icon="cdxIconSearch" size="medium" />
            </button>
            <button class="icon-btn" aria-label="Notifications">
              <cdx-icon :icon="cdxIconBell" size="medium" />
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
                'suggestions-banner--option-2': isArrowOnceMode && bannerSuggestionCount > 0,
                'suggestions-banner--option-3': activePrototype === 'option-3' && bannerSuggestionCount > 0,
                'suggestions-banner--single-use': activePrototype === 'option-2',
                'suggestions-banner--contextual-up': showBannerPrimaryArrowUp &&
                  (activePrototype === 'option-1' || activePrototype === 'option-2'),
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
                      v-if="activePrototype === 'option-2' && !isAutoScrollActive"
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
                <span v-if="activePrototype === 'option-2' || activePrototype === 'option-1'" class="suggestions-banner-close-icon-container">
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
                    <div class="tab" :class="{ 'tab-selected': isEditMode }" @click="toggleEditMode">
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
                <button class="minerva-action-btn" aria-label="Edit" @click="toggleEditMode">
                  <cdx-icon :icon="cdxIconEdit" size="medium" />
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
                  <div class="section-heading">
                    <div class="section-heading-row">
                      <h2 class="heading-text">Early life</h2>
                      <span class="section-edit">
                        <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('early-life')">edit</a><span class="section-edit-bracket">]</span>
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
            <div class="section-heading">
              <div class="section-heading-row">
                <h2 class="heading-text">Career</h2>
                <span class="section-edit">
                  <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('career')">edit</a><span class="section-edit-bracket">]</span>
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
            <div class="section-heading">
              <div class="section-heading-row">
                <h2 class="heading-text">Poetry</h2>
                <span class="section-edit">
                  <span class="section-edit-bracket">[</span><a href="#" class="section-edit-link" @click.prevent="openEditAtSection('poetry')">edit</a><span class="section-edit-bracket">]</span>
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

            <!-- Prose Section -->
            <div class="section-heading">
              <div class="section-heading-row">
                <h2 class="heading-text">Prose</h2>
                <span class="section-edit">
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
              <div class="minerva-accordion-item">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('early-life')" :aria-expanded="isMinervaSectionOpen('early-life')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('early-life') }" />
                    <span>Early life</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('early-life')" class="minerva-accordion-edit" aria-label="Edit section" @click.stop="openEditAtSection('early-life')">
                    <cdx-icon :icon="cdxIconEdit" size="small" />
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

              <div class="minerva-accordion-item">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('career')" :aria-expanded="isMinervaSectionOpen('career')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('career') }" />
                    <span>Career</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('career')" class="minerva-accordion-edit" aria-label="Edit section" @click.stop="openEditAtSection('career')">
                    <cdx-icon :icon="cdxIconEdit" size="small" />
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

              <div class="minerva-accordion-item">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('poetry')" :aria-expanded="isMinervaSectionOpen('poetry')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('poetry') }" />
                    <span>Poetry</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('poetry')" class="minerva-accordion-edit" aria-label="Edit section" @click.stop="openEditAtSection('poetry')">
                    <cdx-icon :icon="cdxIconEdit" size="small" />
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

              <div class="minerva-accordion-item">
                <div class="minerva-accordion-header">
                  <button class="minerva-accordion-toggle" @click="toggleMinervaSection('prose')" :aria-expanded="isMinervaSectionOpen('prose')">
                    <cdx-icon :icon="cdxIconExpand" size="small" :class="{'minerva-accordion-icon--open': isMinervaSectionOpen('prose') }" />
                    <span>Prose</span>
                  </button>
                  <button v-if="isMinervaSectionOpen('prose')" class="minerva-accordion-edit" aria-label="Edit section" @click.stop="openEditAtSection('prose')">
                    <cdx-icon :icon="cdxIconEdit" size="small" />
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
              v-if="isMinervaSkin && (activePrototype === 'option-1' || isArrowOnceMode)"
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
      <div
        v-if="isMinervaSkin && showSuggestions && showMinervaSuccessMessage"
        ref="minervaSuccessRef"
        class="success-message success-message--minerva"
      >
                <div class="success-icon">
                  <cdx-icon :icon="cdxIconSuccess" size="medium" />
                </div>
                <div class="success-content">
                  <p class="success-text">Thank you for helping to make this section easier for people to read.</p>
          </div>
        </div>
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
                      <p
                        v-if="showSuggestionsDisplay && !isSuggestionResolved5 && !isSuggestionDeclined5"
                        ref="highlightedTextRef5"
                        :class="{
                          'highlighted-text-wrapper': showSuggestions,
                          [nonSelectedHighlightClass]: showSuggestions,
                          'highlighted-text-wrapper--hover': isHovered5 && showSuggestions && !isCardExpanded5,
                          'highlighted-text-wrapper--selected': isCardExpanded5 && showSuggestions,
                          'minerva-suggestion-target': isMinervaSkin,
                          'suggestion-dismiss-right': dismissedSuggestionId === 5
                        }"
                        class="suggestion-target"
                        @mouseenter="isTextHovered5 = true"
                        @mouseleave="isTextHovered5 = false"
                        @click="isMinervaSkin ? openMinervaSuggestion(5) : (isCardExpanded5 = true)"
                      >
                        <span class="highlighted-text-rail"></span>
                        <span class="highlighted-text-content">
                          <strong>Audre Lorde</strong> (<a href="https://en.wikipedia.org/wiki/Help:IPA/English" target="_blank" rel="noopener">/ˈɔːdri ˈlɔːrd/</a>; born <strong>Audrey Geraldine Lorde</strong>; February 18, 1934 – November 17, 1992) was an American writer, <a href="https://en.wikipedia.org/wiki/Professor" target="_blank" rel="noopener">professor</a>, <a href="https://en.wikipedia.org/wiki/Philosopher" target="_blank" rel="noopener">philosopher</a>, <span class="highlighted-text-annotation"><a href="https://example.org/intersectional-feminist" target="_blank" rel="noopener">intersectional feminist</a></span>, <a href="https://en.wikipedia.org/wiki/Poet" target="_blank" rel="noopener">poet</a>, and <a href="https://en.wikipedia.org/wiki/Civil_rights_movement" target="_blank" rel="noopener">civil rights</a> activist.<sup class="citation-marker">[1]</sup> She described herself as a “Black, lesbian, feminist, socialist, mother, warrior, poet” and framed her work as a response to injustice and oppression in multiple forms.<sup class="citation-marker">[2]</sup>
                        </span>
                        <span v-if="isMinervaSkin" class="minerva-highlight-rail"></span>
                        <button
                          v-if="isMinervaSkin"
                          type="button"
                          class="minerva-suggestion-trigger"
                          aria-label="Show suggestion"
                          @mousedown.prevent
                          @touchstart.stop.prevent="openMinervaSuggestion(5)"
                          @click.stop="openMinervaSuggestion(5)"
                        >
                          <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                        </button>
                      </p>
                      <p v-else>
                        <strong>Audre Lorde</strong> (<a href="https://en.wikipedia.org/wiki/Help:IPA/English" target="_blank" rel="noopener">/ˈɔːdri ˈlɔːrd/</a>; born <strong>Audrey Geraldine Lorde</strong>; February 18, 1934 – November 17, 1992) was an American writer, <a href="https://en.wikipedia.org/wiki/Professor" target="_blank" rel="noopener">professor</a>, <a href="https://en.wikipedia.org/wiki/Philosopher" target="_blank" rel="noopener">philosopher</a>, <a href="https://example.org/intersectional-feminist" target="_blank" rel="noopener">intersectional feminist</a>, <a href="https://en.wikipedia.org/wiki/Poet" target="_blank" rel="noopener">poet</a>, and <a href="https://en.wikipedia.org/wiki/Civil_rights_movement" target="_blank" rel="noopener">civil rights</a> activist.<sup class="citation-marker">[1]</sup> She described herself as a “Black, lesbian, feminist, socialist, mother, warrior, poet” and framed her work as a response to injustice and oppression in multiple forms.<sup class="citation-marker">[2]</sup>
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
                    v-if="showSuggestionsDisplay && !showSuccessMessage1 && citationNumber1 === null && !isSuggestionDeclined1"
                    ref="highlightedTextRef"
                    :class="{ 
                      'highlighted-text-wrapper': showSuggestions,
                      [nonSelectedHighlightClass]: showSuggestions,
                      'highlighted-text-wrapper--hover': isHovered && showSuggestions && !isCardExpanded,
                      'highlighted-text-wrapper--selected': isCardExpanded && showSuggestions,
                      'minerva-suggestion-target': isMinervaSkin,
                      'suggestion-dismiss-right': dismissedSuggestionId === 1
                    }" 
                    class="suggestion-target"
                    @mouseenter="isTextHovered = true"
                    @mouseleave="isTextHovered = false"
                    @click="isMinervaSkin ? openMinervaSuggestion(1) : (isCardExpanded = true)"
                  >
                    <span class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      <span class="highlighted-text-annotation">
                      In 1968 Lorde was writer-in-residence at <a href="#">Tougaloo College</a> in Mississippi. Lorde's time at Tougaloo College, like her year at the <a href="#">National University of Mexico</a>, was a formative experience for her as an artist. She led workshops with her young, black undergraduate students, many of whom were eager to discuss the <a href="#">civil rights</a> issues of that time. Through these discussions with her students, she reaffirmed her desire not only to live out her "crazy and queer" identity, but also to devote attention to the formal aspects of her craft as a poet. Her book of poems, <em>Cables to Rage</em>, came out of her time and experiences at Tougaloo.<sup v-if="showCitationPopup1 || citationNumber1" class="citation-marker" ref="citationMarker1">[{{ citationNumber1 || '...' }}]</sup>
                      </span>
                    </span>
                    <span v-if="isMinervaSkin" class="minerva-highlight-rail"></span>
                    <button
                      v-if="isMinervaSkin"
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
                                    <p><strong class="subsection-title">Early works</strong></p>
                                    <p>
                    Lorde's poetry was published very regularly during the 1960s - in Langston Hughes' 1962 New Negro Poets, USA; in several foreign anthologies; and in black literary magazines. During this time, she was also politically active in civil rights, anti-war, and feminist movements.
                  </p>
                                    <p
                    v-if="showSuggestionsDisplay && !isSuggestionResolved8 && !isSuggestionDeclined8"
                    ref="highlightedTextRef8"
                    :class="{
                      'highlighted-text-wrapper': showSuggestions,
                      [nonSelectedHighlightClass]: showSuggestions,
                      'highlighted-text-wrapper--hover': isHovered8 && showSuggestions && !isCardExpanded8,
                      'highlighted-text-wrapper--selected': isCardExpanded8 && showSuggestions,
                      'minerva-suggestion-target': isMinervaSkin,
                      'suggestion-dismiss-right': dismissedSuggestionId === 8
                    }"
                    class="suggestion-target"
                    @mouseenter="isTextHovered8 = true"
                    @mouseleave="isTextHovered8 = false"
                    @click="isMinervaSkin ? openMinervaSuggestion(8) : (isCardExpanded8 = true)"
                  >
                    <span class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      In 1968, Lorde published <span class="highlighted-text-annotation"><a href="https://example.org/the-first-cities" target="_blank" rel="noopener">The First Cities</a></span>, her first volume of poems. It was edited by Diane di Prima, a former classmate and friend from Hunter College High School. The First Cities has been described as a "quiet, introspective book", and Dudley Randall, a poet and critic, asserted in his review of the book that Lorde "does not wave a black flag, but her Blackness is there, implicit, in the bone".
                    </span>
                    <span v-if="isMinervaSkin" class="minerva-highlight-rail"></span>
                    <button
                      v-if="isMinervaSkin"
                      type="button"
                      class="minerva-suggestion-trigger"
                      aria-label="Show suggestion"
                      @mousedown.prevent
                      @touchstart.stop.prevent="openMinervaSuggestion(8)"
                      @click.stop="openMinervaSuggestion(8)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    </button>
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
                    v-if="showSuggestionsDisplay && !isSuggestionResolved6 && !isSuggestionDeclined6"
                    ref="highlightedTextRef6"
                    :class="{
                      'highlighted-text-wrapper': showSuggestions,
                      [nonSelectedHighlightClass]: showSuggestions,
                      'highlighted-text-wrapper--hover': isHovered6 && showSuggestions && !isCardExpanded6,
                      'highlighted-text-wrapper--selected': isCardExpanded6 && showSuggestions,
                      'minerva-suggestion-target': isMinervaSkin,
                      'suggestion-dismiss-right': dismissedSuggestionId === 6
                    }"
                    class="suggestion-target"
                    @mouseenter="isTextHovered6 = true"
                    @mouseleave="isTextHovered6 = false"
                    @click="isMinervaSkin ? openMinervaSuggestion(6) : (isCardExpanded6 = true)"
                  >
                    <span class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      <span class="highlighted-text-annotation"><strong class="subsection-title">Wider recognition</strong></span>
                    </span>
                    <span v-if="isMinervaSkin" class="minerva-highlight-rail"></span>
                    <button
                      v-if="isMinervaSkin"
                      type="button"
                      class="minerva-suggestion-trigger"
                      aria-label="Show suggestion"
                      @mousedown.prevent
                      @touchstart.stop.prevent="openMinervaSuggestion(6)"
                      @click.stop="openMinervaSuggestion(6)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    </button>
                  </p>
                                    <p v-else><strong class="subsection-title">Wider recognition</strong></p>
                                    <p>
                    Despite the success of these volumes, it was the release of Coal in 1976 that established Lorde as an influential voice in the Black Arts Movement, and the large publishing house behind it - Norton - helped introduce her to a wider audience. The volume includes poems from both The First Cities and Cables to Rage, and it unites many of the themes Lorde would become known for throughout her career: her rage at racial injustice, her celebration of her black identity, and her call for an intersectional consideration of women's experiences. Lorde followed Coal up with Between Our Selves (also in 1976) and Hanging Fire (1978).
                  </p>
                                    <p
                    v-if="showSuggestionsDisplay && !showSuccessMessage2 && citationNumber2 === null && !isSuggestionDeclined2"
                    ref="highlightedTextRef2"
                    :class="{ 
                      'highlighted-text-wrapper': showSuggestions,
                      [nonSelectedHighlightClass]: showSuggestions,
                      'highlighted-text-wrapper--hover': isHovered2 && showSuggestions && !isCardExpanded2,
                      'highlighted-text-wrapper--selected': isCardExpanded2 && showSuggestions,
                      'minerva-suggestion-target': isMinervaSkin,
                      'suggestion-dismiss-right': dismissedSuggestionId === 2
                    }"
                    class="suggestion-target"
                    @mouseenter="isTextHovered2 = true"
                    @mouseleave="isTextHovered2 = false"
                    @click="isMinervaSkin ? openMinervaSuggestion(2) : (isCardExpanded2 = true)"
                  >
                    <span class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      <span class="highlighted-text-annotation">
                      In Lorde's volume
                      <span
                        v-if="!isSuggestionResolved4 && !isSuggestionDeclined4"
                        ref="highlightedTextRef4"
                        class="suggestion-target suggestion-target--inline"
                        :class="{
                          [nonSelectedHighlightClass]: showSuggestions,
                          'highlighted-text-wrapper--hover': isHovered4 && showSuggestions && !isCardExpanded4,
                          'highlighted-text-wrapper--selected': isCardExpanded4 && showSuggestions
                        }"
                        @mouseenter.stop="isTextHovered4 = true"
                        @mouseleave.stop="isTextHovered4 = false"
                        @click.stop="isMinervaSkin ? openMinervaSuggestion(4) : (isCardExpanded4 = true)"
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
                    <span v-if="isMinervaSkin" class="minerva-highlight-rail"></span>
                    <button
                      v-if="isMinervaSkin"
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
                  </p>
                  <p v-else>
                    In Lorde's volume
                    <span
                      v-if="!isSuggestionResolved4 && !isSuggestionDeclined4"
                      ref="highlightedTextRef4"
                      class="suggestion-target suggestion-target--inline"
                      :class="{
                        'highlighted-text-wrapper--hover': isHovered4 && showSuggestions && !isCardExpanded4,
                        'highlighted-text-wrapper--selected': isCardExpanded4 && showSuggestions
                      }"
                      @mouseenter.stop="isTextHovered4 = true"
                      @mouseleave.stop="isTextHovered4 = false"
                      @click.stop="isMinervaSkin ? openMinervaSuggestion(4) : (isCardExpanded4 = true)"
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
                    v-if="showSuggestionsDisplay && !isSuggestionResolved7 && !isSuggestionDeclined7"
                    ref="highlightedTextRef7"
                    :class="{
                      'highlighted-text-wrapper': showSuggestions,
                      [nonSelectedHighlightClass]: showSuggestions,
                      'highlighted-text-wrapper--hover': isHovered7 && showSuggestions && !isCardExpanded7,
                      'highlighted-text-wrapper--selected': isCardExpanded7 && showSuggestions,
                      'minerva-suggestion-target': isMinervaSkin,
                      'suggestion-dismiss-right': dismissedSuggestionId === 7
                    }"
                    class="suggestion-target"
                    @mouseenter="isTextHovered7 = true"
                    @mouseleave="isTextHovered7 = false"
                    @click="isMinervaSkin ? openMinervaSuggestion(7) : (isCardExpanded7 = true)"
                  >
                    <span class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      The Cancer Journals (<span class="highlighted-text-annotation"><a href="https://example.org/1980" target="_blank" rel="noopener">1980</a></span>) and A Burst of Light (1988) both use non-fiction prose, including essays and journal entries, to bear witness to, explore, and reflect on Lorde's diagnosis, treatment, recovery from breast cancer, and ultimately fatal recurrence with liver metastases. In both works, Lorde deals with Western notions of illness, disability, treatment, cancer and sexuality, and physical beauty and prosthesis, as well as themes of death, fear of mortality, survival, emotional healing, and inner power.
                    </span>
                    <span v-if="isMinervaSkin" class="minerva-highlight-rail"></span>
                    <button
                      v-if="isMinervaSkin"
                      type="button"
                      class="minerva-suggestion-trigger"
                      aria-label="Show suggestion"
                      @mousedown.prevent
                      @touchstart.stop.prevent="openMinervaSuggestion(7)"
                      @click.stop="openMinervaSuggestion(7)"
                    >
                      <cdx-icon :icon="cdxIconLightbulb" size="medium" />
                    </button>
                  </p>
                  <p v-else>
                    The Cancer Journals (<a href="https://example.org/1980" target="_blank" rel="noopener">1980</a>) and A Burst of Light (1988) both use non-fiction prose, including essays and journal entries, to bear witness to, explore, and reflect on Lorde's diagnosis, treatment, recovery from breast cancer, and ultimately fatal recurrence with liver metastases. In both works, Lorde deals with Western notions of illness, disability, treatment, cancer and sexuality, and physical beauty and prosthesis, as well as themes of death, fear of mortality, survival, emotional healing, and inner power.
                  </p>
                                    <p>
                    Lorde's deeply personal book Zami: A New Spelling of My Name (1982), subtitled a "biomythography", chronicles her childhood and adulthood. The narrative deals with the evolution of Lorde's sexuality and self-awareness.
                  </p>
                                    <p><strong class="subsection-title">Sister Outsider</strong></p>
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
                    v-if="showSuggestionsDisplay && !showSuccessMessage3 && citationNumber3 === null && !isSuggestionDeclined3"
                    ref="highlightedTextRef3"
                    :class="{ 
                      'highlighted-text-wrapper': showSuggestions,
                      [nonSelectedHighlightClass]: showSuggestions,
                      'highlighted-text-wrapper--hover': isHovered3 && showSuggestions && !isCardExpanded3,
                      'highlighted-text-wrapper--selected': isCardExpanded3 && showSuggestions,
                      'minerva-suggestion-target': isMinervaSkin,
                      'suggestion-dismiss-right': dismissedSuggestionId === 3
                    }"
                    class="suggestion-target"
                    @mouseenter="isTextHovered3 = true"
                    @mouseleave="isTextHovered3 = false"
                    @click="isMinervaSkin ? openMinervaSuggestion(3) : (isCardExpanded3 = true)"
                  >
                    <span class="highlighted-text-rail"></span>
                    <span class="highlighted-text-content">
                      <span class="highlighted-text-annotation">
                      — Audre Lorde, The Master's Tools Will Never Dismantle the Master's House, Sister Outsider: Essays and Speeches (1984)<sup v-if="showCitationPopup3 || citationNumber3" class="citation-marker">[{{ citationNumber3 || '...' }}]</sup>
                      </span>
                    </span>
                    <span v-if="isMinervaSkin" class="minerva-highlight-rail"></span>
                    <button
                      v-if="isMinervaSkin"
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
            class="vector-suggestions-controls"
          >
            <cdx-button
              v-if="showDesktopFilterButton"
              class="suggestions-filter-btn"
              action="default"
              weight="quiet"
              size="large"
              aria-label="Filter suggestions"
              @click="handleFilterSuggestionsClick"
            >
              <cdx-icon :icon="cdxIconConfigure" size="medium" />
            </cdx-button>
            <div
              v-if="activePrototype === 'option-3' && showSuggestions && !anySuggestionVisible"
              class="vector-suggestions-arrow-controls"
            >
              <div class="suggestions-banner-arrow-buttons">
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

          <!-- Success Message for Suggestion 1 -->
          <div 
            v-if="showSuggestionsDisplay && showSuccessMessage1 && citationNumber1 !== null"
            ref="suggestionsSidebarRef"
            class="success-message"
            :style="{ top: `${sidebarTopOffset}px` }"
          >
            <div class="success-icon">
              <cdx-icon :icon="cdxIconSuccess" size="medium" />
            </div>
            <div class="success-content">
              <p class="success-text">Thank you for helping to make this section easier for people to read.</p>
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

          <!-- Success Message for Suggestion 2 -->
          <div 
            v-if="showSuggestionsDisplay && showSuccessMessage2 && citationNumber2 !== null"
            ref="suggestionsSidebarRef2"
            class="success-message"
            :style="{ top: `${sidebarTopOffset2}px` }"
          >
            <div class="success-icon">
              <cdx-icon :icon="cdxIconSuccess" size="medium" />
            </div>
            <div class="success-content">
              <p class="success-text">Thank you for helping to make this section easier for people to read.</p>
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
            v-if="showSuggestionsDisplay && !isSuggestionResolved5 && !isSuggestionDeclined5"
            ref="suggestionsSidebarRef5"
            :class="{
              'suggestion-card--collapsed': !isCardExpanded5,
              'suggestion-card--expanded': isCardExpanded5,
              'suggestion-card--hover': isHovered5
            }"
            class="suggestion-card suggestion-card-positioned"
            :style="{ top: `${sidebarTopOffset5}px` }"
            @mouseenter="isCardHovered5 = true"
            @mouseleave="isCardHovered5 = false"
          >
            <button v-if="!isCardExpanded5" class="suggestion-header suggestion-header--collapsed" @click="isCardExpanded5 = true">
              <div class="suggestion-icon"><cdx-icon :icon="cdxIconLightbulb" size="medium" /></div>
              <div class="suggestion-title">Link to a more specific page</div>
            </button>
            <button v-else class="suggestion-header suggestion-header--expanded" @click="isCardExpanded5 = false" aria-expanded="true">
              <div class="suggestion-icon"><cdx-icon :icon="cdxIconLightbulb" size="medium" /></div>
              <div class="suggestion-title">Link to a more specific page</div>
            </button>
            <div v-if="isCardExpanded5" class="suggestion-content">
              <p class="suggestion-description">This link points to a disambiguation page. Help readers reach the intended topic by linking to a more specific page.</p>
              <div class="suggestion-actions">
                <button class="suggestion-btn" @click="handleResolveGenericSuggestion(5)">Link specifically</button>
                <button class="suggestion-btn suggestion-btn-secondary" @click="handleDeclineGenericSuggestion(5)">Dismiss</button>
                <cdx-button class="suggestion-more-actions" action="default" weight="quiet" aria-label="More actions">
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

          <!-- Success Message for Suggestion 3 -->
          <div 
            v-if="showSuggestionsDisplay && showSuccessMessage3 && citationNumber3 !== null"
            ref="suggestionsSidebarRef3"
            class="success-message"
            :style="{ top: `${sidebarTopOffset3}px` }"
          >
            <div class="success-icon">
              <cdx-icon :icon="cdxIconSuccess" size="medium" />
            </div>
            <div class="success-content">
              <p class="success-text">Thank you for helping to make this section easier for people to read.</p>
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
                (activePrototype === 'option-1' || activePrototype === 'option-2')
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
                'suggestions-banner--option-2': isArrowOnceMode && bannerSuggestionCount > 0,
                'suggestions-banner--option-3': activePrototype === 'option-3' && bannerSuggestionCount > 0,
                'suggestions-banner--single-use': activePrototype === 'option-2',
                'suggestions-banner--contextual-up': showBannerPrimaryArrowUp &&
                  (activePrototype === 'option-1' || activePrototype === 'option-2'),
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
                        v-if="activePrototype === 'option-2' && !isAutoScrollActive"
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
                  <span v-if="activePrototype === 'option-2' || activePrototype === 'option-1'" class="suggestions-banner-close-icon-container">
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
            <cdx-toggle-button
              v-if="showMinervaStandardRailToggle"
              ref="minervaRailToggleRef"
              :model-value="showSuggestions"
              quiet
              aria-label="Toggle suggestions"
              class="minerva-suggestions-rail-toggle"
              :class="{ 'minerva-suggestions-rail-toggle--active': showSuggestions }"
              @update:model-value="handleMinervaRailToggleChange"
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
                  v-if="showToggleBadge"
                  class="suggestions-badge"
                  :class="{ 'suggestions-badge--zero': showToggleBadgeZero, 'suggestions-badge--pulse': badgePulse }"
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
              v-if="showMinervaCollapsedCountRailToggle"
              :model-value="true"
              quiet
              aria-label="Show suggestions"
              class="minerva-suggestions-rail-toggle minerva-suggestions-rail-toggle--count-collapsed minerva-suggestions-rail-toggle--active"
              @update:model-value="handleMinervaCollapsedCountToggleChange"
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
              @click="handleFilterSuggestionsClick"
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
            <cdx-toggle-button
              v-if="showMinervaBottomRailToggle"
              ref="minervaRailToggleRef"
              :model-value="activePrototype === 'option-4' ? isMinervaOverviewSheetOpen : showSuggestions"
              quiet
              aria-label="Toggle suggestions"
              class="minerva-suggestions-rail-toggle"
              :class="{
                'minerva-suggestions-rail-toggle--active': activePrototype === 'option-4' ? isMinervaOverviewSheetOpen : showSuggestions,
                'minerva-suggestions-rail-toggle--overview': activePrototype === 'option-4'
              }"
              @update:model-value="handleMinervaRailToggleChange"
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
                  v-if="showToggleBadge"
                  class="suggestions-badge"
                  :class="{ 'suggestions-badge--zero': showToggleBadgeZero, 'suggestions-badge--pulse': badgePulse }"
                >
                  {{ toggleBadgeCount }}
                </span>
              </span>
            </cdx-toggle-button>
          </div>
        </div>

        <div
          v-if="isMinervaSkin && isEditMode && (showSuggestionsDisplay || isEditCheckMode) && isMinervaSheetOpen && (availableSuggestionCount > 0 || isEditCheckSheet)"
          class="minerva-bottom-sheet"
            :class="{
              'suggestion-dismiss-right': dismissedSuggestionId === activeMinervaSuggestion,
              'minerva-bottom-sheet--edit-check': isEditCheckSheet
            }"
            role="dialog"
            aria-label="Suggestion"
            ref="minervaSheetRef"
          >
            <div
              class="minerva-sheet-header"
              :class="{ 'minerva-sheet-header--empty': shouldShowEmptyState && !isEditCheckSheet }"
            >
              <cdx-icon :icon="isEditCheckSheet ? cdxIconAlert : cdxIconLightbulb" size="medium" />
              <div class="minerva-sheet-title">
                {{ isEditCheckSheet ? editCheckTitle : minervaSheetTitle }}
              </div>
              <button
                v-if="minervaSheetReturnDirection"
                class="minerva-sheet-close"
                type="button"
                :aria-label="minervaSheetReturnDirection === 'up' ? 'Scroll to highlighted item above' : 'Scroll to highlighted item below'"
                @click="scrollToMinervaSheetTarget"
              >
                <cdx-icon :icon="minervaSheetReturnDirection === 'up' ? cdxIconArrowUp : cdxIconArrowDown" size="medium" />
              </button>
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
          <div
            v-if="showMinervaPagination"
            class="minerva-sheet-pagination"
          >
            <div class="minerva-pagination-count">{{ minervaPaginationLabel }}</div>
            <div class="minerva-pagination-actions">
              <button
                class="minerva-pagination-btn"
                type="button"
                aria-label="Previous suggestion"
                :disabled="isMinervaPaginationPrevDisabled"
                @click="handleMinervaPaginationPrev"
              >
                <cdx-icon :icon="cdxIconExpand" size="small" class="minerva-pagination-icon minerva-pagination-icon--prev" />
              </button>
              <button
                class="minerva-pagination-btn"
                type="button"
                aria-label="Next suggestion"
                :disabled="isMinervaPaginationNextDisabled"
                @click="handleMinervaPaginationNext"
              >
                <cdx-icon :icon="cdxIconExpand" size="small" class="minerva-pagination-icon" />
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="isMinervaSkin && isEditMode && showSuggestionsDisplay && isMinervaSheetOpen && availableSuggestionCount > 0"
          class="minerva-sheet-backdrop"
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
              <cdx-field>
                <template #label>
                  Navigation of suggestions (<a href="https://phabricator.wikimedia.org/T417821" target="_blank" rel="noopener">T417821</a>)
                </template>
                <div class="cdx-radio-group" role="radiogroup">
                  <cdx-radio
                    v-model="selectedPrototype"
                    name="suggestions-discoverability"
                    input-value="option-3"
                  >
                    Navigable arrows
                  </cdx-radio>
                  <cdx-radio
                    v-model="selectedPrototype"
                    name="suggestions-discoverability"
                    input-value="option-1"
                  >
                    Navigable bar
                  </cdx-radio>
                  <cdx-radio
                    v-model="selectedPrototype"
                    name="suggestions-discoverability"
                    input-value="option-4"
                  >
                    Overview with list of suggestions
                  </cdx-radio>
                  <cdx-radio
                    v-model="selectedPrototype"
                    name="suggestions-discoverability"
                    input-value="option-2"
                  >
                    Just navigate to 1st suggestion
                  </cdx-radio>
                </div>
              </cdx-field>
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
                <template #label>Others</template>
                <cdx-checkbox v-model="toastsEnabled">
                  Enable contextual Toasts (<a href="https://phabricator.wikimedia.org/T417827" target="_blank" rel="noopener">T417827</a>)
                </cdx-checkbox>
                <cdx-checkbox v-model="filteringEnabled">
                  Enable filtering (<a href="https://phabricator.wikimedia.org/T420648" target="_blank" rel="noopener">T420648</a>)
                </cdx-checkbox>
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
  CdxDialog
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
  cdxIconInfo,
  cdxIconWikiText
} from '@wikimedia/codex-icons';
import lordeImage from '../assets/lorde-1980.png';

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
const isEditToolbarScrolled = ref(false);
const isSuggestionLightFlash = ref(false);
const isMinervaAddMenuOpen = ref(false);
const isMinervaEditMenuOpen = ref(false);
const isMinervaAddLinkDialogOpen = ref(false);
const isMinervaAddCitationDialogOpen = ref(false);
const minervaToggleLocation = ref('outside');
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
    minervaRailToggleEnabled.value &&
    !showMinervaBottomRailToggle.value &&
    (!minervaMenuToggleEnabled.value || showSuggestions.value)
);
const showMinervaBottomRailToggle = computed(
  () => isMinervaSkin.value &&
    isEditMode.value &&
    ['option-3', 'option-4'].includes(activePrototype.value) &&
    (!minervaMenuToggleEnabled.value || showSuggestions.value) &&
    minervaRailToggleEnabled.value
);
const showMinervaRailArrows = computed(
  () => isMinervaSkin.value &&
    isEditMode.value &&
    activePrototype.value === 'option-3' &&
    showSuggestions.value &&
    !anySuggestionVisible.value
);
const showMinervaFilterButton = computed(
  () => isMinervaSkin.value &&
    isEditMode.value &&
    filteringEnabled.value &&
    showSuggestions.value
);
const showMinervaTopRailControls = computed(
  () => showMinervaStandardRailToggle.value
);
const showMinervaBottomRailControls = computed(
  () => showMinervaCollapsedCountRailToggle.value ||
    showMinervaBottomRailToggle.value ||
    showMinervaFilterButton.value ||
    showMinervaRailArrows.value
);
const showMinervaRail = computed(
  () => isMinervaSkin.value &&
    isEditMode.value &&
    (showMinervaTopRailControls.value || showMinervaBottomRailControls.value)
);
const showMinervaEditMenuTriggerDotBadge = computed(
  () => minervaMenuToggleEnabled.value && !showSuggestions.value && toggleBadgeCount.value > 0
);
const showDesktopFilterButton = computed(
  () => !isMinervaSkin.value && isEditMode.value && filteringEnabled.value && showSuggestions.value
);
const showDesktopFeedbackControls = computed(
  () => showDesktopFilterButton.value || (activePrototype.value === 'option-3' && showSuggestions.value && !anySuggestionVisible.value)
);
const overviewSuggestionItems = computed(() => getPendingSuggestionIdsForContext().map((id) => ({
  id,
  title: ({
    1: 'Add a citation',
    2: 'Add a citation',
    3: 'Add a citation',
    4: 'Remove external link',
    5: 'Link to a more specific page',
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
const minervaSuccessRef = ref(null);
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
let scrollReappearTimer = null;
let autoScrollTimer = null;
let savedArticleSelectionRange = null;
let lastArticleEditableElement = null;
const isSkinMenuOpen = ref(false);
const selectedSkin = ref('vector22');
const isMinervaSkin = computed(() => selectedSkin.value === 'minerva');
const minervaOpenSections = ref({
  'early-life': false,
  career: false,
  poetry: false,
  prose: false
});
const editSnapshot = ref([]);
const isMinervaSheetOpen = ref(false);
const activeMinervaSuggestion = ref(1);
const minervaSheetRef = ref(null);
const minervaSheetReturnDirection = ref(null);
const minervaSheetHeight = ref(0);

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
const editFullPageImprovedEnabled = ref(true);
const selectedPrototype = ref('option-4');
const toastsEnabled = ref(true);
const showSuggestionBadge = ref(false);
const showSuggestionInfoPreference = ref(true);
const dontShowSuggestionInfo = ref(false);
const pendingScrollSection = ref(null);
const minervaEditSectionOnly = ref(null);
const minervaSectionBannerDismissed = ref({
  'early-life': false,
  career: false,
  poetry: false,
  prose: false
});
const isMinervaOverviewSheetOpen = ref(false);
const editSectionEarlyLife = ref(null);
const editSectionCareer = ref(null);
const editSectionPoetry = ref(null);
const editSectionProse = ref(null);

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
  activePrototype.value === 'option-2' || activePrototype.value === 'option-4' || activePrototype.value === 'option-3'
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
const minervaSheetTitle = computed(() => {
  if (shouldShowEmptyState.value) return 'No suggestions';
  if (activeMinervaSuggestion.value === 4) return 'Remove external link';
  if (activeMinervaSuggestion.value === 5) return 'Link to a more specific page';
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
  toastsEnabled.value &&
  (activePrototype.value === 'option-1' ||
    activePrototype.value === 'option-2' ||
    activePrototype.value === 'option-3')
));
const shouldShowBanner = computed(() => {
  if (!showSuggestionNotification.value) return false;
  if (isArrowOnceMode.value && isMinervaSkin.value && minervaEditSectionOnly.value) {
    const sectionToSuggestionId = {
      career: 1,
      poetry: 8,
      prose: 7
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
const showMinervaSuccessMessage = computed(() => (
  showSuccessMessage1.value || showSuccessMessage2.value || showSuccessMessage3.value
));
const showSuggestionInfo = computed(() => (
  activePrototype.value === 'option-1' && showSuggestionInfoPreference.value
));
const isToneCheckMode = computed(() => toneCheckActive.value);
const isPasteCheckMode = computed(() => pasteCheckActive.value);
const activeEditCheckType = computed(() => {
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
  activePrototype.value !== 'option-1' && !isArrowOnceMode.value
));
const showMinervaHelpButton = computed(() => (
  isMinervaSkin.value &&
  isEditMode.value &&
  activePrototype.value !== 'option-1' && !isArrowOnceMode.value
));
const minervaAddMenuItems = computed(() => ([
  { value: 'cite', label: 'Cite', icon: cdxIconQuotes },
  { value: 'link', label: 'Link', icon: cdxIconLink }
]));
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
  if (activeMinervaSuggestion.value === 2 || activeMinervaSuggestion.value === 4) {
    return minervaPaginationIds.value.filter((id) => id === 2 || id === 4);
  }
  return [];
});
const minervaPaginationTotal = computed(() => minervaPaginationIdsForActiveSuggestion.value.length);
const minervaPaginationIndex = computed(() => {
  const index = minervaPaginationIdsForActiveSuggestion.value.indexOf(activeMinervaSuggestion.value);
  return index >= 0 ? index : 0;
});
const minervaPaginationLabel = computed(() => (
  `${minervaPaginationIndex.value + 1} of ${minervaPaginationTotal.value}`
));
const isMinervaPaginationPrevDisabled = computed(() => minervaPaginationIndex.value <= 0);
const isMinervaPaginationNextDisabled = computed(() => (
  minervaPaginationIndex.value >= minervaPaginationTotal.value - 1
));
const showMinervaPagination = computed(() => {
  if (activeMinervaSuggestion.value === 2 || activeMinervaSuggestion.value === 4) {
    return minervaPaginationTotal.value > 0;
  }
  return minervaPaginationTotal.value > 1;
});

function resetSuggestionState() {
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
    prose: false
  };
  toneCheckActive.value = false;
  toneCheckDismissed.value = false;
  toneCheckHighlightRef.value = null;
  toneCheckTriggeredByAmazing.value = false;
  pasteCheckActive.value = false;
  pasteCheckDismissed.value = false;
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
  showSuggestionNotification.value = mode === 'option-1' || mode === 'option-2' || mode === 'option-4' || mode === 'option-3';
  showSuggestionBadge.value = mode === 'option-1' || mode === 'option-2' || mode === 'option-4' || mode === 'option-3';
  isBannerDismissed.value = false;
  isBannerClosing.value = false;
  isBannerOpening.value = false;
  isSuggestionInfoOpen.value = false;
  isMinervaInfoSheetOpen.value = false;
  showSuggestionInfoPreference.value = true;
  dontShowSuggestionInfo.value = false;
  isBannerDelayReady.value = false;
  enableAutoScroll.value = false;
  showSuggestions.value = mode === 'option-1' || mode === 'option-2' || mode === 'option-4' || mode === 'option-3';
  showSuggestionToggle.value = true;
}

function openPrototypeDialog(fromSection = false) {
  if (isEditMode.value) return;
  if (!fromSection) {
    minervaEditSectionOnly.value = null;
  }
  isPrototypeDialogOpen.value = true;
}

function closePrototypeDialog() {
  isPrototypeDialogOpen.value = false;
}

function startPrototype() {
  applyPrototypeMode(selectedPrototype.value);
  closePrototypeDialog();
  enterEditMode();
}

function openEditAtSection(sectionId) {
  pendingScrollSection.value = sectionId;
  minervaEditSectionOnly.value = isMinervaSkin.value ? sectionId : null;
  if (isMinervaSkin.value && isArrowOnceMode.value) {
    minervaSectionBannerDismissed.value[sectionId] = false;
  }
  openPrototypeDialog(true);
}

function getEditSectionRefById(sectionId) {
  if (sectionId === 'early-life') return editSectionEarlyLife;
  if (sectionId === 'career') return editSectionCareer;
  if (sectionId === 'poetry') return editSectionPoetry;
  if (sectionId === 'prose') return editSectionProse;
  return null;
}

function showFullPageEdit(event) {
  const sectionId = event?.currentTarget?.closest('.minerva-edit-section')?.dataset?.section;
  const targetRef = sectionId ? getEditSectionRefById(sectionId) : null;
  const startY = typeof window !== 'undefined' ? window.scrollY : 0;
  const startTop = targetRef?.value ? targetRef.value.getBoundingClientRect().top : 0;
  const previousAvailable = minervaEditSectionOnly.value
    ? sectionSuggestionCount.value
    : availableSuggestionCount.value;
  minervaEditSectionOnly.value = null;
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
    if (!targetRef?.value || typeof window === 'undefined') return;
    const newTop = targetRef.value.getBoundingClientRect().top;
    window.scrollTo(0, Math.max(0, startY + (newTop - startTop)));
  });
  if (activePrototype.value === 'option-3' && isMinervaSkin.value) {
    nextTick(() => {
      const newAvailable = availableSuggestionCount.value;
      if (newAvailable > previousAvailable && shouldShowToasts.value) {
        showMinervaMoreSuggestionsToast.value = true;
        if (showSuggestions.value) {
          isBannerDismissed.value = false;
          isBannerDelayReady.value = true;
        }
        if (minervaMoreSuggestionsToastTimer) {
          clearTimeout(minervaMoreSuggestionsToastTimer);
        }
        minervaMoreSuggestionsToastTimer = setTimeout(() => {
          showMinervaMoreSuggestionsToast.value = false;
          minervaMoreSuggestionsToastTimer = null;
        }, 2000);
      }
    });
  }
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
  removeEditCheckMinervaMarkers(anchor);
  const text = highlightNode.textContent || '';
  highlightNode.replaceWith(document.createTextNode(text));
}

function removeCheckHighlight(highlightNode) {
  if (!highlightNode) return;
  const anchor = getEditCheckMinervaAnchor(highlightNode);
  removeEditCheckMinervaMarkers(anchor);
  highlightNode.remove();
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
  clearPasteCheck(false);
  clearToneCheck(false, true);
  isEditCheckExpanded.value = false;
  isEditCheckTextHovered.value = false;
  updateSuggestionVisibility();
}

function handlePasteCheckRemove() {
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
  clearToneCheck(false, true);
  clearPasteCheck(false);
  isEditCheckExpanded.value = false;
  isEditCheckTextHovered.value = false;
}

function handleToneCheckDecline() {
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
}

function closeMinervaAddMenu() {
  isMinervaAddMenuOpen.value = false;
}

function toggleMinervaEditMenu() {
  isMinervaEditMenuOpen.value = !isMinervaEditMenuOpen.value;
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
  if (!isMinervaAddMenuOpen.value && !isMinervaEditMenuOpen.value) return;
  const target = event.target;
  if (minervaAddMenuPanelRef.value?.contains(target)) return;
  if (minervaAddMenuTriggerRef.value?.contains(target)) return;
  if (minervaEditMenuPanelRef.value?.contains(target)) return;
  if (minervaEditMenuTriggerRef.value?.contains(target)) return;
  closeMinervaAddMenu();
  closeMinervaEditMenu();
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
  const nextId = minervaPaginationIdsForActiveSuggestion.value[minervaPaginationIndex.value - 1];
  const targetRef = getSuggestionRefById(nextId);
  if (targetRef) {
    openSuggestionAtTarget(nextId, targetRef, true);
  }
}

function handleMinervaPaginationNext() {
  if (isMinervaPaginationNextDisabled.value) return;
  const nextId = minervaPaginationIdsForActiveSuggestion.value[minervaPaginationIndex.value + 1];
  const targetRef = getSuggestionRefById(nextId);
  if (targetRef) {
    openSuggestionAtTarget(nextId, targetRef, true);
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

function advanceMinervaSuggestion(currentId) {
  nextTick(() => {
    const ids = (currentId === 2 || currentId === 4)
      ? minervaPaginationIds.value.filter((id) => id === 2 || id === 4)
      : minervaPaginationIds.value;
    if (!ids.length) {
      closeMinervaSuggestion();
      return;
    }
    const currentIndex = ids.indexOf(currentId);
    let nextId = ids[0];
    if (currentIndex >= 0) {
      nextId = ids[Math.min(currentIndex, ids.length - 1)];
    }
    const targetRef = getSuggestionRefById(nextId);
    if (targetRef) {
      openSuggestionAtTarget(nextId, targetRef, false);
    } else {
      closeMinervaSuggestion();
    }
  });
}

function handleBannerClose() {
  if (isBannerClosing.value || isBannerDismissed.value) return;
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
  if (!showSuggestions.value) {
    showSuggestions.value = true;
  }
  if (activePrototype.value === 'option-4' || activePrototype.value === 'option-3') {
    startAutoScrollIndicator();
  }
  if (activePrototype.value === 'option-2') {
    isArrowBounceActive.value = false;
  }
  if (activePrototype.value === 'option-3' && isMinervaSkin.value) {
    hasUsedOption4Button.value = true;
  }
  nextTick(() => {
    openFirstPendingSuggestionForContext();
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

function openFirstPendingSuggestionForContext() {
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
      openSuggestionAtTarget(suggestionId, targetRef, true);
      return;
    }
  }

  openFirstPendingSuggestion(true);
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
    return ids;
  }
  if (isSuggestion5Pending.value) ids.push(5);
  if (isSuggestion1Pending.value) ids.push(1);
  if (isSuggestion8Pending.value) ids.push(8);
  if (isSuggestion6Pending.value) ids.push(6);
  if (isSuggestion2Pending.value) ids.push(2);
  if (isSuggestion4Pending.value) ids.push(4);
  if (isSuggestion7Pending.value) ids.push(7);
  if (isSuggestion3Pending.value) ids.push(3);
  return ids;
}

function updateBannerArrowDirections() {
  if (
    !showSuggestions.value ||
    !['option-2', 'option-3'].includes(activePrototype.value)
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
  showBannerArrowDown.value = activePrototype.value === 'option-2'
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
  prose: editSectionProse
};

function scrollToEditSection(sectionId) {
  const targetRef = editSectionRefs[sectionId];
  if (targetRef && targetRef.value) {
    targetRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function updateSuggestionVisibility() {
  if (!showSuggestions.value) {
    anySuggestionVisible.value = false;
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
  const successVisible =
    (showSuccessMessage1.value && isVisible(suggestionsSidebarRef.value)) ||
    (showSuccessMessage2.value && isVisible(suggestionsSidebarRef2.value)) ||
    (showSuccessMessage3.value && isVisible(suggestionsSidebarRef3.value)) ||
    (showMinervaSuccessMessage.value && isVisible(minervaSuccessRef.value));
  anySuggestionVisible.value =
    successVisible ||
    isVisible(highlightedTextRef.value) ||
    isVisible(highlightedTextRef2.value) ||
    isVisible(highlightedTextRef4.value) ||
    isVisible(highlightedTextRef3.value) ||
    isVisible(highlightedTextRef5.value) ||
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
  updateBannerArrowDirections();
  updatePrimaryBannerDirection();
  updateMinervaSheetReturnDirection();
}

function updateEditToolbarScrolled() {
  if (typeof window === 'undefined') return;
  isEditToolbarScrolled.value = window.scrollY > 0;
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
      if (showMinervaPagination.value) {
        advanceMinervaSuggestion(1);
      } else {
        closeMinervaSuggestion();
      }
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
      if (showMinervaPagination.value) {
        advanceMinervaSuggestion(2);
      } else {
        closeMinervaSuggestion();
      }
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
      if (showMinervaPagination.value) {
        advanceMinervaSuggestion(3);
      } else {
        closeMinervaSuggestion();
      }
    }, 260);
  } else {
    closeMinervaSuggestion();
  }
  scheduleBannerReappear();
}

function handleYesSuggestion4() {
  isSuggestionResolved4.value = true;
  isCardExpanded4.value = false;
  if (isMinervaSkin.value && (activePrototype.value === 'option-1' || isArrowOnceMode.value)) {
    triggerMinervaDismiss(4);
    setTimeout(() => {
      if (showMinervaPagination.value) {
        advanceMinervaSuggestion(4);
      } else {
        closeMinervaSuggestion();
      }
    }, 260);
  } else {
    closeMinervaSuggestion();
  }
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
      if (showMinervaPagination.value) {
        advanceMinervaSuggestion(4);
      } else {
        closeMinervaSuggestion();
      }
    }, 260);
  } else {
    closeMinervaSuggestion();
  }
  scheduleBannerReappear();
}

function handleResolveGenericSuggestion(suggestionId) {
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
  closeMinervaSuggestion();
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
  closeMinervaSuggestion();
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
    showCitationPopup1.value = false;
    if (isMinervaSkin.value && (activePrototype.value === 'option-1' || isArrowOnceMode.value)) {
      if (showMinervaPagination.value) {
        advanceMinervaSuggestion(1);
      } else {
        closeMinervaSuggestion();
      }
    } else {
      closeMinervaSuggestion();
    }
    // Show success message instead of suggestion card
    showSuccessMessage1.value = true;
    // Hide success message after 4 seconds
    setTimeout(() => {
      showSuccessMessage1.value = false;
      nextTick(() => {
        updateSuggestionVisibility();
        scheduleBannerReappear();
      });
    }, 4000);
  }
}

// Function to create citation for suggestion 2
function createCitation2() {
  if (citationUrl2.value.trim()) {
    citationCounter.value++;
    citationNumber2.value = citationCounter.value;
    showCitationPopup2.value = false;
    if (isMinervaSkin.value && (activePrototype.value === 'option-1' || isArrowOnceMode.value)) {
      if (showMinervaPagination.value) {
        advanceMinervaSuggestion(2);
      } else {
        closeMinervaSuggestion();
      }
    } else {
      closeMinervaSuggestion();
    }
    // Show success message instead of suggestion card
    showSuccessMessage2.value = true;
    // Hide success message after 4 seconds
    setTimeout(() => {
      showSuccessMessage2.value = false;
      nextTick(() => {
        updateSuggestionVisibility();
        scheduleBannerReappear();
      });
    }, 4000);
  }
}

// Function to create citation for suggestion 3
function createCitation3() {
  if (citationUrl3.value.trim()) {
    citationCounter.value++;
    citationNumber3.value = citationCounter.value;
    showCitationPopup3.value = false;
    if (isMinervaSkin.value && (activePrototype.value === 'option-1' || isArrowOnceMode.value)) {
      if (showMinervaPagination.value) {
        advanceMinervaSuggestion(3);
      } else {
        closeMinervaSuggestion();
      }
    } else {
      closeMinervaSuggestion();
    }
    // Show success message instead of suggestion card
    showSuccessMessage3.value = true;
    // Hide success message after 4 seconds
    setTimeout(() => {
      showSuccessMessage3.value = false;
      nextTick(() => {
        updateSuggestionVisibility();
        scheduleBannerReappear();
      });
    }, 4000);
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

watch(activePrototype, (value) => {
  isMinervaOverviewSheetOpen.value = false;
  if (value === 'option-3' || value === 'option-4') {
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
  () => [showSuggestions.value, showEmptyState.value, isMinervaSkin.value],
  ([suggestionsActive, emptyActive, isMinerva]) => {
    if (!suggestionsActive) {
      isMinervaOverviewSheetOpen.value = false;
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
  if (shouldShowToasts.value && oldValue > 0 && newValue === 0) {
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
  if (shouldShowToasts.value && newValue === 0 && oldValue !== undefined && newValue !== oldValue) {
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
  syncMinervaArrowOnlyVisibility();
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

function openSuggestionAtTarget(id, targetRef, expandAfterScroll = false) {
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
    const shouldScroll = target && !isTargetVisibleInViewport(target);
    if (shouldScroll) {
      startAutoScrollIndicator();
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        openSuggestion(id);
      }, 1000);
      return;
    }
  }
  openSuggestion(id);
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
    { id: 'prose', ref: editSectionProse }
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

function scrollToSuggestionByDirection(direction) {
  if (!isEditMode.value || !showSuggestions.value) return;
  const pendingTargets = getPendingSuggestionTargets();
  if (!pendingTargets.length) return;
  const currentY = window.scrollY + window.innerHeight / 2;
  const positionedTargets = pendingTargets
    .map((target) => ({
      ...target,
      top: target.ref.value.getBoundingClientRect().top + window.scrollY
    }))
    .sort((a, b) => a.top - b.top);
  if (direction === 'down') {
    const below = positionedTargets.filter((target) => target.top > currentY);
    if (below.length) {
      openSuggestionAtTarget(below[0].id, below[0].ref, true);
      return;
    }
    return;
  }
  if (direction === 'up') {
    const above = positionedTargets.filter((target) => target.top < currentY);
    if (above.length) {
      openSuggestionAtTarget(above[above.length - 1].id, above[above.length - 1].ref, true);
    }
  }
}

function openFirstPendingSuggestion(expandAfterScroll = false) {
  if (!isEditMode.value || !showSuggestions.value) return;

  const suggestion1Pending = citationNumber1.value === null && !isSuggestionDeclined1.value && !showSuccessMessage1.value;
  const suggestion2Pending = citationNumber2.value === null && !isSuggestionDeclined2.value && !showSuccessMessage2.value;
  const suggestion3Pending = citationNumber3.value === null && !isSuggestionDeclined3.value && !showSuccessMessage3.value;
  const suggestion4Pending = !isSuggestionResolved4.value && !isSuggestionDeclined4.value && !showSuccessMessage4.value;
  const suggestion5Pending = !isSuggestionResolved5.value && !isSuggestionDeclined5.value;
  const suggestion6Pending = !isSuggestionResolved6.value && !isSuggestionDeclined6.value;
  const suggestion7Pending = !isSuggestionResolved7.value && !isSuggestionDeclined7.value;
  const suggestion8Pending = !isSuggestionResolved8.value && !isSuggestionDeclined8.value;

  if (suggestion5Pending) {
    openSuggestionAtTarget(5, highlightedTextRef5, expandAfterScroll);
  } else if (suggestion1Pending) {
    openSuggestionAtTarget(1, highlightedTextRef, expandAfterScroll);
  } else if (suggestion8Pending) {
    openSuggestionAtTarget(8, highlightedTextRef8, expandAfterScroll);
  } else if (suggestion6Pending) {
    openSuggestionAtTarget(6, highlightedTextRef6, expandAfterScroll);
  } else if (suggestion2Pending) {
    openSuggestionAtTarget(2, highlightedTextRef2, expandAfterScroll);
  } else if (suggestion4Pending) {
    openSuggestionAtTarget(4, highlightedTextRef4, expandAfterScroll);
  } else if (suggestion7Pending) {
    openSuggestionAtTarget(7, highlightedTextRef7, expandAfterScroll);
  } else if (suggestion3Pending) {
    openSuggestionAtTarget(3, highlightedTextRef3, expandAfterScroll);
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
    window.addEventListener('resize', alignBothSuggestions);
    window.addEventListener('scroll', alignBothSuggestions, true); // true for capture phase
    window.addEventListener('resize', updateMinervaSheetHeight);
    window.addEventListener('scroll', updateSuggestionVisibility, true);
    window.addEventListener('resize', updateSuggestionVisibility);
    window.addEventListener('scroll', updateEditToolbarScrolled, true);
    window.addEventListener('scroll', handleScrollReappear, true);
    updateEditToolbarScrolled();
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
    window.removeEventListener('scroll', updateSuggestionVisibility, true);
    window.removeEventListener('resize', updateSuggestionVisibility);
    window.removeEventListener('scroll', updateEditToolbarScrolled, true);
    window.removeEventListener('scroll', handleScrollReappear, true);
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
  if (scrollReappearTimer) {
    clearTimeout(scrollReappearTimer);
    scrollReappearTimer = null;
  }
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
  restoreEditSnapshot();
  hasUnsavedChanges.value = false;
  closeMinervaSuggestion();
  isEditMode.value = false;
  isBannerDelayReady.value = false;
  isBannerClosing.value = false;
  isBannerOpening.value = false;
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

function toggleEditMode() {
  if (!isEditMode.value) {
    openPrototypeDialog();
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

function openMinervaSuggestion(suggestionId) {
  if (isMinervaSheetOpen.value && activeMinervaSuggestion.value === suggestionId) {
    closeMinervaSuggestion();
    return;
  }
  minervaSheetMode.value = 'suggestion';
  activeMinervaSuggestion.value = suggestionId;
  isMinervaSheetOpen.value = true;
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
}

function openMinervaSuggestionSheet(suggestionId) {
  minervaSheetMode.value = 'suggestion';
  activeMinervaSuggestion.value = suggestionId;
  isMinervaSheetOpen.value = true;
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
  isMinervaSheetOpen.value = false;
  minervaSheetReturnDirection.value = null;
  isCardExpanded.value = false;
  isCardExpanded2.value = false;
  isCardExpanded3.value = false;
  isCardExpanded4.value = false;
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

function captureEditSnapshot() {
  if (!pageRoot.value) {
    return;
  }
  const nodes = pageRoot.value.querySelectorAll('.article-text-editable');
  editSnapshot.value = Array.from(nodes).map((node) => ({
    node,
    html: node.innerHTML
  }));
}

function restoreEditSnapshot() {
  if (!editSnapshot.value.length) {
    return;
  }
  editSnapshot.value.forEach(({ node, html }) => {
    if (node) {
      node.innerHTML = html;
    }
  });
}

function undoEdits() {
  restoreEditSnapshot();
  hasUnsavedChanges.value = false;
}

// Mark article as edited
function markArticleEdited() {
  hasUnsavedChanges.value = true;
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
  font-family: 'Linux Libertine', 'Georgia', 'Times', serif;
  color: #54595d;
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
  padding: 10px 12px;
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
  align-items: center;
  gap: 8px;
}

.wikipedia-globe {
  height: 50px;
  width: auto;
}

.wikipedia-text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.wikipedia-title {
  font-family: 'Linux Libertine', 'Georgia', 'Times', serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
  color: #202122;
  letter-spacing: 0.5px;
}

.wikipedia-tagline {
  font-family: 'Linux Libertine', 'Georgia', 'Times', serif;
  font-size: 14px;
  line-height: 1.2;
  color: #202122;
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
  font-size: var(--font-size-xx-large, 21px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-height-xx-large, 27.3px);
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
  font-size: 21px;
  line-height: 27.3px;
  color: #202122;
  margin: 0;
  white-space: pre-wrap;
}

.section-edit {
  font-size: 12px;
  margin-left: 8px;
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
  z-index: 12;
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.vector-suggestions-arrow-controls {
  width: fit-content;
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
  font-size: 21px;
  font-weight: 400;
  line-height: 27.3px;
  color: #202122;
  margin: 0;
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
  z-index: 0;
}

.minerva-skin.edit-mode.minerva-edit-full-page-improved .minerva-suggestions-rail {
  background: var(--background-color-neutral-subtle, #f8f9fa);
}

.minerva-suggestions-rail-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 44px;
}

.minerva-suggestions-rail-controls--bottom {
  margin-top: auto;
}

.minerva-suggestions-rail-arrows {
  display: flex;
  flex-direction: column;
  gap: 0;
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
  transform: translateX(-50%);
  background: #202122;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 2px;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  z-index: 220;
  box-shadow: none;
}

.minerva-toast--more {
  top: calc(42px + 16px);
}

.minerva-toast--zero {
  top: calc(42px + 16px);
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

.minerva-sheet-header :deep(.cdx-icon) {
  color: var(--suggestion-color, var(--color-progressive, #36c));
}

.minerva-sheet-backdrop {
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 0;
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

.minerva-sheet-close {
  margin-left: auto;
  border: none;
  background: transparent;
  padding: 4px;
  cursor: pointer;
  color: var(--color-base, #202122);
}

.minerva-sheet-close :deep(.cdx-icon),
.minerva-sheet-close :deep(svg) {
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

.minerva-sheet-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.minerva-overview-sheet {
  right: 44px;
  padding: 0 0 16px;
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

.minerva-suggestions-rail-toggle--overview.minerva-suggestions-rail-toggle--active,
.minerva-suggestions-rail-toggle--overview.minerva-suggestions-rail-toggle--active :deep(button),
.minerva-suggestions-rail-toggle--overview.minerva-suggestions-rail-toggle--active :deep(.cdx-button__button) {
  background: var(--background-color-progressive-subtle, #e8eeff) !important;
  background-color: var(--background-color-progressive-subtle, #e8eeff) !important;
}

.minerva-sheet-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 0 12px;
  border-top: 1px solid #eaecf0;
}

.minerva-pagination-count {
  font-size: 14px;
  line-height: 20px;
  color: var(--color-subtle, #54595d);
}

.minerva-pagination-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.minerva-pagination-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-base, #202122);
}

.minerva-pagination-btn:disabled {
  color: var(--color-disabled, #a2a9b1);
  cursor: not-allowed;
}

.minerva-pagination-btn :deep(svg) {
  fill: currentColor;
}

.minerva-pagination-icon--prev {
  transform: rotate(180deg);
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
}

.vector-suggestions-arrow-controls .suggestions-banner-arrow-btn {
  width: 44px;
  height: 44px;
  padding: 0;
  background: var(--background-color-base, #ffffff);
}

.vector-suggestions-arrow-controls .suggestions-banner-arrow-btn + .suggestions-banner-arrow-btn {
  border-top: 1px solid var(--border-color-muted, #DADDE3);
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
  border-top: 1px solid var(--border-color-muted, #DADDE3);
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
.minerva-suggestions-toggle--active .suggestions-badge {
  background: var(--suggestion-color-subtle, var(--background-color-progressive-subtle, #e8eeff));
  color: var(--suggestion-color, var(--color-progressive, #36c));
  border-color: var(--suggestion-color, var(--border-color-progressive, #36c));
}

.suggestions-toggle-btn--active .suggestions-badge--zero,
.minerva-toolbar-toggle--active .suggestions-badge--zero,
.minerva-suggestions-rail-toggle--active .suggestions-badge--zero,
.minerva-suggestions-toggle--active .suggestions-badge--zero {
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

.minerva-sheet-header--empty .minerva-sheet-title {
  color: var(--color-placeholder, #72777d);
}

.minerva-empty-sheet-text {
  margin: 8px 0 0;
  font-size: 16px;
  line-height: 22px;
  color: var(--color-placeholder, #72777d);
}
</style>
